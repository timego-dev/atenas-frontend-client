import { of, Observable, throwError } from 'rxjs';
import { CaseRepositoryService } from '../case-repository.service';
import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { AthenasMessageDto } from '@shared/models/case/command/athenas-message.dto';
import {
  DIGITAL_ATTACHMENT_VIDEO_2,
  DOCUMENT_DV_ATTACHMENT_CHIP,
  DOCUMENT_DV_ATTACHMENT_IR,
  DOCUMENT_DV_ATTACHMENT_UV,
  DOCUMENT_DV_ATTACHMENT_VISUAL,
  DOCUMENT_DV_ATTACHMENT_VIZ,
  DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_EXPECTED,
  DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_RESULT,
  DOCUMENT_DV_FRONT_UV_PHOTO_REPLACE,
  DOCUMENT_DV_OCV_IR_MRZ_CHECK_EXPECTED,
  DOCUMENT_DV_OCV_IR_MRZ_CHECK_RESULT,
  DOCUMENT_DV_OCV_VIZ_CHIP_BACK_EXPECTED,
  DOCUMENT_DV_OCV_VIZ_CHIP_BACK_RESULT,
  DOCUMENT_DV_UV_MRZ_REPLACE_EXPECTED,
  DOCUMENT_DV_UV_MRZ_REPLACE_RESULT,
} from '@shared';
import {
  ActivityType,
  AttachmentType,
  CaseResolution,
  CaseStatus,
  DocumentAttachmentType,
} from '@shared/models/case/case.enums';

import { ActivityDto } from '@shared/models/case/query/activity.dto';
import Prando from 'prando';
import { FieldType } from '@shared/models/auxiliar/query/get-auxiliar-response.model';
import { AttachmentDto } from '@shared/models/case/command/shared.dto';
import { BaseMockApiService } from './base-mock-api.service';

const seed = 12345; // fixed seed → same values every run
const rng = new Prando(seed);

export class CaseRepositoryMockService extends BaseMockApiService implements CaseRepositoryService {
  private cases: CaseSummaryDto[] = generateMockCases();

  getAll(): Observable<CaseSummaryDto[]> {
    return this.handleUnauthorized(() => this.ok(this.cases));
  }

  getById(id: string): Observable<CaseDto> {
    return this.handleUnauthorized(() => {
      const summary = this.cases.find((c) => c.id === id);

      if (!summary) {
        return this.notFound();
      }
      return of(buildCaseDtoFromSummary(summary));
    });
  }

  create(message: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    return this.handleUnauthorized(() => {
      const errors = CaseValidator.validate(message, files);
      if (errors.length) return this.badRequest(errors);

      const newCase = buildCaseDtoFromSummary(generateMockCaseSummary());
      return this.created(newCase);
    });
  }

  update(id: string, message: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    return this.handleUnauthorized(() => {
      const index = this.cases.findIndex((c) => c.id === id);

      if (index === -1) {
        return this.notFound();
      }
      const existing = this.cases[index];

      const errors = CaseValidator.validate(message, files);
      if (errors.length) return this.badRequest(errors);

      const updatedSummary: CaseSummaryDto = {
        ...existing,
        lastUpdated: new Date(),
      };

      // Replace in internal array
      this.cases[index] = updatedSummary;

      // Convert to CaseDto
      const dto = buildCaseDtoFromSummary(updatedSummary);

      return this.ok(dto);
    });
  }

  delete(id: string): Observable<void> {
    return this.handleUnauthorized(() => {
      this.cases = this.cases.filter((c) => c.id !== id);
      return this.ok();
    });
  }
}

function buildCaseDtoFromSummary(summary: CaseSummaryDto): CaseDto {
  return {
    ...summary,

    // Deep-clone nested arrays/objects to avoid mutation
    auxiliarValues: summary.auxiliarValues?.map((v) => ({ ...v })),
    alerts: summary.alerts?.map((a) => ({ ...a })),
    creator: { ...summary.creator },
    expert: summary.expert ? { ...summary.expert } : null,

    // Add placeholder activities
    activities: [generateConsultationActivityWithDvAttachment()],
  };
}

