import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'imgSrc', standalone: true, pure: true })
export class ImgSrcPipe implements PipeTransform {
  transform(base64?: string | null): string | null {
    if (!base64) return null;
    const s = base64.trim();
    if (s.startsWith('data:')) return s; // ya es dataURL
    const isPng = s.startsWith('iVBORw0'); // PNG
    const isJpeg = s.startsWith('/9j/'); // JPEG
    const prefix = isPng
      ? 'data:image/png;base64,'
      : isJpeg
      ? 'data:image/jpeg;base64,'
      : 'data:image/jpeg;base64,'; // fallback
    return `${prefix}${s}`;
  }
}
