/**
 * Mock Government Portal Service - Udyam MSME
 * Integration Layer for Ministry of Micro, Small and Medium Enterprises
 * DEMO / MOCK DATA — Real Udyam API endpoints can be plugged in here.
 */

export interface UdyamVerificationResult {
  isMock: true;
  udyamNumber: string;
  enterpriseName: string;
  enterpriseType: 'Micro' | 'Small' | 'Medium';
  majorActivity: string;
  nicCode: string;
  status: 'Active' | 'Deregistered';
  aadhaarSeeded: boolean;
  investmentPlantMachineryCr: number;
  turnoverCr: number;
  lastChecked: string;
}

export async function getUdyamDetails(udyamNumber: string): Promise<UdyamVerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 320));

  return {
    isMock: true,
    udyamNumber,
    enterpriseName: 'Shree Tech Solutions Pvt. Ltd.',
    enterpriseType: 'Medium',
    majorActivity: 'Services & Custom System Integration',
    nicCode: '6201 - Computer programming, consultancy and related activities',
    status: 'Active',
    aadhaarSeeded: true,
    investmentPlantMachineryCr: 2.15,
    turnoverCr: 6.8,
    lastChecked: new Date().toISOString(),
  };
}
