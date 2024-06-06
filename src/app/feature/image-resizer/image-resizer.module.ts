import { Module } from '@nestjs/common';
import { ImageResizerService } from './image-resizer.service';
import { SharpAdapter } from './sharp';
import { ImageResizerAdapter } from './image-resizer-adapter.abstract';

@Module({
  providers: [
    ImageResizerService,
    {
      provide: ImageResizerAdapter,
      useClass: SharpAdapter,
    },
  ],
  exports: [ImageResizerService],
})
export class ImageResizerModule {}
