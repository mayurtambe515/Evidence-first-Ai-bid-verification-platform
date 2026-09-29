/**
 * Mock Government Portal Service - ESIC
 * Integration Layer for Employees' State Insurance Corporation
 * DEMO / MOCK DATA
 */

export interface ESICVerificationResult {
  isMock: true;
  employerCode: string;
  status: 'Active' | 'Exempted' | 'Inactive';
  lastContributionPeriod: string;
  lastChecked: string;
}

export async function getESICRecord(panOrCode: string): Promise<ESICVerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    isMock: true,
    employerCode: 'ESIC-51-0982-11',
    status: 'Exempted',
    lastContributionPeriod: 'Exemption statement confirmed',
    lastChecked: new Date().toISOString(),
  };
}