function generateConsultationActivityWithDvAttachment(): ActivityDto {
  return {
    type: ActivityType.CONSULTATION,
    consultation: {
      attachments: [
        {
          attachmentType: AttachmentType.DOCUMENT_DV,
          name: 'ScanDoc1',
          metadata: null,
          documentDvAttachment: {
            documentType: DocumentAttachmentType.TD1,
            scannerDvData: {
              nombre: 'Spain Electronic ID Card 2015',
              tipoDocumento: 'ID Card',
              codigoPais: 'ESP',
              pais: 'Spain',
              probability: 0,
              chip: {
                fotoId: DOCUMENT_DV_ATTACHMENT_CHIP,
                idPersonal: '12345678R',
                tipoDocumento: 'TravelDocument1',
                paisExpedidor: 'ESP',
                numeroDocumento: 'BOD111111',
                fechaCaducidad: null,
                fechaExpedicion: null,
                nombre: 'MOCK',
                apellidos: 'SURNAME1 SURNAME2',
                fechaNacimiento: '123456',
                nacionalidad: 'ESP',
                sexo: 'M',
                mrzCode:
                  'IDESPBOD111111912345678R<<<<<<,1122334M2603183ESP<<<<<<<<<<<8,SURNAME1<SURNAME2<<MOCK<<<<<<<<',
                lugarNacimiento: null,
              },
              visual: {
                fotoId: DOCUMENT_DV_ATTACHMENT_VISUAL,
                idPersonal: '12345678R',
                tipoDocumento: 'TravelDocument1',
                paisExpedidor: 'ESP',
                numeroDocumento: 'BOD111111',
                fechaCaducidad: null,
                fechaExpedicion: null,
                nombre: 'MOCK',
                apellidos: 'SURNAME1 SURNAME2',
                fechaNacimiento: '123456',
                nacionalidad: 'ESP',
                sexo: 'M',
                mrzCode:
                  'IDESPBOD111111912345678R<<<<<<,1122334M2603183ESP<<<<<<<<<<<8,SURNAME1<SURNAME2<<MOCK<<<<<<<<',
                lugarNacimiento: null,
              },
              mrz: {
                fotoId: null,
                idPersonal: '12345678R',
                tipoDocumento: 'TravelDocument1',
                paisExpedidor: 'ESP',
                numeroDocumento: 'BOD111111',
                fechaCaducidad: null,
                fechaExpedicion: null,
                nombre: 'MOCK',
                apellidos: 'SURNAME1 SURNAME2',
                fechaNacimiento: '123456',
                nacionalidad: 'ESP',
                sexo: 'M',
                mrzCode:
                  'IDESPBOD111111912345678R<<<<<<,1122334M2603183ESP<<<<<<<<<<<8,SURNAME1<SURNAME2<<MOCK<<<<<<<<',
                lugarNacimiento: null,
              },
              imageMaps: [
                { type: 'IR', mediaBinaryId: DOCUMENT_DV_ATTACHMENT_IR },
                { type: 'UV', mediaBinaryId: DOCUMENT_DV_ATTACHMENT_UV },
                { type: 'VIZ', mediaBinaryId: DOCUMENT_DV_ATTACHMENT_VIZ },
              ],
            },

            mrzVizVerifications: [
              {
                nombre: 'OCR Birth Date',
                mrz: '991228',
                rawVIZ: '28 12 1999',
                viz: '991228',
              },
              {
                nombre: 'OCR Extract CAN',
                mrz: '',
                rawVIZ: '123456',
                viz: '123456',
              },
              {
                nombre: 'OCR Expiry Date',
                mrz: '260317',
                rawVIZ: '17 03 2026',
                viz: '260317',
              },
              {
                nombre: 'OCR Extract Street',
                mrz: '',
                rawVIZ: 'CRER. MOCK 42 B',
                viz: 'CRER.MOCKSTREET',
              },
              {
                nombre: 'OCR Document Number',
                mrz: 'BOD111111',
                rawVIZ: 'BOD111111',
                viz: 'BOD1111111',
              },
              {
                nombre: 'OCR Personal Number',
                mrz: '12345678R<<',
                rawVIZ: '12345678R',
                viz: '12345678R',
              },
              {
                nombre: 'OCR Extract Nationality',
                mrz: '',
                rawVIZ: 'ESP',
                viz: 'ESP',
              },
              {
                nombre: 'OCR Extract Place Of Birth',
                mrz: '',
                rawVIZ: 'SANT PERE DE RIBES\r\nBARCELONA\r\n',
                viz: 'SANTPEREDERIBES\r\nBARCELONA\r\n',
              },
              {
                nombre: 'OCR Last Name',
                mrz: 'SURNAME1<SURNAME2',
                rawVIZ: 'SURNAME1\rSURNAME2\r\n',
                viz: 'SURNAME1\rSURNAME2\r\n',
              },
              {
                nombre: 'OCR Extract City',
                mrz: '',
                rawVIZ: 'SANT PERE DE RIBES',
                viz: 'SANTPEREDERIBES',
              },
              {
                nombre: 'OCR First Name',
                mrz: 'MOCK<<<<<<<<',
                rawVIZ: 'MOCK',
                viz: 'MOCK',
              },
            ],

            documentVerifications: [
              {
                group: 'Chip',
                code: 'ChipAccess',
                value: 0,
                sourceMessage: 'Chip Access Verification',
                expected: null,
                result: null,
              },
              {
                group: 'Chip',
                code: 'ChipActiveAuthentication',
                value: 0,
                sourceMessage: 'Chip Active Authentication',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Date of birth check digit test',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Composite check digit test',
                expected: null,
                result: null,
              },
              {
                group: 'Chip',
                code: 'ChipPassiveAuthentication',
                value: 0,
                sourceMessage: 'Chip Passive Authentication',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Document number check digit test',
                expected: null,
                result: null,
              },
              {
                group: 'Chip',
                code: 'ChipPresent',
                value: 1,
                sourceMessage: 'Chip Present',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Expiry date check digit test',
                expected: null,
                result: null,
              },
              {
                group: 'Chip',
                code: 'ChipAuthentication',
                value: 0,
                sourceMessage: 'Chip Authentication',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Correct padding check',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Complete expiry date check',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: CompositeCheckDigit',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: DocumentType',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: DocumentNumberCheckDigit',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: ExpiryDateCheckDigit',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: ExpiryDate',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: DocumentNumber',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: DateOfBirth',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: DateOfBirthCheckDigit',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: Sex',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'TD1 type field check',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Valid expiry date check',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: OptionalData1',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: OptionalData2',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Valid date of birth check',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'TD1 number of rows and columns',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: Nationality',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: SecondaryIdentifier',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: IssuingState',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'ICAO characters: PrimaryIdentifier',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Issuer',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Nationality',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Expiry Date Check digit',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Date of Birth',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Document number Check digit',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Composite Check Digit',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Valid sex field check',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Given Name',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Expiry Date',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Date of Birth Check digit',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Document Number',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Valid issuing state check',
                expected: null,
                result: null,
              },
              {
                group: 'MRZ',
                code: 'InvalidValue',
                value: 1,
                sourceMessage: 'Valid nationality check',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Sex',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'OCR Birth Date',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'OCR Expiry Date',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'OCR Document Number',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'OCR First Name',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'OCR Last Name',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'Data Integrity Chip - MRZ: Optional Data',
                expected: null,
                result: null,
              },
              {
                group: 'OCR',
                code: 'DataIntegrity',
                value: 1,
                sourceMessage: 'OCR Extract Nationality',
                expected: null,
                result: null,
              },
              {
                group: 'Integrity',
                code: 'TextMatch',
                value: 1,
                sourceMessage: 'OCR Personal Number',
                expected: null,
                result: null,
              },
              {
                group: 'OCR',
                code: 'DataIntegrity',
                value: 1,
                sourceMessage: 'OCR Extract CAN',
                expected: null,
                result: null,
              },
              {
                group: 'OCR',
                code: 'DataIntegrity',
                value: 1,
                sourceMessage: 'OCR Extract Place Of Birth',
                expected: null,
                result: null,
              },
              {
                group: 'OCR',
                code: 'DataIntegrity',
                value: 1,
                sourceMessage: 'OCR Extract Gender ',
                expected: null,
                result: null,
              },
              {
                group: 'OCR',
                code: 'DataIntegrity',
                value: 1,
                sourceMessage: 'OCR Extract City',
                expected: null,
                result: null,
              },
              {
                group: 'Security',
                code: 'UV',
                value: 1,
                sourceMessage: 'Front - UV Photo Replace',
                expected: null,
                result: DOCUMENT_DV_FRONT_UV_PHOTO_REPLACE,
              },
              {
                group: 'OCR',
                code: 'DataIntegrity',
                value: 1,
                sourceMessage: 'OCR Extract Street',
                expected: null,
                result: null,
              },
              {
                group: 'Security',
                code: 'ImageMatch',
                value: 1,
                sourceMessage: 'OCV Front - IR Chip Check',
                expected: DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_EXPECTED,
                result: DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_RESULT,
              },
              {
                group: 'Security',
                code: 'ImageMatch',
                value: 1,
                sourceMessage: 'OCV VIS Chip - Back',
                expected: DOCUMENT_DV_OCV_VIZ_CHIP_BACK_EXPECTED,
                result: DOCUMENT_DV_OCV_VIZ_CHIP_BACK_RESULT,
              },
              {
                group: 'Security',
                code: 'ImageMatch',
                value: 1,
                sourceMessage: 'OCV IR MRZ Check',
                expected: DOCUMENT_DV_OCV_IR_MRZ_CHECK_EXPECTED,
                result: DOCUMENT_DV_OCV_IR_MRZ_CHECK_RESULT,
              },
              {
                group: 'Security',
                code: 'UV',
                value: 1,
                sourceMessage: 'UV MRZ Replace',
                expected: DOCUMENT_DV_UV_MRZ_REPLACE_EXPECTED,
                result: DOCUMENT_DV_UV_MRZ_REPLACE_RESULT,
              },
            ],
          },
        },
      ],
    },
  };
}

