import { of, Observable, throwError, generate, switchMap } from 'rxjs';
import { CaseRepositoryService } from '../case-repository.service';
import { CaseDto, CaseSummaryDto, UserSummaryDto } from '@shared/models/case/query/case.dto';
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
  UserRepositoryMockService,
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
import { FieldType } from '@shared/models/auxiliar/query/auxiliar-response.model';
import { AttachmentDto } from '@shared/models/case/command/shared.dto';
import { BaseMockApiService } from './base-mock-api.service';
import { Injectable } from '@angular/core';
import {
  AttachmentResponseDto,
  ConsultationActivityDto,
} from '@shared/models/case/query/attachment.dto';
import { UserResponseDto } from '@shared/models/user/query/user-response.model';
import { AuxiliarValueRequestDto } from '@shared/models/auxiliar/command/auxiliar-request.model';

const seed = 12345; // fixed seed → same values every run
const rng = new Prando(seed);
@Injectable({
  providedIn: 'root',
})
export class CaseRepositoryMockService extends BaseMockApiService implements CaseRepositoryService {
  private cases: CaseDto[];
  constructor(private usersRepo: UserRepositoryMockService) {
    super();
    this.cases = this.generateMockCases();
  }

  getAll(): Observable<CaseSummaryDto[]> {
    return this.handleUnauthorized(() => this.ok(this.cases.map((c) => this.toSummary(c))));
  }

  getById(id: string): Observable<CaseDto> {
    return this.handleUnauthorized(() => {
      const caseDto = this.cases.find((c) => c.id === id);

      if (!caseDto) {
        return this.notFound();
      }

      return this.ok(caseDto);
    });
  }

  create(message: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    return this.handleUnauthorized(() => {
      const errors = CaseValidator.validate(message, files);
      if (errors.length) return this.badRequest(errors);

      const newCase = this.generateMockCase();
      return this.created(newCase);
    });
  }

  addActivity(id: string, message: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    return this.handleUnauthorized(() => {
      const index = this.cases.findIndex((c) => c.id === id);

      if (index === -1) {
        return this.notFound();
      }
      const existing = this.cases[index];

      const errors = CaseValidator.validate(message, files);
      if (errors.length) return this.badRequest(errors);

      // Determine creator: resolution = expert, consultation = case creator
      const activityCreator =
        message.type === ActivityType.RESOLUTION ? existing.expert ?? null : existing.creator;

      // Convert AthenasMessageDto to ActivityDto
      const newActivity: ActivityDto = {
        type: message.type,
        text: message.text || '',
        creationDate: new Date(),
        creator: activityCreator,
        consultation:
          message.type === ActivityType.CONSULTATION
            ? {
                attachments: [generateDvAttachment(this.generateCitizenDocumentData())], //By the moment, we don't convert parameters
              }
            : null,
        resolution:
          message.type === ActivityType.RESOLUTION
            ? {
                resolution: message.resolution!,
              }
            : null,
      };

      // Push the new activity
      existing.activities = existing.activities || [];
      existing.activities.push(newActivity);

      // Update lastConsultation / lastResolution and caseResolution if needed
      if (message.type === ActivityType.CONSULTATION) {
        existing.lastConsultation = newActivity.creationDate;
      } else if (message.type === ActivityType.RESOLUTION) {
        existing.lastResolution = newActivity.creationDate;
        if (message.resolution) {
          existing.caseResolution = message.resolution;
        }
      }
      // Replace in internal array
      this.cases[index] = existing;

      return this.ok(existing); // already a CaseDto
    });
  }

  assignExpert(id: string, expertId: string | null): Observable<CaseDto> {
    return this.handleUnauthorized(() => {
      const caseDto = this.cases.find((c) => c.id === id);
      if (!caseDto) return this.notFound();

      // Block changes if solved or archived
      if (caseDto.caseStatus === CaseStatus.SOLVED || caseDto.caseStatus === CaseStatus.ARCHIVED) {
        return this.badRequest(['Cannot assign expert: case is closed.']);
      }

      // If no expertId, simply unassign expert
      if (!expertId) {
        caseDto.expert = null;
        return this.ok(caseDto);
      }

      // expertId IS provided → lookup in user repo
      // We must return an Observable here
      return this.usersRepo.getById(expertId).pipe(
        switchMap((resp) => {
          if (!resp) {
            return this.badRequest(['Expert not found']);
          }

          const expertSummary = toUserSummaryDto(resp);
          caseDto.expert = expertSummary;

          if (caseDto.caseStatus === CaseStatus.OPEN) {
            caseDto.caseStatus = CaseStatus.PENDING;
          }

          return this.ok(caseDto);
        })
      );
    });
  }

