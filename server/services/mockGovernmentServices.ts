// ====================================================================
// Mock Government Verification Services
//
// NOTICE: These services return simulated / mock data designed for
// demonstration, hackathons, and local development.
// All responses are clearly marked as "DEMO / MOCK DATA".
// Each service implements a standard interface to allow seamless plug-in
// replacement by real authorized Government of India APIs in production.
// ====================================================================

export interface GovernmentServiceResponse<T = Record<string, any>> {
  service: string;
  sourceType: 'DEMO / MOCK DATA';
  isAuthorizedLiveApi: false;
  queryParam: string;
  status: 'VERIFIED' | 'MISMATCH' | 'NOT_FOUND' | 'REQUIRES_REVIEW';
  latencyMs: number;
  verifiedAt: string;
  data: T;
  rawResponseSignature?: string;
}

// 1. GSTN Service Interface & Implementation
export interface IGstService {
  verifyGstin(gstin: string, expectedLegalName?: string): Promise<GovernmentServiceResponse>;
}

export const gstService: IGstService = {
  async verifyGstin(gstin: string, expectedLegalName?: string): Promise<GovernmentServiceResponse> {
    const cleanGst = (gstin || '').toUpperCase().trim();
    const latency = Math.floor(Math.random() * 80) + 110;

    let status: 'VERIFIED' | 'MISMATCH' | 'REQUIRES_REVIEW' = 'VERIFIED';
    let legalName = 'Shree Tech Solutions Pvt. Ltd.';
    let filingRemarks = 'All monthly returns (GSTR-1, GSTR-3B) filed on time';

    if (cleanGst.includes('27ABCDE1234F1Z5') || cleanGst.includes('SHREE')) {
      legalName = 'Shree Tech Solutions Pvt. Ltd.';
    } else if (cleanGst.includes('07AAAAA0000A1Z5') || cleanGst.includes('APEX')) {
      legalName = 'Apex Technologies Private Limited';
    } else if (cleanGst.includes('27BBBBB1111B1Z2') || cleanGst.includes('BHARAT')) {
      legalName = 'Bharat Logistics & Hardware Solutions LLP';
      status = 'REQUIRES_REVIEW';
      filingRemarks = 'GSTR-3B delayed for past 2 consecutive tax periods';
    } else if (cleanGst.includes('09CCCCC2222C1Z8') || cleanGst.includes('VERTEX')) {
      legalName = 'Vertex Infotech Solutons LLP';
      status = 'MISMATCH';
      filingRemarks = 'Legal structure registered as LLP while bid profile claims Limited';
    } else {
      legalName = expectedLegalName || 'Registered Enterprise Private Limited';
    }

    return {
      service: 'GSTN Goods & Services Tax Network Gateway API',
      sourceType: 'DEMO / MOCK DATA',
      isAuthorizedLiveApi: false,
      queryParam: cleanGst,
      status,
      latencyMs: latency,
      verifiedAt: new Date().toISOString(),
      data: {
        gstin: cleanGst || '27ABCDE1234F1Z5',
        legalName,
        tradeName: legalName.replace(' Private Limited', '').replace(' Pvt. Ltd.', ''),
        registrationStatus: status === 'MISMATCH' ? 'Active (Discrepancy)' : 'Active',
        taxpayerType: 'Regular Taxpayer',
        registrationDate: '2018-05-18',
        principalAddress: 'Chennai, Tamil Nadu 600002',
        complianceRating: status === 'VERIFIED' ? '10/10' : status === 'REQUIRES_REVIEW' ? '5/10' : '4/10',
        filingStatus: filingRemarks,
      },
    };
  },
};

// 2. Udyam MSME Service Interface & Implementation
export interface IUdyamService {
  verifyUdyam(udyamNumber: string, expectedEnterpriseName?: string): Promise<GovernmentServiceResponse>;
}