function generateMockCases(count = 100): CaseSummaryDto[] {
  return Array.from({ length: count }, () => generateMockCaseSummary()).sort(
    (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
  );
}

function generateMockCaseSummary(): CaseSummaryDto {
  const creationDate = randomCreationDate();
  const caseStatus = randomElement(Object.values(CaseStatus));
  const isSolved = caseStatus === CaseStatus.SOLVED;
  const isArchived = caseStatus === CaseStatus.ARCHIVED;
  const isOpen = caseStatus === CaseStatus.OPEN;

  const creatorName = randomName();
  const shouldAssignExpert = !isOpen;

  const expertName = randomName();

  return {
    id: generateGuid(),
    trackingNumber: randomTrackingNumber(),
    caseStatus,
    caseResolution: isSolved
      ? randomElement(Object.values(CaseResolution))
      : CaseResolution.PENDING,
    creationDate,
    lastUpdated: creationDate,

    creator: {
      externalId: generateGuid(),
      username: creatorName,
      email: randomEmail(creatorName),
    },

    expert: shouldAssignExpert
      ? {
          externalId: generateGuid(),
          username: expertName!,
          email: randomEmail(expertName!),
        }
      : null,

    caseGroupId: null,
    auxiliarValues: randomAuxiliarValues(),
    alerts: [],

    notSolvedTime: isSolved || isArchived ? randomNotSolvedTime() : null,

    personalId: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
    documentNumber: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
    citizenName: randomName(),
    dateOfBirth: randomDateYearsAgo(20, 40),

    documentAttachmentType: randomElement(Object.values(DocumentAttachmentType)),
  };
}

function randomTrackingNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 8; i++) {
    suffix += chars[rng.nextInt(0, chars.length - 1)];
  }
  return `CG-${suffix}`;
}

