import { VerificationCode } from './VerificationCode';
import { VerificationGroup } from './VerificationGroup';
import { VerifyResponse } from './VerifyResponse';

export class Verification {
  public group: VerificationGroup;
  public code: VerificationCode;
  public value: number;
  public sourceMessage?: string;
  public expected?: string;
  public result?: string;

  constructor(data: {
    group: VerificationGroup;
    code: VerificationCode;
    value: number;
    sourceMessage?: string;
    expected?: string;
    result?: string;
  }) {
    this.group = data.group;
    this.code = data.code;
    this.value = data.value;
    this.sourceMessage = data.sourceMessage;
    this.expected = data.expected;
    this.result = data.result;
  }

  getStatus(): DOCUMENT_VALIDATION_RESULT {
    if (this.value === 1) {
      return DOCUMENT_VALIDATION_RESULT.OK;
    }
    if (this.value === 0) {
      return DOCUMENT_VALIDATION_RESULT.KO;
    }
    if (this.value === undefined || this.value === null) {
      return DOCUMENT_VALIDATION_RESULT.UNKNOWN;
    }
    return DOCUMENT_VALIDATION_RESULT.WARNING;
  }

  format(): ValidationData {
    return {
      group: getVerificationGroupName(this.group),
      field: getVerificationCodeName(this.code),
      value: this.sourceMessage,
      status: this.getStatus(),
    };
  }
}

export const verificationGroups = [
  { value: VerificationGroup.MRZ, text: 'MRZ' },
  { value: VerificationGroup.Chip, text: 'Chip' },
  { value: VerificationGroup.Integrity, text: 'Integrity' },
  { value: VerificationGroup.Validity, text: 'Validity' },
  { value: VerificationGroup.OCR, text: 'OCR' },
  { value: VerificationGroup.Security, text: 'Security' },
  { value: VerificationGroup.FingerprintQuality, text: 'FingerprintQuality' },
  {
    value: VerificationGroup.FingerprintSegmentation,
    text: 'FingerprintSegmentation',
  },
];

const getVerificationGroupName = (value: VerificationGroup) => {
  const group = verificationGroups.find((item) => item.value === value);
  return group?.text || `Group${value}`;
};

export const verificationCodes = [
  { value: VerificationCode.PassportExpiry, text: 'PassportExpiry' },
  { value: VerificationCode.TextMatch, text: 'TextMatch' },
  { value: VerificationCode.DataIntegrity, text: 'DataIntegrity' },
  { value: VerificationCode.CheckDigitComp, text: 'CheckDigitComp' },
  { value: VerificationCode.CheckDigit, text: 'CheckDigit' },
  { value: VerificationCode.ValidCountry, text: 'ValidCountry' },
  { value: VerificationCode.InvalidValue, text: 'InvalidValue' },
  {
    value: VerificationCode.ChipActiveAuthentication,
    text: 'ChipActiveAuthentication',
  },
  {
    value: VerificationCode.ChipPassiveAuthentication,
    text: 'ChipPassiveAuthentication',
  },
  { value: VerificationCode.ChipAccess, text: 'ChipAccess' },
  { value: VerificationCode.ChipAuthentication, text: 'ChipAuthentication' },
  { value: VerificationCode.ChipPresent, text: 'ChipPresent' },
  { value: VerificationCode.DG1DS, text: 'DG1DS' },
  { value: VerificationCode.ImageMatch, text: 'ImageMatch' },
  { value: VerificationCode.UV, text: 'UV' },
];

const getVerificationCodeName = (value: VerificationCode) => {
  const group = verificationCodes.find((item) => item.value === value);
  return group?.text || `Field${value}`;
};

export enum DOCUMENT_VALIDATION_RESULT {
  OK = 'ok',
  WARNING = 'warning',
  KO = 'ko',
  UNKNOWN = 'unknown',
}

export interface ValidationData {
  group: string;
  field: string;
  value?: string;
  status: DOCUMENT_VALIDATION_RESULT;
  errors?: string[];
}

export class DocumentValidationResult {
  id: string;
  result: DOCUMENT_VALIDATION_RESULT;
  validatedFieldCount: number;
  report: {
    mrzValid: boolean;
    expired: boolean;
  };
  detail: ValidationData[];

  constructor() {
    this.id = '';
    this.result = DOCUMENT_VALIDATION_RESULT.KO;
    this.validatedFieldCount = 0;
    this.report = {
      mrzValid: false,
      expired: true,
    };
    this.detail = [];
  }
}

export class FingerprintValidationResult {
  mode?: 'auto' | 'manual';
  result?: DOCUMENT_VALIDATION_RESULT;
  verifyResult?: VerifyResponse;
  comparisonScore?: number;
  reason?: string;
}
