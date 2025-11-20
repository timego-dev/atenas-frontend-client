// media-repository-mock.service.ts
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { MediaRepositoryService, MediaResult } from '../media-repository.service';


export class MediaRepositoryMockService extends MediaRepositoryService {

  private mediaStore = new Map<string, ReplaySubject<MediaResult>>();
  private http = inject(HttpClient);

  constructor() {
    super();
    this.preloadMedia();
  }

  private preloadMedia() {
    for (const [id, filename] of Object.entries(MOCK_MEDIA_FILES)) {
      const subject = new ReplaySubject<MediaResult>(1);
      this.mediaStore.set(id, subject);

      this.http.get(`assets/mock-media/${filename}`, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          subject.next({
            content: blob,
            fileName: filename,
            contentType: blob.type || null
          });
          subject.complete();
        },
        error: (err) => {
          console.warn(`Failed to load mock media ${filename}`, err);
          subject.error(err);
        }
      });
    }
  }
  
  getById(id: string): Observable<MediaResult> {
    const subject = this.mediaStore.get(id);
    if (!subject) {
      return throwError(() => new Error(`Mock media not found for ID ${id}`));
    }
    return subject.asObservable();
  }
}

export const DOCUMENT_DV_ATTACHMENT_CHIP = '"9b995d4b-ad4d-4096-983f-2f7a459d3642"';
export const DOCUMENT_DV_ATTACHMENT_VISUAL = 'fc96282c-b340-4016-92de-af736282fb94';
export const DOCUMENT_DV_ATTACHMENT_IR = '9e352a3a-7fb8-4058-b861-2efdc5ead21b';
export const DOCUMENT_DV_ATTACHMENT_UV = '14f8635b-3386-40ce-9386-9d3d5f6d6d2f';
export const DOCUMENT_DV_ATTACHMENT_VIZ = 'e199a00c-d225-49e9-8c52-cabfd720f967';
export const DOCUMENT_DV_FRONT_UV_PHOTO_REPLACE = '62971798-6a46-4cb4-9b60-fa0716eca969';
export const DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_EXPECTED = '0a51d26b-2579-4362-8e7d-0b6d596e23bc';
export const DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_RESULT = 'd3dee757-4f36-4cdc-963e-846094ece9d6';
export const DOCUMENT_DV_OCV_VIZ_CHIP_BACK_EXPECTED = 'c0024370-b414-4235-b244-5be298b79ed2';
export const DOCUMENT_DV_OCV_VIZ_CHIP_BACK_RESULT = '8308d6c5-80b1-47ba-b25b-e4a5991d7db0';
export const DOCUMENT_DV_OCV_IR_MRZ_CHECK_EXPECTED = 'fc42a430-0843-4ba9-a82c-184777ca3f4f';
export const DOCUMENT_DV_OCV_IR_MRZ_CHECK_RESULT = '804446f6-f958-4f55-97b0-3b202b5da06f';
export const DOCUMENT_DV_UV_MRZ_REPLACE_EXPECTED = 'd5a7bd00-fc33-43ae-bf84-81f594293a18';
export const DOCUMENT_DV_UV_MRZ_REPLACE_RESULT = 'aee27ba9-1fce-44dc-834b-6425ba97647e';

export const DIGITAL_ATTACHMENT_PHOTO_1 = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
export const DIGITAL_ATTACHMENT_VIDEO_2 = '88416d23-162d-4270-931b-450c262b09c8';

const MOCK_MEDIA_FILES: Record<string, string> = {
  [DOCUMENT_DV_ATTACHMENT_CHIP]: 'chip.jpg',
  [DOCUMENT_DV_ATTACHMENT_VISUAL]: 'visual.jpg',
  [DOCUMENT_DV_ATTACHMENT_IR]: 'ir.jpg',
  [DOCUMENT_DV_ATTACHMENT_UV]: 'uv.jpg',
  [DOCUMENT_DV_ATTACHMENT_VIZ]: 'viz.jpg',
  [DOCUMENT_DV_FRONT_UV_PHOTO_REPLACE]: 'Front - UV Photo Replace.jpg',
  [DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_EXPECTED]: 'OCV Front - IR Chip Check_expected.jpg',
  [DOCUMENT_DV_FRONT_OCV_IR_CHIP_CHECK_RESULT]: 'OCV Front - IR Chip Check_result.jpg',
  [DOCUMENT_DV_OCV_IR_MRZ_CHECK_EXPECTED]: 'OCV IR MRZ Check_expected.jpg',
  [DOCUMENT_DV_OCV_IR_MRZ_CHECK_RESULT]: 'OCV IR MRZ Check_result.jpg',
  [DOCUMENT_DV_OCV_VIZ_CHIP_BACK_EXPECTED]: 'OCV VIS Chip - Back_expected.jpg',
  [DOCUMENT_DV_OCV_VIZ_CHIP_BACK_RESULT]: 'OCV VIS Chip - Back_result.jpg',
  [DOCUMENT_DV_UV_MRZ_REPLACE_EXPECTED]: 'UV MRZ Replace_expected.jpg',
  [DOCUMENT_DV_UV_MRZ_REPLACE_RESULT]: 'UV MRZ Replace_result.jpg',
  [DIGITAL_ATTACHMENT_PHOTO_1]: 'selfie.jpg',
  [DIGITAL_ATTACHMENT_VIDEO_2]: 'video.mp4',
};