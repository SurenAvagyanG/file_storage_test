import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentModule } from '@feature/attachment/attachment.module';
import { DatabaseTestingModule } from '@shared/database';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { fileSystemConfig } from '@config/file-system.config';
import { StorageFactory } from '@infrastructure/storage';
import { MockFileSystemAdapter } from '@infrastructure/storage/mock-file-system/mock-file-system-adapter';

describe('AttachmentResolver', () => {
  let resolver: AttachmentResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AttachmentModule,
        DatabaseTestingModule,
        ConfigModule.forRoot({
          load: [appConfig, dbConfig, fileSystemConfig],
          isGlobal: true,
        }),
      ],
    }).compile();

    StorageFactory.addStorageDriver('s3', new MockFileSystemAdapter());
    resolver = module.get<AttachmentResolver>(AttachmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
