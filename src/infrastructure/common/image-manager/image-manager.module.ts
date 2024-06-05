import { Module } from '@nestjs/common';
import { ImageManagerService } from './image-manager.service';
import { ImageManagerAdapter } from './image-manager-adapter.abstract';
import { SharpAdapter } from './sharp';

@Module({
  providers: [
    ImageManagerService,
    {
      provide: ImageManagerAdapter,
      useClass: SharpAdapter,
    },
  ],
  exports: [ImageManagerService],
})
export class ImageManagerModule {}
