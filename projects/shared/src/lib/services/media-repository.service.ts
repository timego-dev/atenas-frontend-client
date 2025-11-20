// media-repository.service.ts
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigurationService, SharedConfig } from './configuration.service';

export interface MediaResult {
  content: Blob;
  fileName: string | null;
  contentType: string | null;
}

export abstract class MediaRepositoryService {
  abstract getById(id: string): Observable<MediaResult>;

  createObjectUrl(media: MediaResult): string {
        return URL.createObjectURL(media.content);
  }

  revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  download(media: MediaResult): void {
    const url = this.createObjectUrl(media);
    const a = document.createElement('a');
    a.href = url;
    a.download = media.fileName ?? 'file';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export class MediaRepositoryRemoteService extends MediaRepositoryService {
  
  private readonly configurationService = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    super();
    this.baseUrl = this.configurationService.getConfig().backend.mediaBaseUrl;
  }
    
  getById(id: string): Observable<MediaResult> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map(response => {
        const content = response.body as Blob;
        const contentType = response.headers.get('Content-Type');

        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName: string | null = null;

        if (contentDisposition) {
          const match = /filename="?([^"]+)"?/i.exec(contentDisposition);
          if (match) {
            fileName = decodeURIComponent(match[1]);
          }
        }

        return {
          content,
          fileName,
          contentType
        };
      })
    );
  }
}
