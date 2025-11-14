import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ScannerDVData } from '../../types/at10k/ScannerDVData';
import { ScannerDvMapper } from '../../mappers/atenas/scanner-dv.mapper';
import { AtenasAttachmentDigital } from '../../types/atenas/AtenasInput';

@Injectable({ providedIn: 'root' })
export class AtenasDvService {
  constructor(private http: HttpClient) {}

  submit(
    url: string,
    input: ScannerDVData,
    attachFilePrefix: string,
    options?: {
      includeVerifications?: boolean;
      groupCodeMode?: 'numeric' | 'name';
      // Metadatos AtenasInput
      inputType?: string;
      text?: string;
      creationDate?: number | Date;
      attachmentName?: string;
      digitalAttachments?: AtenasAttachmentDigital[];
      // HTTP:
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?:
        | HttpParams
        | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
          };
    }
  ) {
    const mapped = ScannerDvMapper.mapToMultipartAtenas(input, attachFilePrefix, {
      includeVerifications: options?.includeVerifications,
      groupCodeMode: options?.groupCodeMode ?? 'numeric',
      inputType: options?.inputType ?? 'CONSULTATION',
      text: options?.text,
      creationDate: options?.creationDate,
      attachmentName: options?.attachmentName,
      digitalAttachments: options?.digitalAttachments ?? [],
    });

    const fd = new FormData();
    fd.append('Message', JSON.stringify(mapped.atenasInput));

    for (const f of mapped.files) {
      fd.append(f.field, f.blob, f.filename);
    }

    return this.http.post(url, fd, {
      headers: options?.headers,
      params: options?.params,
    });
  }
}
