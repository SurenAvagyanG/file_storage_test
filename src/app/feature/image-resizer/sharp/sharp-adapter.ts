import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { ImageResizerAdapter } from '@feature/image-resizer/image-resizer-adapter.abstract';

@Injectable()
export class SharpAdapter extends ImageResizerAdapter {
  async resize(buffer: Buffer, size: number): Promise<Buffer> {
    return sharp(buffer)
      .resize(size, size, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();
  }
}
