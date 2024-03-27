import { AttachmentService } from '@feature/attachment/attachment.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateAttachmentDto } from '@feature/attachment/dto/create-attachment.dto';
import { UpdateAttachmentDto } from '@feature/attachment/dto/update-attachment.dto';
import { AttachmentModel } from '@domain/models/attachment.model';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post()
  create(@Body() dto: CreateAttachmentDto): Promise<AttachmentModel> {
    return this.attachmentService.create(dto);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<AttachmentModel> {
    return this.attachmentService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAttachmentDto,
  ): Promise<AttachmentModel> {
    return this.attachmentService.updateById(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.attachmentService.removeById(id);
  }
}
