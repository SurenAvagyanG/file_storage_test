import { registerAs } from '@nestjs/config';

export const fileSystemConfig = registerAs('fileSystem', () => ({
  driver: process.env.FS_DRIVER ?? 'local',
  s3: {
    accessKeyId: process.env.FS_S3_ACCESS_KEY_ID,
    accessKeySecret: process.env.FS_S3_ACCESS_KEY_SECRET,
    bucket: process.env.FS_S3_BUCKET,
  },
  local: {},
}));
