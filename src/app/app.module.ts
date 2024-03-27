import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MainModule } from '@feature/main/main.module';
import { ErrorHandlerModule } from '@core/error-handler/error-handler.module';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentModule } from '@feature/attachment/attachment.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { isProdMode } from '@shared/utils';
import { fileSystemConfig } from '@config/file-system.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, fileSystemConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) =>
        config.get(`db.${config.get('db.driver')}`),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: !isProdMode(),
      autoSchemaFile: 'schema.gql',
    }),
    ErrorHandlerModule,
    AttachmentModule,
    MainModule,
  ],
})
export class AppModule {}
