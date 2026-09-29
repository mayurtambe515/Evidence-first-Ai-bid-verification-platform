/**
 * Mock Government Portal Service - EPFO & ESIC
 * Integration Layer for Shram Suvidha Portal
 * DEMO / MOCK DATA
 */

export interface EPFOServiceResult {
  isMock: true;
  establishmentCode: string;
  establishmentName: string;
  status: 'Compliant' | 'Defaulter' | 'Exempted (<20 employees)';
  headcountReported: number;
  ecrFiledLastMonth: boolean;
  lastChecked: string;
}

export async function getEPFODetails(codeOrPan: string): Promise<EPFOServiceResult> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return {
    isMock: true,
    establishmentCode: 'TNMAS1290384000',
    establishmentName: 'SHREE TECH SOLUTIONS PVT LTD',
    status: 'Exempted (<20 employees)',
    headcountReported: 16,
    ecrFiledLastMonth: true,
    lastChecked: new Date().toISOString(),
  };
}

export async function getESICDetails(codeOrPan: string): Promise<{
  isMock: true;
  esicCode: string;
  status: string;
  coverageStatus: string;
  lastChecked: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return {
    isMock: true,
    esicCode: '51000987654321',
    status: 'Exempted',
    coverageStatus: 'Applicable wage limit exemption verified',
    lastChecked: new Date().toISOString(),
  };
}
