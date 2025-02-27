import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';

// customer service class
@Injectable()
export class CustomersService {
    // injecting customer repository
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository:Repository<Customer>
    ) {}

    // 1 - method for create a new customer
    async create(createCustomerDto: CreateCustomerDto): Promise<Customer | null> {
        const { name, email, address } = createCustomerDto;

        const customer = this.customerRepository.create({
            name,
            email,
            address
        });

        // throw error when name is empty
        if (name == null) {
            throw new BadRequestException(`Name field is required`);
        }

        // find whether email already exists
        const customerEmail = await this.customerRepository.findOne({
            where: { email }
        });

        // throw error when email already exists
        if (customerEmail != null) {
            throw new BadRequestException(`User email already exists`);
        }

        // save customer
        const saveCustomer = await this.customerRepository.save(customer);

        // get saved customer data
        const createdCustomer = await this.customerRepository.findOne({
            where: { id: saveCustomer.id }
        });

        return createdCustomer;
    }

    // 2 - method for get customer by id
    async fetch(id: any) {
        // check customer exists
        const customer = await this.customerRepository.findOne({
            where: { id }
        });

        // throw error when customer doesn't exists
        if (!customer) {
            throw new NotFoundException(`Customer doesn't exists with id ${id}`);
        }

        return this.customerRepository.findOne({
            where: { id }
        });
    }

    // 3 - method for get all customers
    async fetchAll() {
        return this.customerRepository.find();
    }
}
