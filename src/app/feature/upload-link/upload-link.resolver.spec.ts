import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { fileSystemConfig } from '@config/file-system.config';
import { StorageFactory } from '@infrastructure/storage';
import { MockFileSystemAdapter } from '@infrastructure/storage/mock-file-system/mock-file-system-adapter';
import { UploadLinkResolver } from '@feature/upload-link/upload-link.resolver';
import { DatabaseTestingModule } from '@infrastructure/common';
import { UploadLinkModule } from '@feature/upload-link/upload-link.module';
import { StorageService } from '@shared/storage';

describe('AttachmentResolver', () => {
  let resolver: UploadLinkResolver;
  let storageService: StorageService;

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
    storageService = module.get<StorageService>(StorageService);
    resolver = module.get<UploadLinkResolver>(UploadLinkResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create an upload link with valid extension and parameters', async () => {
    const createUploadLinkInput = {
      extension: 'jpg',
      params: { expires: 3600, contentType: 'image/jpeg' },
    };

    const result = await resolver.createUploadLink(createUploadLinkInput);
    expect(result.signedUrl).toContain(
      `${createUploadLinkInput.extension}?signed=1`,
    );
    expect(result.staticUrl).toContain(createUploadLinkInput.extension);
    expect(result.staticUrl).not.toContain('signed');
    expect(result.id).toBeDefined();
  });

  it('should handle error when invalid extension is provided', async () => {
    const createUploadLinkInput = { extension: 'invalid_extension' };

    await expect(
      resolver.createUploadLink(createUploadLinkInput),
    ).rejects.toThrow('Invalid extension');
  });

  it('should handle error when storage service fails to generate upload URL', async () => {
    jest
      .spyOn(storageService, 'getUploadUrl')
      .mockRejectedValueOnce(new Error('Storage service error'));

    const createUploadLinkInput = { extension: 'png' };

    await expect(
      resolver.createUploadLink(createUploadLinkInput),
    ).rejects.toThrow('Storage service error');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
