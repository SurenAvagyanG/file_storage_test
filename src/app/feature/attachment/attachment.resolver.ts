import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AttachmentEntity } from './entities/attachment.entity';
import { AttachmentService } from '@feature/attachment/attachment.service';
import { CreateAttachmentInput } from '@feature/attachment/dto/create-attachment.input';
import { UpdateAttachmentInput } from '@feature/attachment/dto/update-attachment.input';

@Resolver(() => AttachmentEntity)
export class AttachmentResolver {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Mutation(() => AttachmentEntity)
  createAttachment(
    @Args('createAttachmentInput') createAttachmentInput: CreateAttachmentInput,
  ): Promise<AttachmentEntity> {
    return this.attachmentService.create(createAttachmentInput);
  }

  @Query(() => AttachmentEntity)
  getAttachmentById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AttachmentEntity> {
    return this.attachmentService.getById(id);
  }
  @Mutation(() => AttachmentEntity)
  async updateAttachment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAttachmentInput') updateAttachmentInput: UpdateAttachmentInput,
  ): Promise<AttachmentEntity> {
    return this.attachmentService.updateById(id, updateAttachmentInput);
  }
  @Mutation(() => Boolean)
  removeAttachment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.attachmentService.removeById(id);
  }
}
