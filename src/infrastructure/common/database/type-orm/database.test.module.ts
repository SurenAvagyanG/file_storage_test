import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) =>
        config.getOrThrow(`db.${config.getOrThrow('db.driver')}`),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseTestingModule {}
