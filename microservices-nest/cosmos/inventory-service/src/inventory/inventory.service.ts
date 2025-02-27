import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Inventory } from './entity/inventory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class InventoryService {
    // injecting customer repository
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository:Repository<Inventory>
    ) {}

    // 1 - method for create a product
    async create(createProductDto: CreateProductDto): Promise<Inventory | null> {
        const { name, price, quentity } = createProductDto;

        const product = this.inventoryRepository.create({
            name,
            price,
            quentity
        });

        // throw error when required fields are empty
        if (!name || !price || !quentity) {
            throw new BadRequestException(`All fields are required`);
        }

        // save order
        const saveProduct = await this.inventoryRepository.save(product);

        // get saved order data
        const createdProduct = await this.inventoryRepository.findOne({
            where: { id: saveProduct.id }
        });

        return createdProduct;
    }

    // 2 - method for get product by id
    async fetch(id: any) {
        // check order exists
        const product = await this.inventoryRepository.findOne({
            where: { id }
        });

        // throw error when order doesn't exists
        if (!product) {
            throw new NotFoundException(`Order doesn't exists with id ${id}`);
        }

        return this.inventoryRepository.findOne({
            where: { id }
        });
    }

    // 3 - method for get all products
    async fetchAll() {
        return this.inventoryRepository.find();
    }

    // 4 - check availability
    async checkAvailability(id: any, quentity: any): Promise<{ available: boolean }> {
        const product = await this.inventoryRepository.findOne({
            where: { id },
            select: ['quentity']
        });

        if (product) {
            return { available: product.quentity >= quentity};
        }
        else {
            throw new NotFoundException(`Product doesn't exists with id ${id}`);
        }
    }
}
