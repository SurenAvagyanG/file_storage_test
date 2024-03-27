import { Controller, Post, Body } from '@nestjs/common';
import { UploadProcessService } from './upload-process.service';
import { CreateUploadProcessDto } from './dto/create-upload-process.dto';
import { UploadProcessEntity } from '@feature/upload-process/entities/upload-process.entity';

@Controller('upload-process')
export class UploadProcessController {
  constructor(private readonly uploadProcessService: UploadProcessService) {}

  @Post()
  async create(
    @Body() dto: CreateUploadProcessDto,
  ): Promise<UploadProcessEntity> {
    return this.uploadProcessService.create(dto);
  }
}
