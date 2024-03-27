import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AttachmentEntity } from './entities/attachment.entity';
import { AttachmentService } from '@feature/attachment/attachment.service';
import { CreateAttachmentInput } from '@feature/attachment/dto/create-attachment.input';

@Resolver(() => AttachmentEntity)
export class AttachmentResolver {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Mutation(() => AttachmentEntity)
  createAttachment(
    @Args('createAttachmentInput') createAttachmentInput: CreateAttachmentInput,
  ) {
    return this.attachmentService.create(createAttachmentInput);
  }

  @Query(() => AttachmentEntity)
  getAttachmentById(@Args('id') id: string) {
    return this.attachmentService.getById(id);
  }

  @Mutation(() => AttachmentEntity)
  removeAttachment(@Args('id') id: string) {
    return this.attachmentService.removeById(id);
  }
}