  updateAuxiliarValues(id: string, values: AuxiliarValueRequestDto[]): Observable<CaseDto> {
    return this.handleUnauthorized(() => {
      const caseDto = this.cases.find((c) => c.id === id);
      if (!caseDto) return this.notFound();

      // Map incoming values → patch only id/alias/value
      for (const patch of values) {
        const original = caseDto.auxiliarValues?.find((v) => v.id === patch.id);
        if (original) {
          original.value = patch.value ?? null;
          original.alias = patch.alias;
        }
      }

      return this.ok(caseDto);
    });
  }

  delete(id: string): Observable<void> {
    return this.handleUnauthorized(() => {
      this.cases = this.cases.filter((c) => c.id !== id);
      return this.ok();
    });
  }

  private toSummary(caseDto: CaseDto): CaseSummaryDto {
    const {
      activities, // strip this
      ...summary
    } = caseDto;

    return summary;
  }

  private generateMockCases(count = 100): CaseDto[] {
    return Array.from({ length: count }, () => this.generateMockCase()).sort(
      (a, b) => b.lastConsultation.getTime() - a.lastConsultation.getTime()
    );
  }

  private generateCitizenDocumentData(): CitizenDocumentData {
    return {
      citizenship: randomCountryCode(), //Implement this method, should be a country code
      issuingCountry: randomName(),
      issuingDate: randomDateYearsAgo(1, 10),
      citizenName: randomName(),
      citizenSurnames: randomName(),
      documentType: randomElement(['P', 'ID', 'DL']),
      expiryDate: randomFutureDate(1, 10), //Implement this. Parameters are from year to year
      gender: randomElement(['M', 'F', 'X']),
      placeOfBirth: randomName(),
      personalId: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
      documentNumber: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      dateOfBirth: randomDateYearsAgo(20, 40),
      authority: 'National Authority',
    };
  }

  private generateMockCase(): CaseDto {
    const creationDate = randomCreationDate();
    const caseStatus = randomElement(Object.values(CaseStatus));

    const isSolved = caseStatus === CaseStatus.SOLVED;
    const isClarification = caseStatus === CaseStatus.CLARIFICATION_PENDING;
    const isArchived = caseStatus === CaseStatus.ARCHIVED;
    const isOpen = caseStatus === CaseStatus.OPEN;

    const creator = toUserSummaryDto(this.usersRepo.getRandomUser());

    const expert = !isOpen
      ? toUserSummaryDto(this.usersRepo.getRandomUserByGroup('experts')!)
      : null;

    // Base resolution for the case
    // Determine allowed resolutions based on case status
    let allowedResolutions: CaseResolution[];
    if (isSolved) {
      allowedResolutions = [CaseResolution.WITH_EVIDENCES, CaseResolution.WITHOUT_EVIDENCES]; // exclude INVALID_DOCUMENT, INSUFFICIENT_QUALITY, PENDING
    } else if (isClarification) {
      allowedResolutions = [CaseResolution.INVALID_DOCUMENT, CaseResolution.INSUFFICIENT_QUALITY]; // exclude WITH_EVIDENCES, WITHOUT_EVIDENCES, PENDING
    } else {
      allowedResolutions = [CaseResolution.PENDING]; // other statuses just use PENDING
    }

    // Pick a random allowed resolution
    const caseResolution = randomElement(allowedResolutions);

    // --- Activities --- //
    const consultationActivity = generateConsultationActivity(creator, creationDate);

    const citizen = this.generateCitizenDocumentData();

    var attachment = generateDvAttachment(citizen);
    addAttachment(consultationActivity.consultation!, attachment);

    const activities = [consultationActivity];

    let resolutionActivity: ActivityDto | null = null;

    if (isSolved) {
      resolutionActivity = generateResolutionActivity(expert!, creationDate, caseResolution);
      activities.push(resolutionActivity);
    }

    const lastConsultation = consultationActivity.creationDate;
    const lastResolution = resolutionActivity?.creationDate || null;

    return {
      id: generateGuid(),
      trackingNumber: randomTrackingNumber(),
      caseStatus,
      caseResolution,
      creationDate,
      lastConsultation,
      lastResolution,
      creator,
      expert,
      caseGroupId: null,
      auxiliarValues: randomAuxiliarValues(),
      alerts: [],
      personalId: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
      documentNumber: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      citizenName: randomName(),
      dateOfBirth: randomDateYearsAgo(20, 40),
      documentAttachmentType: randomElement(Object.values(DocumentAttachmentType)),
      activities,
    };
  }
}

function generateResolutionActivity(
  expert: UserSummaryDto,
  lastUpdated: Date,
  resolution: CaseResolution
): ActivityDto {
  // Generate random minutes between 1 and 5 (inclusive)
  const minutesToAdd = rng.nextInt(1, 5);

  // Create a new date with the added minutes
  const creationDate = new Date(lastUpdated.getTime() + minutesToAdd * 60000);

  return {
    type: ActivityType.RESOLUTION,
    text: 'Case resolved',
    creationDate,
    creator: expert,
    resolution: {
      resolution: resolution,
    },
  };
}

