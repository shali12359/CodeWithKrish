import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) 
        private readonly orderRepository:Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository:Repository<OrderItem>,
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order | null> {
        const { customerId, Items } = createOrderDto;

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
