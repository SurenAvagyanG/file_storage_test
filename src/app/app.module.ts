import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MainModule } from '@feature/main/main.module';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { LoggerModule } from '@infrastructure/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentModule } from '@feature/attachment/attachment.module';
import { fileSystemConfig } from '@config/file-system.config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { isProdMode } from '@shared/utils';
import { UploadLinkModule } from '@feature/upload-link/upload-link.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, fileSystemConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) =>
        config.getOrThrow(`db.${config.getOrThrow('db.driver')}`),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (config: ConfigService) => {
        return {
          playground: !isProdMode(),
          autoSchemaFile: 'schema.gql',
          path: config.getOrThrow('app.service_name'),
        };
      },
      inject: [ConfigService],
    }),
    AttachmentModule,
    UploadLinkModule,
    MainModule,
    LoggerModule,
  ],
})
export class AppModule {}
