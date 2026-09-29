/**
 * Mock Government Portal Service - NSIC
 * National Small Industries Corporation Gateway
 * DEMO / MOCK DATA
 */

export interface NSICRecord {
  isMock: true;
  sprsNumber: string;
  unitName: string;
  category: string;
  validUpto: string;
  monetaryLimitINR: number;
  lastChecked: string;
}

export async function getNSICRecord(sprsNumber: string): Promise<NSICRecord> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    isMock: true,
    sprsNumber,
    unitName: 'Shree Tech Solutions Pvt. Ltd.',
    category: 'Information Technology Products & Peripherals',
    validUpto: '2027-06-30',
    monetaryLimitINR: 50000000,
    lastChecked: new Date().toISOString(),
  };
}
