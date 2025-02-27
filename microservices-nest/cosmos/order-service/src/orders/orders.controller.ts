import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { UpdateOrderStatus } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private orderService: OrdersService) {
    }

    @Post()
    async create(@Body() createOrderDto: CreateOrderDto) {
        return await this.orderService.create(createOrderDto);
    }

    @Get(':id')
    async fetch(@Param('id') id: number) {
        return await this.orderService.fetch(id);
    }

    @Get()
    async fetchAll() {
        return await this.orderService.fetchAll();
    }

    @Patch(':id/status')
    async UpdateOrderStatus(@Param('id') id: number, @Body() updateOrderStatus: UpdateOrderStatus) {
        return await this.orderService.updateOrderStatus(id, updateOrderStatus);
    }
}