// Deterministic GUID generator using prand
function generateGuid(): string {
  function s4() {
    return rng.nextInt(0, 0xffff).toString(16).padStart(4, '0');
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

// Random element from array using prand
function randomElement<T>(arr: T[]): T {
  const index = rng.nextInt(0, arr.length - 1);
  return arr[index];
}

function randomName(): string {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Elenor', 'Vernice', 'Makenna', 'Aliza'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Williams', 'Heathcote', 'Fadel', 'Hagenes'];
  return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
}

function randomEmail(name: string): string {
  const domains = ['hotmail.com', 'gmail.com', 'yahoo.com', 'example.com'];
  const normalized = name.toLowerCase().replace(' ', '.');
  return `${normalized}${rng.nextInt(0, 99)}@${randomElement(domains)}`;
}

function randomDateYearsAgo(minYears: number, maxYears: number): Date {
  // Ignore the arguments, they no longer make sense for absolute ranges
  const start = new Date(1970, 0, 1).getTime(); // Jan 1, 1970
  const end = new Date(1980, 11, 31).getTime(); // Dec 31, 1980

  const timestamp = rng.nextInt(start, end);

  return new Date(timestamp);
}

function randomCreationDate(): Date {
  // Define your fixed date range
  const start = new Date(2025, 10, 1).getTime(); // Nov 1, 2025 (month 10)
  const end = new Date(2025, 10, 26).getTime(); // Nov 26, 2025 (inclusive)

  // Generate a deterministic random timestamp between start and end
  const randomTimestamp = rng.nextInt(start, end);

  return new Date(randomTimestamp);
}

function randomNotSolvedTime(): string {
  const minutes = rng.nextInt(0, 4);
  const seconds = rng.nextInt(0, 59);
  return `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function randomAuxiliarValues() {
  return [
    {
      id: generateGuid(),
      title: 'Dinero en efectivo',
      alias: 'Efectivo',
      type: FieldType.CurrencyEuro,
      value: `${(rng.next() * 1000).toFixed(2).replace('.', ',')}`,
    },
    {
      id: generateGuid(),
      title: 'Grupo sanguineo',
      alias: 'Grupo sanguineo',
      type: FieldType.List,
      value: randomElement(['Grupo A', 'Grupo B', 'Grupo AB', 'Grupo O']),
    },
    {
      id: generateGuid(),
      title: 'Number Field Example',
      alias: 'Hijos',
      type: FieldType.Integer,
      value: `${rng.nextInt(0, 99)}`,
    },
    {
      id: generateGuid(),
      title: 'Motivo de consulta',
      alias: 'Motivo',
      type: FieldType.Text,
      value: randomElement([
        'Consulta rutinaria',
        'No et nostrum',
        'Revisión',
        'Solicitud de información',
      ]),
    },
    {
      id: generateGuid(),
      title: 'Temperatura corporal',
      alias: 'Temperatura',
      type: FieldType.Numeric,
      value: `${(36 + rng.next() * 6).toFixed(2).replace('.', ',')}`,
    },
  ];
}

export class CaseValidator {
  static validate(message: AthenasMessageDto, files: File[]): string[] {
    const errors: string[] = [];

    // 1️⃣ Message must exist
    if (!message) {
      errors.push('Message cannot be empty or invalid');
      return errors;
    }

    // 2️⃣ Ensure files array exists
    if (!files) {
      errors.push('Files array cannot be null');
      return errors;
    }

    const attachmentList = message.attachmentList ?? [];

    // 3️⃣ Each attachment object must exist
    attachmentList.forEach((a, idx) => {
      if (!a) errors.push(`Attachment at index ${idx} is not defined`);
    });

    // 4️⃣ Collect all referenced file names
    const referencedFileNames = CaseValidator.getAllAttachmentFileNames(attachmentList);

    // 5️⃣ Check for duplicates
    const duplicates = referencedFileNames.filter((v, i, arr) => arr.indexOf(v) !== i);
    if (duplicates.length) {
      errors.push(`Duplicate attachment names found: ${[...new Set(duplicates)].join(', ')}`);
    }

    // 6️⃣ Check for missing files (referenced in message but not provided)
    const missingFiles = referencedFileNames.filter((name) => !files.some((f) => f.name === name));
    if (missingFiles.length) {
      errors.push(`Missing files for attachments: ${missingFiles.join(', ')}`);
    }

    // 7️⃣ Check for extra files (provided but not referenced)
    const extraFiles = files
      .filter((f) => !referencedFileNames.includes(f.name))
      .map((f) => f.name);
    if (extraFiles.length) {
      errors.push(`Unexpected files received: ${extraFiles.join(', ')}`);
    }

    return errors;
  }

  private static getAllAttachmentFileNames(attachments: AttachmentDto[]): string[] {
    const names: string[] = [];

    for (const attachment of attachments) {
      if (!attachment) continue;

      switch (attachment.type) {
        case AttachmentType.DIGITAL:
          if (attachment.digitalData?.digitalFile)
            names.push(attachment.digitalData.digitalFile.name);
          break;

        case AttachmentType.DOCUMENT_DV:
          const dv = attachment.scannerDvData;
          if (dv?.documentData) {
            if (dv.documentData.chip?.fotoFile) names.push(dv.documentData.chip.fotoFile.name);
            if (dv.documentData.visual?.fotoFile) names.push(dv.documentData.visual.fotoFile.name);
            for (const img of dv.documentData.images ?? []) {
              if (img.file) names.push(img.file.name);
            }
          }

          if (dv?.documentVerifications?.verifications) {
            for (const v of dv.documentVerifications.verifications) {
              if (v.resultFile) names.push(v.resultFile.name);
              if (v.expectedFile) names.push(v.expectedFile.name);
            }
          }
          break;

        case AttachmentType.DOCUMENT_IDV:
          const idv = attachment.cloudIdvRequest;
          if (idv?.pages) {
            for (const page of idv.pages) {
              for (const ref of page.images.references ?? []) {
                if (ref.file) names.push(ref.file.name);
              }
            }
          }

          if (idv?.chipData) {
            if (idv.chipData.com) names.push(idv.chipData.com.name);
            if (idv.chipData.sod) names.push(idv.chipData.sod.name);
            for (const dgFile of Object.values(idv.chipData.dg ?? {})) {
              if (dgFile) names.push(dgFile.name);
            }
          }
          break;
      }
    }

    return names.filter((n) => n); // remove null/undefined
  }
}
