import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { fileSystemConfig } from '@config/file-system.config';
import { StorageFactory } from '@infrastructure/storage';
import { MockFileSystemAdapter } from '@infrastructure/storage/mock-file-system/mock-file-system-adapter';
import { UploadLinkResolver } from '@feature/upload-link/upload-link.resolver';
import { DatabaseTestingModule } from 'expiaa-common';
import { UploadLinkModule } from '@feature/upload-link/upload-link.module';

describe('AttachmentResolver', () => {
  let resolver: UploadLinkResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UploadLinkModule,
        DatabaseTestingModule,
        ConfigModule.forRoot({
          load: [appConfig, dbConfig, fileSystemConfig],
          isGlobal: true,
        }),
      ],
    }).compile();

    StorageFactory.addStorageDriver('s3', new MockFileSystemAdapter());
    resolver = module.get<UploadLinkResolver>(UploadLinkResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // it('should create upload link with extension', async () => {
  //   const extension = 'png';
  //
  //   const entity = await resolver.createUploadLink({
  //     extension,
  //   });
  //
  //   expect(entity.signedUrl).toContain(extension);
  //   expect(entity.staticUrl).toBeDefined();
  //   expect(entity.id).toBeDefined();
  // });
});
