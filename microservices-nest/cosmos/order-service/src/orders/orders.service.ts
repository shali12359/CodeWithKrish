import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
    private readonly inventoryServiceUrl = 'http://localhost:3001/products';
    private readonly customerServiceUrl = 'http://localhost:3002/customers';
    
    constructor(
        @InjectRepository(Order) 
        private readonly orderRepository:Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository:Repository<OrderItem>,
        private readonly httpService: HttpService,
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order | null> {
        const { customerId, Items } = createOrderDto;

        // check customer exists wit id
        try {
            const response$ = this.httpService.get(
              `${this.customerServiceUrl}/${customerId}`,
            );

            const response = await lastValueFrom(response$);
            
            
            if (!response.data.id) {
              throw new BadRequestException(
                `Customer doesn't exists with iD ${ response.data.id }`,
              );
            }
        } catch (error) {
            throw new BadRequestException(
              `Error checking customer details for id: ${ customerId }: ${error.message}`,
            );
        }

        // check product availability
        for (const item of Items) {
            try {
              const response$ = this.httpService.get(
                `${this.inventoryServiceUrl}/${item.productId}/validate?quantity=${item.quentity}`,
              );
              const response = await lastValueFrom(response$);
              
              if (!response.data.available) {
                throw new BadRequestException(
                  `Product ID ${item.productId} is out of stock.`,
                );
              }
            } catch (error) {
              throw new BadRequestException(
                `Error checking stock for Product ID ${item.productId}: ${error.message}`,
              );
            }
        }

        const order = this.orderRepository.create({
            customerId,
            status: 'PENDING',
        });

        const saveOrder = await this.orderRepository.save(order);

        const orderItems = Items.map((item) => 
            this.orderItemRepository.create({
                productId: item.productId,
                price: item.price,
                quentity: item.quentity,
                order: saveOrder
            }
            ),
        );

        await this.orderItemRepository.save(orderItems);

        const createdOrder = await this.orderRepository.findOne({
            where: { id: saveOrder.id },
            relations: ['items'],
        });

        // update inventory with reduced quantity
        for (const item of Items) {
            const payload = {
                quantity: item.quentity
            }

            try {
              const response$ = this.httpService.patch(
                `${this.inventoryServiceUrl}/${item.productId}/quantity`,
                payload
              );

              const response = await lastValueFrom(response$);
              

              if (!response.data.id) {
                throw new BadRequestException(
                  `Can't update inventory for id: ${item.productId}`,
                );
              }
            } catch (error) {
              throw new BadRequestException(
                `Error update inventory for Product ID ${item.productId}: ${error.message}`,
              );
            }
        }

        return createdOrder;
    }

    fetch(id: any) {
        return this.orderRepository.findOne({
            where: { id },
            relations: ['items'],
        });
    }

    fetchAll() {
        return this.orderRepository.find({ relations: ['items']});
    }

    async updateOrderStatus(id: number, updateOrderStatus: UpdateOrderStatus) {
        const order = await this.orderRepository.findOne({ where: { id }});

        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }
        if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELED) {
            throw new BadRequestException(`Order status can't changed delivered or canceled order`);
        }
        order.status = updateOrderStatus.status;

        return this.orderRepository.save(order);
    }
}
