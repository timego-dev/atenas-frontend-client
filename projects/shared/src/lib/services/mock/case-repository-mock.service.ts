import { of, Observable } from 'rxjs';
import { CaseRepositoryService } from '../case-repository.service';
import { CaseDto, CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { AthenasMessageDto } from '@shared/models/case/command/athenas-message.dto';
import { ActivityType, AttachmentType, CaseResolution, CaseStatus, DigitalAttachmentType, DocumentAttachmentType } from '@shared/models/shared.enums';
import { DIGITAL_ATTACHMENT_VIDEO_2, DOCUMENT_DV_ATTACHMENT_CHIP, DOCUMENT_DV_ATTACHMENT_IR, DOCUMENT_DV_ATTACHMENT_UV, DOCUMENT_DV_ATTACHMENT_VISUAL, DOCUMENT_DV_ATTACHMENT_VIZ, DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_EXPECTED, DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_RESULT, DOCUMENT_DV_FRONT_UV_PHOTO_REPLACE, DOCUMENT_DV_OCV_IR_MRZ_CHECK_EXPECTED, DOCUMENT_DV_OCV_IR_MRZ_CHECK_RESULT, DOCUMENT_DV_OCV_VIZ_CHIP_BACK_EXPECTED, DOCUMENT_DV_OCV_VIZ_CHIP_BACK_RESULT, DOCUMENT_DV_UV_MRZ_REPLACE_EXPECTED, DOCUMENT_DV_UV_MRZ_REPLACE_RESULT } from '@shared';


export class CaseRepositoryMockService implements CaseRepositoryService {
  private cases: CaseSummaryDto[] = [];

  getAll(): Observable<CaseSummaryDto[]> {
    // Map over the cases and adjust dates dynamically
    const now = new Date();
    const updatedCases = this.cases.map(c => {
      // Clone the object so we don't mutate the original mock array
      const clone = { ...c };

      // Randomize the creationDate within last 7 days
      const randomMinutesAgo = Math.floor(Math.random() * 7 * 24 * 60); // up to 7 days
      clone.creationDate = new Date(now.getTime() - randomMinutesAgo * 60_000);

      // Randomize lastUpdated to be after creationDate but before now
      const minUpdateTime = clone.creationDate.getTime();
      const randomUpdateTime = minUpdateTime + Math.floor(Math.random() * (now.getTime() - minUpdateTime));
      clone.lastUpdated = new Date(randomUpdateTime);

      return clone;
    });

    return of(updatedCases);
  }

  getById(id: string): Observable<CaseDto> {
    return of(MOCK_CASE_DV as CaseDto);
  }

  create(message: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    const id = crypto.randomUUID();

    const newCase: CaseDto = MOCK_CASE_DV;

    newCase.id = id;

    this.cases.push(newCase);

    return of(newCase);
  }

  update(id: string, message: AthenasMessageDto, files: File[]): Observable<CaseDto> {
    const index = this.cases.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Case with id ${id} not found`);
    }
    
    const updatedCase: CaseDto = MOCK_CASE_DV;

    updatedCase.id = id;

    return of(updatedCase);
  }

  delete(id: string): Observable<void> {
    this.cases = this.cases.filter(c => c.id !== id);
    return of();
  }
}

export const MOCK_CASE_SUMMARIES: CaseSummaryDto[] = 
[
  {
    "id": "3a83a0f1-8bd0-b6e3-f2d9-2fd592db05a9",
    "trackingNumber": "CG-TH720JGO",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:39.121831Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.121831Z"),
    "creatorId": "6336a249-78d5-4e6a-2dc5-dd07fd649b4d",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "527a7be7-5ae7-0971-3a47-0f325610f309",
    "trackingNumber": "CG-8XMNH3YU",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:39.115963Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.115963Z"),
    "creatorId": "f7776418-a516-b2fc-3112-fb29946d2ad6",
    "expertId": "054eac1d-cb82-70dd-6050-9d5b70577ba3",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "0fa0f9a8-d707-8655-a16f-dc5bd988a9f8",
    "trackingNumber": "CG-XO2N7XE6",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:39.109796Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.109796Z"),
    "creatorId": "7bc95426-d1b5-75c6-9fe5-9a4b94481017",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "c19aaeb0-2684-6eed-d081-7cab630e252c",
    "trackingNumber": "CG-THQE7YJX",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:39.102752Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.102753Z"),
    "creatorId": "ab72c6fe-c04d-7431-0afb-97acc6f89c5b",
    "expertId": "89c10516-38b8-f152-5bb3-032a63fbb496",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "3bb16486-2058-278c-63be-3a596eaf638d",
    "trackingNumber": "CG-26Y2BF9Y",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:39.090339Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.09034Z"),
    "creatorId": "b65412b8-e8b2-bc99-ec0e-7a79445d417a",
    "expertId": "0620f60c-870a-a80e-473e-b75e88275eeb",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "199dff61-c404-964c-f78f-67568ec1cf59",
    "trackingNumber": "CG-H7Q3360G",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:39.085013Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.085013Z"),
    "creatorId": "085b2069-f48a-d2b6-7c3d-aa95e091f461",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "713e1fd6-56e1-9603-2ec7-6dc7a61b1d1a",
    "trackingNumber": "CG-TI3FEHHP",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:39.079509Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.079509Z"),
    "creatorId": "499ebc90-1051-f0c0-8ca6-a5ed67bb3afd",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "347aafca-8949-f6dd-c909-53e5de611113",
    "trackingNumber": "CG-35MUDBMH",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:39.072809Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.072809Z"),
    "creatorId": "a26c30d6-1064-2a51-57f4-4b7bf34ad036",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "7d781fbf-745f-c82d-4056-e2c1371b56c0",
    "trackingNumber": "CG-TVPC3DAT",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:39.0616Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.061601Z"),
    "creatorId": "bdd3d4e4-36bf-4c75-8c60-bc9e61fe4a90",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "39efc6e7-2b9d-1965-d6de-6f9c940a32b0",
    "trackingNumber": "CG-H5YHV685",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:39.05525Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.05525Z"),
    "creatorId": "085b2069-f48a-d2b6-7c3d-aa95e091f461",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "411e339a-a13c-5b57-9ce6-e256f46f3019",
    "trackingNumber": "CG-0TCNMG40",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:39.048698Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.048698Z"),
    "creatorId": "8af7562f-cd6e-8ca8-dea9-79749ff048d3",
    "expertId": "f2f2a351-b24e-99c5-ccb4-8bfd44514ecb",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "c02cf164-4e28-627a-cfe4-ef43d8750125",
    "trackingNumber": "CG-N6VCN39P",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:39.023572Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.023572Z"),
    "creatorId": "b65412b8-e8b2-bc99-ec0e-7a79445d417a",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "f3a37b47-4f4c-da1b-2f9e-5fae811de32c",
    "trackingNumber": "CG-DS6N7DS9",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:39.018366Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.018366Z"),
    "creatorId": "e17ba0b0-660d-a0d7-66b3-ecb49fca701e",
    "expertId": "3dd6c454-1958-0a76-a5f8-67c3ce56077e",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9561a266-df71-8969-89ab-7d826f0ec6fe",
    "trackingNumber": "CG-1OZY1A5C",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:39.013084Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.013084Z"),
    "creatorId": "dcd6a3e1-bffa-977f-dd89-4c280315f8d6",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "60f4230f-02ad-f007-221d-6d05158eb0fe",
    "trackingNumber": "CG-5V35LV95",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:39.00467Z"),
"lastUpdated": new Date("2025-11-14T10:01:39.00467Z"),
    "creatorId": "25fd7da1-55f5-87f9-45ab-1da01cbd9b37",
    "expertId": "c7102cb0-106e-124a-d3c8-52d333f18eb6",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "1206b2bf-5863-8a22-6977-d9e968d1c0a8",
    "trackingNumber": "CG-2LJ28L1T",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.997173Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.997173Z"),
    "creatorId": "8af7562f-cd6e-8ca8-dea9-79749ff048d3",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "3feef30d-03e6-c4e5-a5b6-b82e8465ca08",
    "trackingNumber": "CG-K97L8JOL",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.990427Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.990428Z"),
    "creatorId": "40bc757c-d224-b3e4-c5e7-75ea722f213d",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "c3acc936-a9ce-195c-f957-ff9c975c81de",
    "trackingNumber": "CG-B9CFNFGG",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.984867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.984867Z"),
    "creatorId": "40ac8b65-471a-a903-5201-153377aa7bde",
    "expertId": "40bc757c-d224-b3e4-c5e7-75ea722f213d",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "652e3a5e-c351-e6db-d44c-74637df0292a",
    "trackingNumber": "CG-8T2K2O0U",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.97774Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.97774Z"),
    "creatorId": "ae40ad29-8582-2180-0d6f-791f460baf8d",
    "expertId": "85c6a660-c46c-2477-f96c-06139e833bb0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "82eaff4e-190b-2c42-5da5-f63eb9880ac3",
    "trackingNumber": "CG-84XZ8S86",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.971061Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.971061Z"),
    "creatorId": "c7102cb0-106e-124a-d3c8-52d333f18eb6",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "32c10739-732f-9687-b9d8-c83f53d99d0c",
    "trackingNumber": "CG-SG1GE3Y1",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.964529Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.964529Z"),
    "creatorId": "856947cf-0e8b-074e-ae5c-d2684f56573a",
    "expertId": "3dd6c454-1958-0a76-a5f8-67c3ce56077e",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "a37570d9-e91f-b812-fb3e-5567f0a4c386",
    "trackingNumber": "CG-DLUYM1BG",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.953544Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.953544Z"),
    "creatorId": "f2f2a351-b24e-99c5-ccb4-8bfd44514ecb",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "05fbbb0f-d8c7-2b36-71df-4430a11d5979",
    "trackingNumber": "CG-SJ68D2QD",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.943753Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.943753Z"),
    "creatorId": "727113f9-6621-a66e-602b-104ea9255aa1",
    "expertId": "c7102cb0-106e-124a-d3c8-52d333f18eb6",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "fe5f0404-17a0-bd49-32f3-c1b8a69b4655",
    "trackingNumber": "CG-FC10U4AR",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.938259Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.93826Z"),
    "creatorId": "7ef17696-282d-684e-937d-d18647b7b66a",
    "expertId": "727113f9-6621-a66e-602b-104ea9255aa1",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "1650788d-c20e-fa91-3c00-9f5faaa4329f",
    "trackingNumber": "CG-OLYRNRJ1",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.933142Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.933142Z"),
    "creatorId": "8af7562f-cd6e-8ca8-dea9-79749ff048d3",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "339b10e8-36a6-1b5b-6a06-8d6459e09cf0",
    "trackingNumber": "CG-RY1NMNYP",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.927597Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.927597Z"),
    "creatorId": "2e203e29-b52b-f301-0d54-0d2d32c07843",
    "expertId": "a0ca9a30-7752-429c-3255-e1c8439012b0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9c01f7b1-4aa4-1f7e-3fac-b558edf217ab",
    "trackingNumber": "CG-QFZNQ8JQ",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.920859Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.920859Z"),
    "creatorId": "40ac8b65-471a-a903-5201-153377aa7bde",
    "expertId": "40bc757c-d224-b3e4-c5e7-75ea722f213d",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "028fd28b-69f5-dc48-da48-5a40436e42b8",
    "trackingNumber": "CG-XDZF17YG",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.91587Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.915871Z"),
    "creatorId": "8af7562f-cd6e-8ca8-dea9-79749ff048d3",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "2df55361-6679-57ce-872b-3bf280a045fc",
    "trackingNumber": "CG-ATHBZ5UN",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.910411Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.910411Z"),
    "creatorId": "d332ece7-2687-884c-0b78-edbb7913e093",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "4746bef9-896b-f213-859d-9df636c68d3f",
    "trackingNumber": "CG-XAKTQ1YB",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.903546Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.903546Z"),
    "creatorId": "b3345ec0-4e74-c47e-32b0-14ff798d6178",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9142aeb7-144d-6583-6dbe-0535f2aecca1",
    "trackingNumber": "CG-PDIKJPYW",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.896591Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.896591Z"),
    "creatorId": "a3b20fd8-41c9-db3f-9792-693637be5fcd",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "967ce56f-c6cc-c801-f96c-71f603610902",
    "trackingNumber": "CG-3LGZFHZ9",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.890688Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.890688Z"),
    "creatorId": "40ac8b65-471a-a903-5201-153377aa7bde",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9e5b6278-d813-4552-0427-c494372e81ee",
    "trackingNumber": "CG-VMO7EUSA",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.884928Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.884929Z"),
    "creatorId": "499ebc90-1051-f0c0-8ca6-a5ed67bb3afd",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "4c5fcb73-d6a9-eec7-2c72-8425274e212e",
    "trackingNumber": "CG-YFYSWMZ3",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.876964Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.876964Z"),
    "creatorId": "d95884ab-db56-52da-2ea6-101b446202f3",
    "expertId": "f2f2a351-b24e-99c5-ccb4-8bfd44514ecb",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "8d1e978d-6bc3-8376-6262-5566b7e836bf",
    "trackingNumber": "CG-UQ5JYEDV",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.868931Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.868932Z"),
    "creatorId": "89c10516-38b8-f152-5bb3-032a63fbb496",
    "expertId": "85c6a660-c46c-2477-f96c-06139e833bb0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "4c5b747b-14fd-3174-b009-338d5b9b9dca",
    "trackingNumber": "CG-C2ZZ321O",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.862383Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.862383Z"),
    "creatorId": "40ac8b65-471a-a903-5201-153377aa7bde",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "ad97a1b6-df25-9ccd-1a87-0c074e91c337",
    "trackingNumber": "CG-UL342MAS",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.853931Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.853931Z"),
    "creatorId": "efac739d-94ab-0227-574e-998fcf34f83c",
    "expertId": "a26c30d6-1064-2a51-57f4-4b7bf34ad036",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "49085585-bfda-5d04-83c7-fbe2976d32b4",
    "trackingNumber": "CG-51XJ1OB0",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.845698Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.845698Z"),
    "creatorId": "7b7cac4c-1c99-df4c-b5c6-54ec7dc86946",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9d4d78b6-2831-c83b-7ea4-e85345ee7e57",
    "trackingNumber": "CG-S5YZ9TIE",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.840084Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.840085Z"),
    "creatorId": "5216018e-5ef2-b317-1fd0-d1f2bcd65290",
    "expertId": "55118168-8b72-ac8c-0941-67ebd116547c",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "bc519f72-c53c-997d-7467-2e039de4af30",
    "trackingNumber": "CG-HBYPL79E",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.833208Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.833209Z"),
    "creatorId": "a3af7a6d-733e-45ac-2307-f5a90cbd18c9",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "8abb75ba-bb43-e919-61f0-698859f63350",
    "trackingNumber": "CG-A7Y9INFD",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.825156Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.825157Z"),
    "creatorId": "4cb513ab-a758-5a87-e03d-241d596b3465",
    "expertId": "0620f60c-870a-a80e-473e-b75e88275eeb",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "3da16cd6-7029-3c9d-9d32-57de139036b9",
    "trackingNumber": "CG-TPF1Y5F5",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.817926Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.817926Z"),
    "creatorId": "5e9fbb44-8465-202d-a583-c328c696dcb0",
    "expertId": "0620f60c-870a-a80e-473e-b75e88275eeb",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "a836e157-96c8-524c-d10d-410c56c98b06",
    "trackingNumber": "CG-WUQM3EQ2",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.812145Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.812146Z"),
    "creatorId": "ae40ad29-8582-2180-0d6f-791f460baf8d",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "40115ed0-0ad5-3f83-65c1-a53edf4ead0f",
    "trackingNumber": "CG-NFGR88VH",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.806536Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.806536Z"),
    "creatorId": "f10140ee-f45e-ab29-c1fa-9503b8cab381",
    "expertId": "5e9fbb44-8465-202d-a583-c328c696dcb0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9f8ab37e-a7c7-7907-3bf9-8ff11d4746bc",
    "trackingNumber": "CG-Q1WLI1NM",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.798297Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.798297Z"),
    "creatorId": "ef05545a-20ed-6347-8278-96de4b807292",
    "expertId": "a0ca9a30-7752-429c-3255-e1c8439012b0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "4b915a0d-97cc-499c-4444-a3be39cdd08d",
    "trackingNumber": "CG-CK9F309F",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.792843Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.792843Z"),
    "creatorId": "085b2069-f48a-d2b6-7c3d-aa95e091f461",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "ed38ce7b-3260-6c88-fd7e-45aeefc751f2",
    "trackingNumber": "CG-N426Z92R",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.786241Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.786241Z"),
    "creatorId": "856947cf-0e8b-074e-ae5c-d2684f56573a",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "fa6dcdd8-13e7-7407-f6fb-f6b63ffa5eb2",
    "trackingNumber": "CG-S9YA4LYX",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.777323Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.777323Z"),
    "creatorId": "0620f60c-870a-a80e-473e-b75e88275eeb",
    "expertId": "3dd6c454-1958-0a76-a5f8-67c3ce56077e",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "2eeef0c1-48e6-d5f5-2dbd-97d9e9c7fee7",
    "trackingNumber": "CG-5HPPE396",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.771779Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.771779Z"),
    "creatorId": "253b6c17-895b-568e-7aab-8e47eb50e57b",
    "expertId": "c7102cb0-106e-124a-d3c8-52d333f18eb6",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "0dddf28e-43e1-8e82-430e-526b275288e6",
    "trackingNumber": "CG-OUYGQH0N",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "294ee86f-ba28-4504-7c69-2131cfad5474",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "e37740ee-178c-ac71-d2c8-ac2163988103",
    "trackingNumber": "CG-URH2BETJ",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "4d8cf476-ac82-f506-7121-0d13cd9d3511",
    "expertId": "5e9fbb44-8465-202d-a583-c328c696dcb0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "d52c4ef4-b043-5afb-4e95-0f7a7e7c91ac",
    "trackingNumber": "CG-TIU6PCQ5",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,    
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "a0ca9a30-7752-429c-3255-e1c8439012b0",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "42d73b66-aaaa-b46a-4d5f-5117c4ceb0e6",
    "trackingNumber": "CG-XLI0EO40",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,    
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "a26c30d6-1064-2a51-57f4-4b7bf34ad036",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "3447a880-7353-0d34-b6df-7c4c70fa0a85",
    "trackingNumber": "CG-GI0IZP8O",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.WITH_EVIDENCES,    
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "ae40ad29-8582-2180-0d6f-791f460baf8d",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "6c1a16f4-9820-d272-22ec-bbe79a2f2ff3",
    "trackingNumber": "CG-FTNSUNP6",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,    
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "109ff6bb-490f-5d66-8c8d-daff2c94e535",
    "expertId": "4acd3f3a-d22c-c818-1e67-2aad07a254d4",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "619b490f-923f-ab36-a82e-3e9330236702",
    "trackingNumber": "CG-7CSW5QLD",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,    
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "ae40ad29-8582-2180-0d6f-791f460baf8d",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "bb19a829-a225-3054-c503-5b0f6fcd53bf",
    "trackingNumber": "CG-R7O5VXUZ",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.WITH_EVIDENCES,    
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "419cce60-e20f-bff0-6ab0-b7ecb1e367cd",
    "expertId": "5e9fbb44-8465-202d-a583-c328c696dcb0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "56bbaace-0807-a741-ce4c-f2806f974846",
    "trackingNumber": "CG-V8897SVU",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,    
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "6a38f827-ff4f-1f0d-b9c9-9b9b4b3359d0",
    "expertId": "a0ca9a30-7752-429c-3255-e1c8439012b0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9d3e379d-498f-19aa-fc66-84afd0dc0c32",
    "trackingNumber": "CG-3NPOZI2Z",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.699867Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.699867Z"),
    "creatorId": "88f7d386-d17e-60f6-df1c-3c7ae4e2ed6a",
    "expertId": "b72d2e71-6df0-4440-7a6b-59407443370f",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "ab459657-612f-4832-8642-d448531edac9",
    "trackingNumber": "CG-QDCBXG52",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.694728Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.694729Z"),
    "creatorId": "085b2069-f48a-d2b6-7c3d-aa95e091f461",
    "expertId": "3dd6c454-1958-0a76-a5f8-67c3ce56077e",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9f24c12f-a0d4-d562-edc1-7304d9face53",
    "trackingNumber": "CG-HRBCRSPU",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.685302Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.685302Z"),
    "creatorId": "b72d2e71-6df0-4440-7a6b-59407443370f",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "ccd436d5-5d78-9535-9b46-01289bcf4fc3",
    "trackingNumber": "CG-WZE43F2E",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.678566Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.678566Z"),
    "creatorId": "40ac8b65-471a-a903-5201-153377aa7bde",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "6e5145f1-29e0-632b-4036-778cf0cb199b",
    "trackingNumber": "CG-R1VPXR7T",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.669953Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.669953Z"),
    "creatorId": "343d7323-ad92-0cf7-310d-52c1cb7015c9",
    "expertId": "5e9fbb44-8465-202d-a583-c328c696dcb0",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "18f18af4-1e30-bf82-ab38-2cafe38df111",
    "trackingNumber": "CG-A34HLNF3",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.663958Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.663958Z"),
    "creatorId": "ef05545a-20ed-6347-8278-96de4b807292",
    "expertId": "727113f9-6621-a66e-602b-104ea9255aa1",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "d280ee8f-1709-e0ba-08ff-a2584ed88d02",
    "trackingNumber": "CG-R2NOW3LC",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.657289Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.657289Z"),
    "creatorId": "a3af7a6d-733e-45ac-2307-f5a90cbd18c9",
    "expertId": "727113f9-6621-a66e-602b-104ea9255aa1",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "c65acb8b-6c34-4660-af89-ebf6cc0dc963",
    "trackingNumber": "CG-71XWLLKG",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.650634Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.650634Z"),
    "creatorId": "7b7cac4c-1c99-df4c-b5c6-54ec7dc86946",
    "expertId": "0620f60c-870a-a80e-473e-b75e88275eeb",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "a81566f4-28c3-dfcd-3d11-879b501803e5",
    "trackingNumber": "CG-NYAQA2TZ",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.642086Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.642087Z"),
    "creatorId": "2e203e29-b52b-f301-0d54-0d2d32c07843",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "2cdb2da8-d4ce-134c-3d52-7a036284754e",
    "trackingNumber": "CG-O2W405OJ",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.636325Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.636325Z"),
    "creatorId": "40ac8b65-471a-a903-5201-153377aa7bde",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9ec14b3b-68f2-282e-a002-5113d9b80963",
    "trackingNumber": "CG-WA5WVKSL",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.624988Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.624988Z"),
    "creatorId": "5e9fbb44-8465-202d-a583-c328c696dcb0",
    "expertId": "0620f60c-870a-a80e-473e-b75e88275eeb",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "67f3c0b3-293d-c716-bff6-cfbeb71406fb",
    "trackingNumber": "CG-2PRFI2WG",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.615329Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.615329Z"),
    "creatorId": "c7102cb0-106e-124a-d3c8-52d333f18eb6",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "aaaaac77-10cc-ebe0-33d9-578e387c6133",
    "trackingNumber": "CG-Y7V3OA0D",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.608261Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.608262Z"),
    "creatorId": "dcd6a3e1-bffa-977f-dd89-4c280315f8d6",
    "expertId": "40bc757c-d224-b3e4-c5e7-75ea722f213d",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "bafc8deb-9f89-5666-a203-d2472f16b9f2",
    "trackingNumber": "CG-WQRJ5IJY",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.602319Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.602319Z"),
    "creatorId": "edc2f5af-bdd7-da91-a320-19ce29f83c8f",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "5512d6ca-3233-2db3-43a8-99ac1fcc81c7",
    "trackingNumber": "CG-F6A6FVKT",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.594586Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.594586Z"),
    "creatorId": "edc2f5af-bdd7-da91-a320-19ce29f83c8f",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "3c26dfba-e4f1-4a14-065e-7a2bfe54a044",
    "trackingNumber": "CG-XGQDXMPU",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.584299Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.5843Z"),
    "creatorId": "a0ca9a30-7752-429c-3255-e1c8439012b0",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "b4c1105a-4151-6827-468f-26de7c0c7550",
    "trackingNumber": "CG-HS92KLC6",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.574753Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.574753Z"),
    "creatorId": "0620f60c-870a-a80e-473e-b75e88275eeb",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "ee7b7a7e-25fa-089a-7489-7f2ea21c8090",
    "trackingNumber": "CG-JPCC5YW4",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.565159Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.565159Z"),
    "creatorId": "3dd6c454-1958-0a76-a5f8-67c3ce56077e",
    "expertId": "a3b20fd8-41c9-db3f-9792-693637be5fcd",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "16c6979b-e082-756e-1de9-4c94809dfa83",
    "trackingNumber": "CG-1KASFY5S",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.558267Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.558267Z"),
    "creatorId": "f7776418-a516-b2fc-3112-fb29946d2ad6",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "06883a15-aac7-563f-613c-9b8a03958f3b",
    "trackingNumber": "CG-YZU1RPMH",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.544318Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.544318Z"),
    "creatorId": "efac739d-94ab-0227-574e-998fcf34f83c",
    "expertId": "55118168-8b72-ac8c-0941-67ebd116547c",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "cc09931a-0ac9-1aaa-e98c-5b66b0de4f3e",
    "trackingNumber": "CG-ESF4F4DB",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.537687Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.537687Z"),
    "creatorId": "b7ae37f7-47d9-8955-db16-eb0564d1ed72",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "69f96f06-0cb8-fa45-54bf-820137a6bcb4",
    "trackingNumber": "CG-ZYPO5PFX",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.527781Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.527781Z"),
    "creatorId": "294ee86f-ba28-4504-7c69-2131cfad5474",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "3bbb43c8-6365-ad7a-66c9-8b629194dd77",
    "trackingNumber": "CG-GINPXVIA",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.INSUFFICIENT_QUALITY,
"creationDate": new Date("2025-11-14T10:01:38.516835Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.516835Z"),
    "creatorId": "b72d2e71-6df0-4440-7a6b-59407443370f",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "bf267a69-bd3e-2b75-e48b-d1d8cc0a226f",
    "trackingNumber": "CG-UMRDRR9G",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.50933Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.50933Z"),
    "creatorId": "85c6a660-c46c-2477-f96c-06139e833bb0",
    "expertId": "727113f9-6621-a66e-602b-104ea9255aa1",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "7dbc3c79-e74e-28e8-ada6-c7c5cd9b5d81",
    "trackingNumber": "CG-IYVGG3OG",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.502277Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.502277Z"),
    "creatorId": "195a8abb-7de7-8b7b-0412-d30792d1584e",
    "expertId": "856947cf-0e8b-074e-ae5c-d2684f56573a",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "e3de2f03-3e1c-c0da-2440-45b03d0721a5",
    "trackingNumber": "CG-KGNXBZ4Y",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.495432Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.495432Z"),
    "creatorId": "343d7323-ad92-0cf7-310d-52c1cb7015c9",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "40c66f0a-ff10-7eea-28a3-a525faf5d6e4",
    "trackingNumber": "CG-RT6GN02V",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.485909Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.485909Z"),
    "creatorId": "3dd6c454-1958-0a76-a5f8-67c3ce56077e",
    "expertId": "054eac1d-cb82-70dd-6050-9d5b70577ba3",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "4e13ddb9-fdde-cf31-ee1c-584f9ee7d5aa",
    "trackingNumber": "CG-L2846CSK",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.463477Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.463478Z"),
    "creatorId": "edc2f5af-bdd7-da91-a320-19ce29f83c8f",
    "expertId": "88f7d386-d17e-60f6-df1c-3c7ae4e2ed6a",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "01ba0fcc-b851-d94d-f30c-f5fe38214f86",
    "trackingNumber": "CG-0210ZM9E",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.458641Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.458642Z"),
    "creatorId": "b7ae37f7-47d9-8955-db16-eb0564d1ed72",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "cbb537b1-45f9-9986-c4b4-a8a3c4e2348b",
    "trackingNumber": "CG-WOX02MDK",
    "caseStatus": CaseStatus.CLARIFICATION_PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.448903Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.448903Z"),
    "creatorId": "4acd3f3a-d22c-c818-1e67-2aad07a254d4",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "aa194d90-ec8b-a540-9db0-ca633e57cf08",
    "trackingNumber": "CG-16W4BNBP",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.441442Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.441442Z"),
    "creatorId": "b65412b8-e8b2-bc99-ec0e-7a79445d417a",
    "expertId": "4acd3f3a-d22c-c818-1e67-2aad07a254d4",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "a637e4a9-82e8-0541-4fdb-d90a72511609",
    "trackingNumber": "CG-6JSZ263U",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.433516Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.433517Z"),
    "creatorId": "73c4c0ee-28e2-ebaf-f2ce-e404df7918da",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "5fb7931b-a079-753d-a712-e4daeb163f68",
    "trackingNumber": "CG-O8M0XZX0",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.PENDING,
"creationDate": new Date("2025-11-14T10:01:38.423455Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.423455Z"),
    "creatorId": "499ebc90-1051-f0c0-8ca6-a5ed67bb3afd",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "9217435f-2ce4-132f-6ebc-2760ba503a0d",
    "trackingNumber": "CG-V54Z4OCV",
    "caseStatus": CaseStatus.OPEN,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.375328Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.375328Z"),
    "creatorId": "8cf1b9c0-6ca1-438f-5ffc-02772f87494a",
    "expertId": "b72d2e71-6df0-4440-7a6b-59407443370f",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "03c41aba-ed53-2dc5-b310-120aab03bc7b",
    "trackingNumber": "CG-87CL63Z3",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.367023Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.367024Z"),
    "creatorId": "a3af7a6d-733e-45ac-2307-f5a90cbd18c9",
    "expertId": "89c10516-38b8-f152-5bb3-032a63fbb496",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "00831a70-5dbd-62e6-755a-90004c7f7871",
    "trackingNumber": "CG-IFPOG5I8",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.171782Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.171782Z"),
    "creatorId": "efac739d-94ab-0227-574e-998fcf34f83c",
    "expertId": "40bc757c-d224-b3e4-c5e7-75ea722f213d",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "013aa388-f3b6-9b9e-79b7-645de056d5ea",
    "trackingNumber": "CG-S30EBDZU",
    "caseStatus": CaseStatus.SOLVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.164383Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.164383Z"),
    "creatorId": "41cfe86d-76e3-0c0e-900c-f85cf2e67b4e",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "92632d0b-9987-ca82-5a32-199bfc8ee0c7",
    "trackingNumber": "CG-V1JGMCY9",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.INVALID_DOCUMENT,
"creationDate": new Date("2025-11-14T10:01:38.151003Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.151004Z"),
    "creatorId": "a3b20fd8-41c9-db3f-9792-693637be5fcd",
    "expertId": "bede3c0b-ec8f-7566-f215-35c7c4c4816d",
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "261eef89-0cc8-9d37-208a-121b2ebce65f",
    "trackingNumber": "CG-HTWRSE84",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.141009Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.141009Z"),
    "creatorId": "727113f9-6621-a66e-602b-104ea9255aa1",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "122f17da-e042-f03d-851f-fccd8ace1c30",
    "trackingNumber": "CG-SSAIMGQ2",
    "caseStatus": CaseStatus.PENDING,
    "caseResolution": CaseResolution.WITHOUT_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.112416Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.112416Z"),
    "creatorId": "d332ece7-2687-884c-0b78-edbb7913e093",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "6ecf10f7-440b-826d-bbb3-32bcb0635e5f",
    "trackingNumber": "CG-WZ33XGON",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:38.098074Z"),
"lastUpdated": new Date("2025-11-14T10:01:38.098075Z"),
    "creatorId": "5e9fbb44-8465-202d-a583-c328c696dcb0",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  },
  {
    "id": "300285f0-1f80-89fa-2ddc-9e14883bd35c",
    "trackingNumber": "CG-H7BTXU1U",
    "caseStatus": CaseStatus.ARCHIVED,
    "caseResolution": CaseResolution.WITH_EVIDENCES,
"creationDate": new Date("2025-11-14T10:01:37.896107Z"),
"lastUpdated": new Date("2025-11-14T10:01:37.896108Z"),
    "creatorId": "88f7d386-d17e-60f6-df1c-3c7ae4e2ed6a",
    "expertId": null,
    "caseGroupId": null,
    "auxiliarValues": [],
    "alerts": []
  }
];

export const MOCK_CASE_DV: CaseDto = 
{
  "id": "abc18a58-20c9-4880-a379-ab94864e1b57",
  "trackingNumber": "6c623ca6-d589-4f2e-9e3c-6def35ee12e0",
  "caseStatus": CaseStatus.OPEN,
  "caseResolution": CaseResolution.PENDING,
  "creationDate": new Date("2025-11-14T10:25:24.002167Z"),
  "lastUpdated": new Date("2025-11-14T10:25:24.002168Z"),
  "creatorId": "97d4e639-82ed-4994-88dd-2f0e98dbede1",
  "expertId": null,
  "caseGroupId": null,
  "auxiliarValues": [],
  "alerts": [],
  "activities": [
    {
      "type": ActivityType.CONSULTATION,
      "consultation": {
        "attachments": [
          {
            "attachmentType": AttachmentType.DOCUMENT_DV,
            "name": "ScanDoc1",
            "metadata": null,
            "documentDvAttachment": {
              "scannerDvData": {
                "nombre": "Spain Electronic ID Card 2015",
                "tipoDocumento": "ID Card",
                "codigoPais": "ESP",
                "pais": "Spain",
                "probability": 0,
                "chip": {
                  "fotoId": DOCUMENT_DV_ATTACHMENT_CHIP,
                  "idPersonal": "12345678R",
                  "tipoDocumento": "TravelDocument1",
                  "paisExpedidor": "ESP",
                  "numeroDocumento": "BOD111111",
                  "fechaCaducidad": null,
                  "fechaExpedicion": null,
                  "nombre": "MOCK",
                  "apellidos": "SURNAME1 SURNAME2",
                  "fechaNacimiento": "123456",
                  "nacionalidad": "ESP",
                  "sexo": "M",
                  "mrzCode": "IDESPBOD111111912345678R<<<<<<,1122334M2603183ESP<<<<<<<<<<<8,SURNAME1<SURNAME2<<MOCK<<<<<<<<",
                  "lugarNacimiento": null
                },
                "visual": {
                  "fotoId": DOCUMENT_DV_ATTACHMENT_VISUAL,
                  "idPersonal": "12345678R",
                  "tipoDocumento": "TravelDocument1",
                  "paisExpedidor": "ESP",
                  "numeroDocumento": "BOD111111",
                  "fechaCaducidad": null,
                  "fechaExpedicion": null,
                  "nombre": "MOCK",
                  "apellidos": "SURNAME1 SURNAME2",
                  "fechaNacimiento": "123456",
                  "nacionalidad": "ESP",
                  "sexo": "M",
                  "mrzCode": "IDESPBOD111111912345678R<<<<<<,1122334M2603183ESP<<<<<<<<<<<8,SURNAME1<SURNAME2<<MOCK<<<<<<<<",
                  "lugarNacimiento": null
                },
                "mrz": {
                  "fotoId": null,
                  "idPersonal": "12345678R",
                  "tipoDocumento": "TravelDocument1",
                  "paisExpedidor": "ESP",
                  "numeroDocumento": "BOD111111",
                  "fechaCaducidad": null,
                  "fechaExpedicion": null,
                  "nombre": "MOCK",
                  "apellidos": "SURNAME1 SURNAME2",
                  "fechaNacimiento": "123456",
                  "nacionalidad": "ESP",
                  "sexo": "M",
                  "mrzCode": "IDESPBOD111111912345678R<<<<<<,1122334M2603183ESP<<<<<<<<<<<8,SURNAME1<SURNAME2<<MOCK<<<<<<<<",
                  "lugarNacimiento": null
                },
                "imageMaps": [
                  {
                    "type": "IR",
                    "mediaBinaryId": DOCUMENT_DV_ATTACHMENT_IR
                  },
                  {
                    "type": "UV",
                    "mediaBinaryId": DOCUMENT_DV_ATTACHMENT_UV
                  },
                  {
                    "type": "VIZ",
                    "mediaBinaryId": DOCUMENT_DV_ATTACHMENT_VIZ
                  }
                ]
              },
              "mrzVizVerifications": [
                {
                  "nombre": "OCR Birth Date",
                  "mrz": "991228",
                  "rawVIZ": "28 12 1999",
                  "viz": "991228"
                },
                {
                  "nombre": "OCR Extract CAN",
                  "mrz": "",
                  "rawVIZ": "123456",
                  "viz": "123456"
                },
                {
                  "nombre": "OCR Expiry Date",
                  "mrz": "260317",
                  "rawVIZ": "17 03 2026",
                  "viz": "260317"
                },
                {
                  "nombre": "OCR Extract Street",
                  "mrz": "",
                  "rawVIZ": "CRER. MOCK 42 B",
                  "viz": "CRER.MOCKSTREET"
                },
                {
                  "nombre": "OCR Document Number",
                  "mrz": "BOD111111",
                  "rawVIZ": "BOD111111",
                  "viz": "BOD1111111"
                },
                {
                  "nombre": "OCR Personal Number",
                  "mrz": "12345678R<<",
                  "rawVIZ": "12345678R",
                  "viz": "12345678R"
                },
                {
                  "nombre": "OCR Extract Nationality",
                  "mrz": "",
                  "rawVIZ": "ESP",
                  "viz": "ESP"
                },
                {
                  "nombre": "OCR Extract Place Of Birth",
                  "mrz": "",
                  "rawVIZ": "SANT PERE DE RIBES\r\nBARCELONA\r\n",
                  "viz": "SANTPEREDERIBES\r\nBARCELONA\r\n"
                },
                {
                  "nombre": "OCR Last Name",
                  "mrz": "SURNAME1<SURNAME2",
                  "rawVIZ": "SURNAME1\rSURNAME2\r\n",
                  "viz": "SURNAME1\rSURNAME2\r\n"
                },
                {
                  "nombre": "OCR Extract City",
                  "mrz": "",
                  "rawVIZ": "SANT PERE DE RIBES",
                  "viz": "SANTPEREDERIBES"
                },
                {
                  "nombre": "OCR First Name",
                  "mrz": "MOCK<<<<<<<<",
                  "rawVIZ": "MOCK",
                  "viz": "MOCK"
                }
              ],
              "documentVerifications": [
                {
                  "group": "Chip",
                  "code": "ChipAccess",
                  "value": 0,
                  "sourceMessage": "Chip Access Verification",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Chip",
                  "code": "ChipActiveAuthentication",
                  "value": 0,
                  "sourceMessage": "Chip Active Authentication",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Date of birth check digit test",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Composite check digit test",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Chip",
                  "code": "ChipPassiveAuthentication",
                  "value": 0,
                  "sourceMessage": "Chip Passive Authentication",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Document number check digit test",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Chip",
                  "code": "ChipPresent",
                  "value": 1,
                  "sourceMessage": "Chip Present",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Expiry date check digit test",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Chip",
                  "code": "ChipAuthentication",
                  "value": 0,
                  "sourceMessage": "Chip Authentication",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Correct padding check",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Complete expiry date check",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: CompositeCheckDigit",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: DocumentType",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: DocumentNumberCheckDigit",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: ExpiryDateCheckDigit",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: ExpiryDate",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: DocumentNumber",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: DateOfBirth",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: DateOfBirthCheckDigit",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: Sex",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "TD1 type field check",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Valid expiry date check",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: OptionalData1",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: OptionalData2",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Valid date of birth check",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "TD1 number of rows and columns",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: Nationality",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: SecondaryIdentifier",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: IssuingState",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "ICAO characters: PrimaryIdentifier",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Issuer",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Nationality",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Expiry Date Check digit",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Date of Birth",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Document number Check digit",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Composite Check Digit",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Valid sex field check",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Given Name",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Expiry Date",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Date of Birth Check digit",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Document Number",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Valid issuing state check",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "MRZ",
                  "code": "InvalidValue",
                  "value": 1,
                  "sourceMessage": "Valid nationality check",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Sex",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "OCR Birth Date",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "OCR Expiry Date",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "OCR Document Number",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "OCR First Name",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "OCR Last Name",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "Data Integrity Chip - MRZ: Optional Data",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "OCR",
                  "code": "DataIntegrity",
                  "value": 1,
                  "sourceMessage": "OCR Extract Nationality",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Integrity",
                  "code": "TextMatch",
                  "value": 1,
                  "sourceMessage": "OCR Personal Number",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "OCR",
                  "code": "DataIntegrity",
                  "value": 1,
                  "sourceMessage": "OCR Extract CAN",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "OCR",
                  "code": "DataIntegrity",
                  "value": 1,
                  "sourceMessage": "OCR Extract Place Of Birth",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "OCR",
                  "code": "DataIntegrity",
                  "value": 1,
                  "sourceMessage": "OCR Extract Gender ",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "OCR",
                  "code": "DataIntegrity",
                  "value": 1,
                  "sourceMessage": "OCR Extract City",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Security",
                  "code": "UV",
                  "value": 1,
                  "sourceMessage": "Front - UV Photo Replace",
                  "expected": null,
                  "result": DOCUMENT_DV_FRONT_UV_PHOTO_REPLACE
                },
                {
                  "group": "OCR",
                  "code": "DataIntegrity",
                  "value": 1,
                  "sourceMessage": "OCR Extract Street",
                  "expected": null,
                  "result": null
                },
                {
                  "group": "Security",
                  "code": "ImageMatch",
                  "value": 1,
                  "sourceMessage": "OCV Front - IR Chip Check",
                  "expected": DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_EXPECTED,
                  "result": DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_RESULT
                },
                {
                  "group": "Security",
                  "code": "ImageMatch",
                  "value": 1,
                  "sourceMessage": "OCV VIS Chip - Back",
                  "expected": DOCUMENT_DV_OCV_VIZ_CHIP_BACK_EXPECTED,
                  "result": DOCUMENT_DV_OCV_VIZ_CHIP_BACK_RESULT
                },
                {
                  "group": "Security",
                  "code": "ImageMatch",
                  "value": 1,
                  "sourceMessage": "OCV IR MRZ Check",
                  "expected": DOCUMENT_DV_OCV_IR_MRZ_CHECK_EXPECTED,
                  "result": DOCUMENT_DV_OCV_IR_MRZ_CHECK_RESULT
                },
                {
                  "group": "Security",
                  "code": "UV",
                  "value": 1,
                  "sourceMessage": "UV MRZ Replace",
                  "expected": DOCUMENT_DV_UV_MRZ_REPLACE_EXPECTED,
                  "result": DOCUMENT_DV_UV_MRZ_REPLACE_RESULT
                }
              ],
              "documentType": DocumentAttachmentType.TD1
            }
          },
          {
            "attachmentType": AttachmentType.DIGITAL,
            "name": "video_1",
            "metadata": null,
            "digitalAttachment": {
              "fileType": "video/mp4",
              "digitalAttachmentType": DigitalAttachmentType.VIDEO,
              "dataId": DIGITAL_ATTACHMENT_VIDEO_2
            }
          }
        ]
      }
    }
  ],
  "notifications": []
};
