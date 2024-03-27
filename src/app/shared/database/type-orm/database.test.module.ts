import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) =>
        config.get(`db.${config.get('db.driver')}`),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseTestingModule {}