export function toUserSummaryDto(user: UserResponseDto): UserSummaryDto {
  return {
    externalId: user.id, // or another field if needed
    username: user.username,
    email: user.email,
  };
}

function generateConsultationActivity(creator: UserSummaryDto, creationDate: Date): ActivityDto {
  return {
    type: ActivityType.CONSULTATION,
    text: 'Consultation activity',
    creationDate,
    creator,
    consultation: {
      attachments: [],
    },
  };
}

interface CitizenDocumentData {
  citizenship: string;
  issuingCountry: string;
  issuingDate: Date;
  citizenName: string;
  citizenSurnames: string;
  documentType: string; // 'P' | 'ID' | 'DL'
  expiryDate: Date;
  gender: string; // 'M' | 'F' | 'X'
  placeOfBirth: string;
  personalId: string;
  documentNumber: string;
  dateOfBirth: Date;
  authority: string;
}

function addAttachment(activity: ConsultationActivityDto, attachment: AttachmentResponseDto) {
  activity.attachments.push(attachment);
}

function generateDvAttachment(data: CitizenDocumentData): AttachmentResponseDto {
  return {
    attachmentType: AttachmentType.DOCUMENT_DV,
    name: 'ScanDoc1',
    metadata: null,

    documentDvAttachment: {
      documentType: DocumentAttachmentType.TD1,

      scannerDvData: {
        nombre: data.documentType === 'ID' ? 'ID Card' : 'Passport',
        tipoDocumento: data.documentType,
        codigoPais: data.issuingCountry,
        pais: data.citizenship,
        probability: 0,

        chip: {
          fotoId: DOCUMENT_DV_ATTACHMENT_CHIP,
          idPersonal: data.personalId,
          tipoDocumento: data.documentType,
          paisExpedidor: data.issuingCountry,
          numeroDocumento: data.documentNumber,
          fechaCaducidad: data.expiryDate.toISOString(),
          fechaExpedicion: data.issuingDate.toISOString(),
          nombre: data.citizenName,
          apellidos: data.citizenSurnames,
          fechaNacimiento: data.dateOfBirth.toISOString(),
          nacionalidad: data.citizenship,
          sexo: data.gender,
          lugarNacimiento: data.placeOfBirth,
          mrzCode: 'TODO: generate MRZ from data',
        },

        visual: {
          fotoId: DOCUMENT_DV_ATTACHMENT_VISUAL,
          idPersonal: data.personalId,
          tipoDocumento: data.documentType,
          paisExpedidor: data.issuingCountry,
          numeroDocumento: data.documentNumber,
          fechaCaducidad: data.expiryDate.toISOString(),
          fechaExpedicion: data.issuingDate.toISOString(),
          nombre: data.citizenName,
          apellidos: data.citizenSurnames,
          fechaNacimiento: data.dateOfBirth.toISOString(),
          nacionalidad: data.citizenship,
          sexo: data.gender,
          lugarNacimiento: data.placeOfBirth,
          mrzCode: 'TODO: generate MRZ',
        },

        mrz: {
          fotoId: null,
          idPersonal: data.personalId,
          tipoDocumento: data.documentType,
          paisExpedidor: data.issuingCountry,
          numeroDocumento: data.documentNumber,
          fechaCaducidad: data.expiryDate.toISOString(),
          fechaExpedicion: data.issuingDate.toISOString(),
          nombre: data.citizenName,
          apellidos: data.citizenSurnames,
          fechaNacimiento: data.dateOfBirth.toISOString(),
          nacionalidad: data.citizenship,
          sexo: data.gender,
          lugarNacimiento: data.placeOfBirth,
          mrzCode: 'TODO: generate MRZ',
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

function randomCountryCode(): string {
  const codes = [
    'ESP',
    'FRA',
    'DEU',
    'ITA',
    'PRT',
    'GBR',
    'USA',
    'CAN',
    'MEX',
    'BRA',
    'ARG',
    'CHL',
    'COL',
    'PER',
    'AUS',
    'NZL',
    'JPN',
    'CHN',
    'KOR',
    'IND',
    'ZAF',
    'MAR',
    'EGY',
    'TUR',
  ];
  return randomElement(codes);
}

function randomFutureDate(minYears: number, maxYears: number): Date {
  const years = Math.floor(Math.random() * (maxYears - minYears + 1)) + minYears;
  const now = new Date();

  return new Date(
    now.getFullYear() + years,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );
}

function randomCreationDate(): Date {
  // Define your fixed date range
  const today = new Date();
  const end = today.getTime();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).getTime();

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
