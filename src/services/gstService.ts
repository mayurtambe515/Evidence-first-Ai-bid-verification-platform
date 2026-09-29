/**
 * Mock Government Portal Service - GSTN
 * Integration Layer for Goods & Services Tax Network Public API
 * DEMO / MOCK DATA — Real GSTN API endpoints can be plugged in here.
 */

export interface GSTVerificationResult {
  isMock: true;
  gstin: string;
  legalName: string;
  tradeName: string;
  status: 'Active' | 'Suspended' | 'Cancelled';
  taxpayerType: 'Regular' | 'Composition';
  registrationDate: string;
  jurisdiction: string;
  filingCompliance: {
    gstr1: string;
    gstr3b: string;
    isCompliant: boolean;
  };
  lastChecked: string;
  apiLatencyMs: number;
}

export async function getGSTDetails(gstin: string): Promise<GSTVerificationResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const isKnownMismatch = gstin.includes('07AAKPB') || gstin.includes('9012');

  return {
    isMock: true,
    gstin,
    legalName: isKnownMismatch ? 'BRIGHT FUTURE TRADING ENTERPRISES' : 'Shree Tech Solutions Private Limited',
    tradeName: isKnownMismatch ? 'Bright Future Tech' : 'Shree Tech Solutions',
    status: isKnownMismatch ? 'Suspended' : 'Active',
    taxpayerType: 'Regular',
    registrationDate: '2017-07-01',
    jurisdiction: 'State Tax Ward 14, Division 3',
    filingCompliance: {
      gstr1: isKnownMismatch ? 'Default for last 2 quarters' : 'Filed (Current)',
      gstr3b: isKnownMismatch ? 'Pending for July 2026' : 'Filed (Current)',
      isCompliant: !isKnownMismatch,
    },
    lastChecked: new Date().toISOString(),
    apiLatencyMs: 142,
  };
}
