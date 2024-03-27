import { Resolver } from '@nestjs/graphql';
import { AttachmentEntity } from './entities/attachment.entity';

@Resolver(() => AttachmentEntity)
export class AttachmentResolver {
  // constructor(private readonly attachmentService: AttachmentService) {}
  //
  // @Mutation(() => AttachmentEntity)
  // createAttachment(
  //   @Args('createAttachmentInput') createAttachmentInput: CreateAttachmentInput,
  // ) {
  //   return this.attachmentService.create(createAttachmentInput);
  // }
  //
  // @Query(() => AttachmentEntity, { name: 'attachment' })
  // findOne(@Args('id') id: string) {
  //   return this.attachmentService.getById(id);
  // }
  //
  // @Mutation(() => AttachmentEntity)
  // removeAttachment(@Args('id') id: string) {
  //   return this.attachmentService.removeById(id);
  // }
}
