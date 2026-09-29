/**
 * Mock Government Portal Service - Income Tax & PAN
 * Integration Layer for NSDL / Income Tax e-Filing API
 * DEMO / MOCK DATA
 */

export interface PANVerificationResult {
  isMock: true;
  pan: string;
  nameOnPan: string;
  status: 'Operative' | 'Inoperative' | 'Deactivated';
  category: 'Company' | 'Firm' | 'Individual';
  aadhaarLinked: boolean;
  itrFilingStatus: 'Filed for AY 2025-26' | 'Pending' | 'Non-Filer';
  lastChecked: string;
}

export async function getPANDetails(pan: string): Promise<PANVerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 280));

  return {
    isMock: true,
    pan,
    nameOnPan: 'SHREE TECH SOLUTIONS PRIVATE LIMITED',
    status: 'Operative',
    category: 'Company',
    aadhaarLinked: true,
    itrFilingStatus: 'Filed for AY 2025-26',
    lastChecked: new Date().toISOString(),
  };
}
