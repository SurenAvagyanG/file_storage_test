import { Inject, Injectable } from '@nestjs/common';
import { ImageResizerAdapter } from '@feature/image-resizer/image-resizer-adapter.abstract';

@Injectable()
export class ImageResizerService {
  constructor(
    @Inject(ImageResizerAdapter)
    private readonly imageManagerAdapter: ImageResizerAdapter,
  ) {}

  async resize(buffer: Buffer, size: number): Promise<Buffer> {
    return this.imageManagerAdapter.resize(buffer, size);
  }
}
