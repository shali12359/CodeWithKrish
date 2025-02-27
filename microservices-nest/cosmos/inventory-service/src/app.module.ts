import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './inventory/entity/inventory.entity';

@Module({
  imports: [InventoryModule, TypeOrmModule.forRoot(
    {
      type: 'mysql',
      host: process.env.HOSTNAME || 'localhost',
      port: 3306,
      username: 'root',
      password: 'kjksz2631@SQL',
      database: 'cosmos',
      entities: [Inventory],
      synchronize: true   // only on dev, don't use in prod
    }
  )],
})
export class AppModule {}