export const udyamService: IUdyamService = {
  async verifyUdyam(udyamNumber: string, expectedEnterpriseName?: string): Promise<GovernmentServiceResponse> {
    const cleanUdyam = (udyamNumber || '').toUpperCase().trim();
    const latency = Math.floor(Math.random() * 90) + 130;

    let status: 'VERIFIED' | 'MISMATCH' | 'REQUIRES_REVIEW' = 'VERIFIED';
    let enterpriseName = 'Shree Tech Solutions Pvt. Ltd.';
    let classification = 'Medium';

    if (cleanUdyam.includes('UDYAM-TN-02-0045129') || cleanUdyam.includes('SHREE')) {
      enterpriseName = 'Shree Tech Solutions Pvt. Ltd.';
      classification = 'Medium';
    } else if (cleanUdyam.includes('UDYAM-DL-01-0012345') || cleanUdyam.includes('APEX')) {
      enterpriseName = 'Apex Technologies Private Limited';
      classification = 'Medium';
    } else if (cleanUdyam.includes('UDYAM-MH-02-0098765') || cleanUdyam.includes('BHARAT')) {
      enterpriseName = 'Bharat Logistics & Hardware Solutions LLP';
      classification = 'Small';
      status = 'REQUIRES_REVIEW';
    } else {
      enterpriseName = expectedEnterpriseName || 'Registered MSME Enterprise';
    }

    return {
      service: 'Ministry of MSME Udyam Registration Portal',
      sourceType: 'DEMO / MOCK DATA',
      isAuthorizedLiveApi: false,
      queryParam: cleanUdyam,
      status,
      latencyMs: latency,
      verifiedAt: new Date().toISOString(),
      data: {
        udyamNumber: cleanUdyam || 'UDYAM-TN-02-0045129',
        enterpriseName,
        enterpriseType: classification,
        majorActivity: 'Services & Hardware Integration',
        nicCode: '62020 - Information technology consultancy services',
        status: status === 'REQUIRES_REVIEW' ? 'Classification Review Due' : 'Active & Verified',
        exemptionEligibility: 'Eligible for Statutory EMD Waiver & MSE Preference',
      },
    };
  },
};

// 3. PAN NSDL Service Interface & Implementation
export interface IPanService {
  verifyPan(pan: string, expectedName?: string): Promise<GovernmentServiceResponse>;
}

export const panService: IPanService = {
  async verifyPan(pan: string, expectedName?: string): Promise<GovernmentServiceResponse> {
    const cleanPan = (pan || '').toUpperCase().trim();
    const latency = Math.floor(Math.random() * 70) + 95;

    let status: 'VERIFIED' | 'MISMATCH' = 'VERIFIED';
    let entityName = 'Shree Tech Solutions Pvt. Ltd.';
    let category = 'Company';

    if (cleanPan.includes('AABCS1234D') || cleanPan.includes('SHREE')) {
      entityName = 'Shree Tech Solutions Pvt. Ltd.';
      category = 'Company';
    } else if (cleanPan.includes('AAAAA0000A') || cleanPan.includes('APEX')) {
      entityName = 'Apex Technologies Private Limited';
      category = 'Company';
    } else if (cleanPan.includes('BBBBB1111B') || cleanPan.includes('BHARAT')) {
      entityName = 'Bharat Logistics & Hardware Solutions LLP';
      category = 'Limited Liability Partnership';
    } else if (cleanPan.includes('CCCCC2222C') || cleanPan.includes('VERTEX')) {
      entityName = 'VERTEX INFOTECH SOLUTIONS LIMITED';
      category = 'Public Limited Company';
    } else {
      entityName = expectedName || 'Enterprise Corporate Entity';
    }

    return {
      service: 'Income Tax Department / NSDL PAN Verification Gateway',
      sourceType: 'DEMO / MOCK DATA',
      isAuthorizedLiveApi: false,
      queryParam: cleanPan,
      status,
      latencyMs: latency,
      verifiedAt: new Date().toISOString(),
      data: {
        pan: cleanPan || 'AABCS1234D',
        registeredName: entityName,
        entityCategory: category,
        status: 'Valid & Operative',
        fourthCharacterRule: cleanPan.length >= 4 ? `Character '${cleanPan[3]}' denotes ${category}` : 'Verified',
        aadhaarSeedingStatus: category === 'Company' ? 'Not Applicable' : 'Linked',
      },
    };
  },
};

// 4. MCA21 Corporate Affairs Service Interface & Implementation
export interface IMcaService {
  verifyCin(cinOrCompany: string): Promise<GovernmentServiceResponse>;
}

export const mcaService: IMcaService = {
  async verifyCin(cinOrCompany: string): Promise<GovernmentServiceResponse> {
    const cleanQuery = (cinOrCompany || '').toUpperCase().trim();
    const latency = Math.floor(Math.random() * 100) + 140;

    return {
      service: 'Ministry of Corporate Affairs MCA21 Registry',
      sourceType: 'DEMO / MOCK DATA',
      isAuthorizedLiveApi: false,
      queryParam: cleanQuery,
      status: 'VERIFIED',
      latencyMs: latency,
      verifiedAt: new Date().toISOString(),
      data: {
        cin: 'U72900TN2018PTC123456',
        companyName: 'Shree Tech Solutions Pvt. Ltd.',
        rocOffice: 'RoC Chennai',
        incorporationDate: '2018-04-10',
        companyStatus: 'Active',
        paidUpCapital: '₹ 1,50,00,000',
        authorizedCapital: '₹ 2,00,00,000',
        directorIdentificationNumbers: ['DIN-08123456', 'DIN-08123457'],
      },
    };
  },
};

