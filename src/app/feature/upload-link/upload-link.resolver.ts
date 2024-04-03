import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadLinkService } from '@feature/upload-link/upload-link.service';
import { CreateUploadLinkInput } from '@feature/upload-link/dto/create-upload-link.input';
import { UploadLinkEntity } from '@feature/upload-link/entity/upload-link.entity';
import { Inject } from '@nestjs/common';
import {
  DBTransactionService,
  IDBTransactionService,
} from '@infrastructure/common';

@Resolver(() => UploadLinkEntity)
export class UploadLinkResolver {
  constructor(
    private readonly uploadLinkService: UploadLinkService,
    @Inject(DBTransactionService)
    private transactionService: IDBTransactionService,
  ) {}

  @Mutation(() => UploadLinkEntity)
  async createUploadLink(
    @Args('createUploadLink') createUploadLinkInput: CreateUploadLinkInput,
  ): Promise<UploadLinkEntity> {
    return this.transactionService.run((runner) => {
      return this.uploadLinkService.create(createUploadLinkInput, runner);
    });
  }
}
