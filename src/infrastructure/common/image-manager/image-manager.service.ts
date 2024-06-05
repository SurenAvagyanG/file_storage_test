import { Inject, Injectable } from '@nestjs/common';
import { ImageManagerAdapter } from '@infrastructure/common/image-manager/image-manager-adapter.abstract';

@Injectable()
export class ImageManagerService {
  constructor(
    @Inject(ImageManagerAdapter)
    private readonly imageManagerAdapter: ImageManagerAdapter,
  ) {}

  async resize(buffer: Buffer, size: number): Promise<Buffer> {
    return this.imageManagerAdapter.resize(buffer, size);
  }
}