// 5. EPFO Service Interface & Implementation
export interface IEpfoService {
  verifyEpfo(establishmentCode: string): Promise<GovernmentServiceResponse>;
}

export const epfoService: IEpfoService = {
  async verifyEpfo(establishmentCode: string): Promise<GovernmentServiceResponse> {
    const cleanCode = (establishmentCode || '').toUpperCase().trim();
    const latency = Math.floor(Math.random() * 80) + 120;

    return {
      service: 'Employees Provident Fund Organisation (EPFO) Verification API',
      sourceType: 'DEMO / MOCK DATA',
      isAuthorizedLiveApi: false,
      queryParam: cleanCode,
      status: 'VERIFIED',
      latencyMs: latency,
      verifiedAt: new Date().toISOString(),
      data: {
        establishmentCode: cleanCode || 'TN/CHN/0045678/000',
        establishmentName: 'Shree Tech Solutions Pvt. Ltd.',
        status: 'Active',
        lastElectronicChallanReceiptDate: '2026-08-15',
        totalContributingEmployees: 48,
        complianceStatus: 'Statutory Monthly ECR Filed',
      },
    };
  },
};

// 6. ESIC Service Interface & Implementation
export interface IEsicService {
  verifyEsic(employerCode: string): Promise<GovernmentServiceResponse>;
}

export const esicService: IEsicService = {
  async verifyEsic(employerCode: string): Promise<GovernmentServiceResponse> {
    const cleanCode = (employerCode || '').toUpperCase().trim();
    const latency = Math.floor(Math.random() * 70) + 110;

    return {
      service: 'Employees State Insurance Corporation (ESIC) Portal',
      sourceType: 'DEMO / MOCK DATA',
      isAuthorizedLiveApi: false,
      queryParam: cleanCode,
      status: 'VERIFIED',
      latencyMs: latency,
      verifiedAt: new Date().toISOString(),
      data: {
        employerCode: cleanCode || '51000123450000607',
        employerName: 'Shree Tech Solutions Pvt. Ltd.',
        status: 'Active Employer Code',
        lastContributionMonth: 'August 2026',
        complianceRecord: 'Regular Contributions Clear',
      },
    };
  },
};

// 7. Startup India DPIIT Service Interface & Implementation
export interface IStartupService {
  verifyDpiit(recognitionNumber: string): Promise<GovernmentServiceResponse>;
}

export const startupService: IStartupService = {
  async verifyDpiit(recognitionNumber: string): Promise<GovernmentServiceResponse> {
    const cleanNumber = (recognitionNumber || '').toUpperCase().trim();
    const latency = Math.floor(Math.random() * 60) + 90;

    return {
      service: 'Department for Promotion of Industry and Internal Trade (DPIIT) / Startup India',
      sourceType: 'DEMO / MOCK DATA',
      isAuthorizedLiveApi: false,
      queryParam: cleanNumber,
      status: 'VERIFIED',
      latencyMs: latency,
      verifiedAt: new Date().toISOString(),
      data: {
        recognitionNumber: cleanNumber || 'DIPP-78241',
        entityName: 'Shree Tech Solutions Pvt. Ltd.',
        certificateStatus: 'Recognized Startup Enterprise',
        validity: 'Valid under DPIIT Startup Recognition Framework',
        priorExperienceTurnoverExemption: 'Eligible for Relaxed Norms under GFR 149 / Cl. 8.4',
      },
    };
  },
};

// 8. NSIC Single Point Registration Service Interface & Implementation
export interface INsicService {
  verifyNsic(sprsNumber: string): Promise<GovernmentServiceResponse>;
}

export const nsicService: INsicService = {
  async verifyNsic(sprsNumber: string): Promise<GovernmentServiceResponse> {
    const cleanNumber = (sprsNumber || '').toUpperCase().trim();
    const latency = Math.floor(Math.random() * 80) + 130;

    return {
      service: 'National Small Industries Corporation (NSIC) SPRS Portal',
      sourceType: 'DEMO / MOCK DATA',
      isAuthorizedLiveApi: false,
      queryParam: cleanNumber,
      status: 'VERIFIED',
      latencyMs: latency,
      verifiedAt: new Date().toISOString(),
      data: {
        registrationNumber: cleanNumber || 'NSIC/GP/CHN/2024/0912',
        enterpriseName: 'Shree Tech Solutions Pvt. Ltd.',
        storeCategory: 'IT Hardware, Computer Systems & Peripherals',
        monetaryLimit: '₹ 3,50,00,000',
        status: 'Valid SPRS Registration',
        validTill: '2027-03-31',
      },
    };
  },
};

export const allMockGovernmentServices = {
  gstService,
  udyamService,
  panService,
  mcaService,
  epfoService,
  esicService,
  startupService,
  nsicService,
};
