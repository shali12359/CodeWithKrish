import { Module } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { DispatcherController } from './dispatcher.controller';
import { Dispatcher } from './entity/dispatcher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [DispatcherService],
  controllers: [DispatcherController],
  imports: [TypeOrmModule.forFeature([Dispatcher])],
})
export class DispatcherModule {}
