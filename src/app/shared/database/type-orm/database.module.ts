import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity } from 'typeorm';
import { TypeOrmTransactionService } from './type-orm.transaction';

export const DBTransactionService = Symbol();

@Module({})
export class DatabaseModule {
  static forFeature(entities: (typeof BaseEntity)[]): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DBTransactionService,
          useClass: TypeOrmTransactionService,
        },
      ],
      imports: [TypeOrmModule.forFeature(entities)],
      exports: [DBTransactionService, TypeOrmModule],
    };
  }
}
