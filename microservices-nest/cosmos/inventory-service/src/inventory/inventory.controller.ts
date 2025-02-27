import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class InventoryController {
    // injecting customer service
    constructor(private inventoryService: InventoryService) {}

    // 1 - endpoint for creating a new order
    @Post()
    async create(@Body() createOrderDto: CreateProductDto) {
        return await this.inventoryService.create(createOrderDto);
    }

    // 2 - endpoint for get order by id
    @Get(':id')
    async fetch(@Param('id') id: number) {
        return await this.inventoryService.fetch(id);
    }

    // 3 - endpoint for get all orders
    @Get() 
    async fetchAll() {
        return await this.inventoryService.fetchAll();
    }

    // 4 - endpoint for get all orders
    @Get(':id/validate') 
    async checkAvailabile(@Param('id') id: number, @Query('quantity') quantity: number) {
        return await this.inventoryService.checkAvailability(id, quantity);
    }
}
