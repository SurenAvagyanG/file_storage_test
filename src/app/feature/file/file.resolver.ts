import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { FileEntity } from '@feature/file/entities/file.entity';
import { FileService } from '@feature/file/file.service';

@Resolver(() => FileEntity)
export class FileResolver {
  constructor(private fileService: FileService) {}
  @ResolveField()
  async publicUrl(@Parent() fileEntity: FileEntity): Promise<string> {
    return this.fileService.getPublicUrl(fileEntity);
  }
}
