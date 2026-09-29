import crypto from 'crypto';
import { dbStore } from '../db/database';
import { AuditLog } from '../types';

export interface RecordAuditInput {
  user: string;
  userRole?: string;
  action: AuditLog['action'];
  entity: AuditLog['entity'];
  entityId: string;
  details: Record<string, any>;
}

export const auditService = {
  /**
   * Records an immutable audit log entry
   */
  recordLog(input: RecordAuditInput): AuditLog {
    const timestamp = new Date().toISOString();
    const id = `audit-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Hash chaining for tamper resistance
    const prevLog = dbStore.auditLogs[dbStore.auditLogs.length - 1];
    const prevHash = prevLog?.hash || '0'.repeat(32);

    const hashPayload = `${id}|${timestamp}|${input.user}|${input.action}|${input.entityId}|${JSON.stringify(input.details)}|${prevHash}`;
    const hash = crypto.createHash('sha256').update(hashPayload).digest('hex').slice(0, 32);

    const entry: AuditLog = {
      id,
      timestamp,
      user: input.user,
      userRole: input.userRole || 'OFFICER',
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      details: input.details,
      hash,
      previousHash: prevHash,
    };

    dbStore.auditLogs.unshift(entry);
    
    // Asynchronously persist to PostgreSQL
    import('../db/database').then(({ persistAuditLogToPg }) => {
      persistAuditLogToPg(entry).catch((e) => console.warn('[PostgreSQL] Audit persistence error:', e));
    });

    return entry;
  },

  /**
   * Retrieve all audit logs (read-only)
   */
  getAllAuditLogs(): AuditLog[] {
    return [...dbStore.auditLogs];
  },

  /**
   * Retrieve audit logs filtered by entity or bidder
   */
  getAuditLogsByEntity(entityId: string): AuditLog[] {
    return dbStore.auditLogs.filter(
      (log) => log.entityId === entityId || log.details?.bidderId === entityId
    );
  },
};
