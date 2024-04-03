import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentModule } from '@feature/attachment/attachment.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { fileSystemConfig } from '@config/file-system.config';
import { StorageFactory } from '@infrastructure/storage';
import { MockFileSystemAdapter } from '@infrastructure/storage/mock-file-system/mock-file-system-adapter';
import { DatabaseTestingModule } from '@infrastructure/common';
import { UploadLinkModule } from '@feature/upload-link/upload-link.module';
import { UploadLinkService } from '@feature/upload-link/upload-link.service';
import { NotFoundException } from '@nestjs/common';

describe('AttachmentResolver', () => {
  let resolver: AttachmentResolver;
  let uploadLinkService: UploadLinkService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AttachmentModule,
        DatabaseTestingModule,
        ConfigModule.forRoot({
          load: [appConfig, dbConfig, fileSystemConfig],
          isGlobal: true,
        }),
        UploadLinkModule,
      ],
    }).compile();

    StorageFactory.addStorageDriver('s3', new MockFileSystemAdapter());
    resolver = module.get<AttachmentResolver>(AttachmentResolver);
    uploadLinkService = module.get<UploadLinkService>(UploadLinkService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create attachment from upload link', async () => {
    const extension = 'png';
    const name = 'test_image';

    const uploadLink = await uploadLinkService.create({ extension });

    const input = {
      name: `${name}.${extension}`,
      signedUrl: uploadLink.signedUrl,
      description: 'test_description',
    };

    const entity = await resolver.createAttachment(input);

    expect(entity.name).toBe(name);
    expect(entity.extension).toBe(extension);
    expect(entity.description).toBe(input.description);
    expect(entity.files[0].url).toContain(extension);
  });

  it('should fail to create attachment if upload link is incorrect', async () => {
    const extension = 'png';
    const name = 'test_image';

    const input = {
      name: `${name}.${extension}`,
      signedUrl: 'fake_url',
      description: 'test_description',
    };

    try {
      const result = await resolver.createAttachment(input);
      expect(result).toBeNull();
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should be able to get attachment by id', async () => {
    const extension = 'png';
    const name = 'test_image';

    const uploadLink = await uploadLinkService.create({ extension });

    const input = {
      name: `${name}.${extension}`,
      signedUrl: uploadLink.signedUrl,
      description: 'test_description',
    };

    const result = await resolver.createAttachment(input);

    const entity = await resolver.getAttachmentById(result.id);

    expect(entity.name).toBe(name);
    expect(entity.extension).toBe(extension);
    expect(entity.description).toBe(input.description);
    expect(entity.files[0].url).toContain(extension);
  });

  it('should be able to update attachment by id', async () => {
    const extension = 'png';
    const name = 'test_image';
    const newName = 'new_name.png';

    const uploadLink = await uploadLinkService.create({ extension });

    const input = {
      name: `${name}.${extension}`,
      signedUrl: uploadLink.signedUrl,
      description: 'test_description',
    };

    const result = await resolver.createAttachment(input);

    const entity = await resolver.updateAttachment(result.id, {
      name: newName,
    });

    expect(entity.name).toBe(newName);
  });

  it('should be able to remove attachment by id', async () => {
    const extension = 'png';
    const name = 'test_image';

    const uploadLink = await uploadLinkService.create({ extension });

    const input = {
      name: `${name}.${extension}`,
      signedUrl: uploadLink.signedUrl,
      description: 'test_description',
    };

    const entity = await resolver.createAttachment(input);

    const result = await resolver.removeAttachment(entity.id);

    try {
      const attachment = await resolver.getAttachmentById(entity.id);
      expect(attachment).toBeNull();
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    expect(result).toBeTruthy();
  });
});
