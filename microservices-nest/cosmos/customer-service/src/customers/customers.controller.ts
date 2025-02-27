import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

// customer controller class
@Controller('customers')
export class CustomersController {
    // injecting customer service
    constructor(private customerService: CustomersService) {}

    // 1 - endpoint for creating a new customer
    @Post()
    async create(@Body() createCustomerDto: CreateCustomerDto) {
        return await this.customerService.create(createCustomerDto);
    }

    // 2 - endpoint for get customer by id
    @Get(':id')
    async fetch(@Param('id') id: number) {
        return await this.customerService.fetch(id);
    }

    // 3 - endpoint for get all customers
    @Get() 
    async fetchAll() {
        return await this.customerService.fetchAll();
    }
}
