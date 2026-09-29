/**
 * Unified Backend REST API Client for GeM AI Compliance Platform
 * Connects frontend components to the backend Express server
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

const API_BASE = '/api';

class ApiClient {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('gem_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // 0. Database Status
  async getDbStatus() {
    const res = await fetch(`${API_BASE}/db/status`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  // 1. Auth API
  async login(email: string, password?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('gem_auth_token', data.token);
    }
    return data;
  }

  // 2. Tenders API
  async getTenders() {
    const res = await fetch(`${API_BASE}/tenders`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async getTender(id: string) {
    const res = await fetch(`${API_BASE}/tenders/${id}`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async createTender(tenderData: any) {
    const res = await fetch(`${API_BASE}/tenders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(tenderData),
    });
    return res.json();
  }

  // 3. Bidders API
  async getBidders(searchQuery?: string) {
    const url = searchQuery
      ? `${API_BASE}/bidders?q=${encodeURIComponent(searchQuery)}`
      : `${API_BASE}/bidders`;
    const res = await fetch(url, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async getBidder(id: string) {
    const res = await fetch(`${API_BASE}/bidders/${id}`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async createBidder(bidderData: any) {
    const res = await fetch(`${API_BASE}/bidders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bidderData),
    });
    return res.json();
  }

  async verifyBidder(bidderId: string) {
    const res = await fetch(`${API_BASE}/bidders/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ bidderId }),
    });
    return res.json();
  }

  // 4. Documents API
  async uploadDocument(payload: {
    bidderId: string;
    tenderId?: string;
    documentType: string;
    title: string;
    fileName: string;
    fileSize?: string;
    fileData?: string;
    rawText?: string;
    officerUser?: string;
  }) {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async getBidderDocuments(bidderId: string) {
    const res = await fetch(`${API_BASE}/bidders/${bidderId}/documents`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  // 5. Verification & Compliance
  async runVerification(bidderId: string) {
    const res = await fetch(`${API_BASE}/verification/run`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ bidderId }),
    });
    return res.json();
  }

  async getBidderVerification(bidderId: string) {
    const res = await fetch(`${API_BASE}/bidders/${bidderId}/verification`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async getBidderCompliance(bidderId: string) {
    const res = await fetch(`${API_BASE}/bidders/${bidderId}/compliance`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async getBidderRisk(bidderId: string) {
    const res = await fetch(`${API_BASE}/bidders/${bidderId}/risk`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  // 6. Officer Remarks & Final Decision
  async saveRemarks(bidderId: string, remarks: string, officerName?: string, officerId?: string) {
    const res = await fetch(`${API_BASE}/bidders/${bidderId}/remarks`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ remarks, officerName, officerId }),
    });
    return res.json();
  }

  async recordFinalDecision(
    bidderId: string,
    decisionPayload: {
      decision: 'QUALIFIED' | 'DISQUALIFIED' | 'FURTHER_REVIEW';
      officerId: string;
      officerName: string;
      officerDesignation?: string;
      remarks: string;
      evidenceReviewed: string[];
    }
  ) {
    const res = await fetch(`${API_BASE}/bidders/${bidderId}/final-decision`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(decisionPayload),
    });
    return res.json();
  }

  // 7. Audit Trail API
  async getBidderAuditLogs(bidderId: string) {
    const res = await fetch(`${API_BASE}/bidders/${bidderId}/audit`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  async getAllAuditLogs() {
    const res = await fetch(`${API_BASE}/audit`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }
}

export const apiService = new ApiClient();
