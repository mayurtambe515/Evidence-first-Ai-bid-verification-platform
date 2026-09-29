/**
 * Mock Government Portal Service - MCA21
 * Integration Layer for Ministry of Corporate Affairs Master Data
 * DEMO / MOCK DATA
 */

export interface MCAVerificationResult {
  isMock: true;
  cin: string;
  companyName: string;
  roc: string;
  companyCategory: string;
  classOfCompany: string;
  authorizedCapitalINR: number;
  paidUpCapitalINR: number;
  status: 'ACTIVE' | 'UNDER_LIQUIDATION' | 'STRIKE_OFF';
  dateOfIncorporation: string;
  lastChecked: string;
}

export async function getMCADetails(cinOrName: string): Promise<MCAVerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 310));

  return {
    isMock: true,
    cin: 'U72900TN2018PTC123456',
    companyName: 'SHREE TECH SOLUTIONS PRIVATE LIMITED',
    roc: 'ROC Chennai',
    companyCategory: 'Company limited by Shares',
    classOfCompany: 'Private',
    authorizedCapitalINR: 10000000,
    paidUpCapitalINR: 7500000,
    status: 'ACTIVE',
    dateOfIncorporation: '2018-04-12',
    lastChecked: new Date().toISOString(),
  };
}
