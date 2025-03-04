import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { createDispatcherDto } from './dto/create-dispatcher.dto';
import { Dispatcher } from './entity/dispatcher.entity';

@Controller('dispatcher')
export class DispatcherController {
    constructor(private readonly dispatcherService: DispatcherService) {}

    @Post()
    async createDispatcher(@Body() createDispatcherDto: createDispatcherDto): Promise<Dispatcher> {
        return this.dispatcherService.createDispatch(createDispatcherDto);
    }

    @Get(':city')
    async getDispatchers(@Param('city') city: string) {
        return this.dispatcherService.getDispatcherByCity(city);
    }
}
