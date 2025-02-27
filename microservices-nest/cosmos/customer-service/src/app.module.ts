import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers/entity/customer.entity';

@Module({
  imports: [CustomersModule, TypeOrmModule.forRoot(
    {
      type: 'mysql',
      host: process.env.HOSTNAME || 'localhost',
      port: 3306,
      username: 'root',
      password: 'kjksz2631@SQL',
      database: 'cosmos',
      entities: [Customer],
      synchronize: true   // only on dev, don't use in prod
    }
  )],
})
export class AppModule {}
