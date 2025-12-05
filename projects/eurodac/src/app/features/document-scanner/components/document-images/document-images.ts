import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ImgSrcPipe } from '../../../../shared/pipes/img-src.pipe';

@Component({
  selector: 'app-document-images',
  standalone: true,
  imports: [CardModule, ImageModule, ImgSrcPipe, NgTemplateOutlet],
  templateUrl: './document-images.html',
})
export class DocumentImagesComponent {
  @Input() images: any | null = null;

  hasAnyImage() {
    const i = this.images;
    return !!(i?.viz || i?.uv || i?.ir || i?.backVIZ || i?.backUV || i?.backIR);
  }
}
