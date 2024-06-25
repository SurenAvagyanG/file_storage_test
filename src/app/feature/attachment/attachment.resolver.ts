import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AttachmentEntity } from './entities/attachment.entity';
import { AttachmentService } from '@feature/attachment/attachment.service';
import { CreateAttachmentInput } from '@feature/attachment/dto/create-attachment.input';
import { UpdateAttachmentInput } from '@feature/attachment/dto/update-attachment.input';
import { Inject } from '@nestjs/common';
import {
  DBTransactionService,
  IDBTransactionService,
} from '@fifth/expia-common';

@Resolver(() => AttachmentEntity)
export class AttachmentResolver {
  constructor(
    private readonly attachmentService: AttachmentService,
    @Inject(DBTransactionService)
    private transactionService: IDBTransactionService,
  ) {}

  @Mutation(() => AttachmentEntity)
  async createAttachment(
    @Args('createAttachmentInput') createAttachmentInput: CreateAttachmentInput,
  ): Promise<AttachmentEntity> {
    return this.transactionService.run(async (runner) => {
      return await this.attachmentService.createAttachment(
        createAttachmentInput,
        runner,
      );
    });
  }

  @Query(() => AttachmentEntity)
  getAttachmentById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AttachmentEntity> {
    return this.attachmentService.findOrFailBy({ id });
  }

  @Query(() => [AttachmentEntity])
  getAttachmentsByIds(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<AttachmentEntity[]> {
    return this.attachmentService.findAll({ id: ids });
  }

  @Mutation(() => AttachmentEntity)
  async updateAttachment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAttachmentInput') updateAttachmentInput: UpdateAttachmentInput,
  ): Promise<AttachmentEntity> {
    return this.attachmentService.update(id, updateAttachmentInput);
  }
  @Mutation(() => Boolean)
  removeAttachment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AttachmentEntity> {
    return this.attachmentService.delete(id);
  }
}
