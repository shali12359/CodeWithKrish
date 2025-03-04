import { Module } from '@nestjs/common';
import { DispatcherModule } from './dispatcher/dispatcher.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispatcher } from './dispatcher/entity/dispatcher.entity';

@Module({
  imports: [
    DispatcherModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOSTNAME || 'localhost',
      port: 3306,
      username: 'root',
      password: 'kjksz2631@SQL',
      database: 'cosmos3',
      entities: [Dispatcher],
      synchronize: true, //only on dev
    })
  ],
})
export class AppModule {}
