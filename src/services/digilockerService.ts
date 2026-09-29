/**
 * Mock Government Portal Service - DigiLocker
 * National Digital Document Wallet & Cryptographic Signature Registry
 * DEMO / MOCK DATA
 */

export interface DigiLockerDocVerification {
  isMock: true;
  docUri: string;
  issuerId: string;
  issuerName: string;
  digiLockerVerified: boolean;
  docHashSHA256: string;
  timestamp: string;
}

export async function verifyDigiLockerDocument(docUri: string): Promise<DigiLockerDocVerification> {
  await new Promise((resolve) => setTimeout(resolve, 260));
  return {
    isMock: true,
    docUri,
    issuerId: 'in.gov.gstn',
    issuerName: 'GSTN Goods & Services Tax Network Authority',
    digiLockerVerified: true,
    docHashSHA256: '9f8e45a2b3c109d784a9e5b2c8f01a349b12e45c78d910a2b3c4d5e6f7a8b9c0',
    timestamp: new Date().toISOString(),
  };
}
