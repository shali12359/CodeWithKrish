import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Inventory } from './entity/inventory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateQuantityDto } from './dto/update-product-quantity.dto';
import { log } from 'console';

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
        // get quantity of product  
        const product = await this.inventoryRepository.findOne({
            where: { id },
            select: ['quentity']
        });

        // check product exists
        if (product) {
            // return product availability
            return { available: product.quentity >= quentity};
        }
        // throw error when product doesn't exists
        else {
            throw new NotFoundException(`Product doesn't exists with id ${id}`);
        }
    }

    // 5 - reduce product quantity
    async reduceQuantity(id: any, updateQuantityDto: UpdateQuantityDto) {
        // get product data
        const product = await this.inventoryRepository.findOne({
            where: { id },
            select: ['id', 'name', 'price','quentity']
        });

        // check product exists
        if (product) {
            // check quentity with requested quantity
            if (product.quentity >= updateQuantityDto.quantity) {
                let newQuantity = product.quentity - updateQuantityDto.quantity;

                product.quentity = newQuantity;

                return this.inventoryRepository.save(product);
            }

            else {
                throw new BadRequestException(`Stock amount for product with: ${id} is insucificent to fulfill your request`);
            }
        }
        else {
            throw new NotFoundException(`Product doesn't exists with id ${id}`);
        }
    }
}
