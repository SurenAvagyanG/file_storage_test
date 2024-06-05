import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { ImageManagerAdapter } from '@infrastructure/common/image-manager/image-manager-adapter.abstract';

@Injectable()
export class SharpAdapter extends ImageManagerAdapter {
  async resize(buffer: Buffer, size: number): Promise<Buffer> {
    return sharp(buffer)
      .resize(size, size, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();
  }
}
