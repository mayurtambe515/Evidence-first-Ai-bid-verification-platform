/**
 * Mock Government Portal Service - Startup India & NSIC
 * Integration Layer for DPIIT Recognition and NSIC Single Point Registration
 * DEMO / MOCK DATA
 */

export interface StartupIndiaResult {
  isMock: true;
  dippNumber: string;
  entityName: string;
  recognitionStatus: 'Recognized' | 'Expired' | 'Not Registered';
  validUntil: string;
  turnoverExemptionEligible: boolean;
  earnestMoneyExemptionEligible: boolean;
  lastChecked: string;
}

export async function getStartupIndiaDetails(dippOrPan: string): Promise<StartupIndiaResult> {
  await new Promise((resolve) => setTimeout(resolve, 240));
  return {
    isMock: true,
    dippNumber: 'DIPP99281',
    entityName: 'Shree Tech Solutions Pvt. Ltd.',
    recognitionStatus: 'Recognized',
    validUntil: '2028-03-31',
    turnoverExemptionEligible: true,
    earnestMoneyExemptionEligible: true,
    lastChecked: new Date().toISOString(),
  };
}

export async function getNSICDetails(panOrReg: string): Promise<{
  isMock: true;
  regNumber: string;
  status: string;
  storeDetails: string;
  lastChecked: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 240));
  return {
    isMock: true,
    regNumber: 'NSIC/GP/TN/2023/8819',
    status: 'Verified Active',
    storeDetails: 'IT Hardware & Telecom Switching Equipment',
    lastChecked: new Date().toISOString(),
  };
}
