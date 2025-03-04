import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { createOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Kafka } from 'kafkajs';
import { log } from 'console';
import { Redis } from 'ioredis';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly kafka = new Kafka({ brokers: ['3.0.159.213:9092']});
  private readonly producer = this.kafka.producer();
  private readonly consumer = this.kafka.consumer({ groupId: 'prabath-order-service' });
  private readonly redis = new Redis({ host:'3.0.159.213', port:6379});

  private readonly inventoryServiceUrl = 'http://localhost:3001/products';
  private readonly customerServiceUrl = 'http://localhost:3002/customers';

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly httpService: HttpService,
  ) {}

  // run when service started
  async onModuleInit() {
    await this.producer.connect()
    await this.consumer.connect()
    await this.consumerPlaceOrder();
  }

  async create(createOrderDto: createOrderDto): Promise<any> {
    const { customerId, items } = createOrderDto;
    //--------customer
    // Validate customer exists
    let customerName = '';
    try {
      const response$ = this.httpService.get(
        `${this.customerServiceUrl}/${customerId}`,
      );
      const response = await lastValueFrom(response$);
      customerName = response.data.name;
    } catch (error) {
      throw new BadRequestException(
        `Customer ID ${customerId} does not exist.`,
      );
    }

    // aquire lock
    for (const item of items) {
      const lockKey = `prabath:products:${item.productId}:lock`;
      const lock = await this.redis.set(lockKey, 'locked', 'EX', 3600*24, 'NX');

      if (!lock) {
        throw new BadRequestException(`Product id ${item.productId } is being processed. Please try again later`)
      }

      console.log("Lock created");
      
    }

    //-----------------
    // produce an order as an event
    this.producer.send({
      topic:`prabath.order.create`,
      messages: [
        { value: JSON.stringify({ customerId, customerName, items })}
      ]
    });

    return { message: `Order is placed. Waiting inventory service to process` }

    /*
    //---------
    for (const item of items) {
      try {
        const response$ = this.httpService.get(
          `${this.inventoryServiceUrl}/${item.productId}/validate?quantity=${item.quantity}`,
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
    //---------

    const order = this.orderRepository.create({
      customerId,
      status: 'PENDING',
    });
    const savedOrder = await this.orderRepository.save(order);

    const orderItems = items.map((item) =>
      this.orderItemRepository.create({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        order: savedOrder,
      }),
    );
    const savedOrderItems = await this.orderItemRepository.save(orderItems);

    // Reduce stock in Inventory Service
    for (const item of savedOrderItems) {
      try {
        await lastValueFrom(
          this.httpService.patch(
            `${this.inventoryServiceUrl}/${item.productId}/quantity`,
            { quantity: item.quantity },
          ),
        );
      } catch (error) {
        throw new BadRequestException(
          `Failed to reduce stock for Product ID ${item.productId}`,
        );
      }
    }
    return { ...savedOrder, customerName, items: orderItems };
    */
  }
  async fetch(id: any) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }
  async fetchAll() {
    return await this.orderRepository.find({ relations: ['items'] });
  }

  async updateOrderStaus(id: number, updateStatus: UpdateOrderStatus) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`order with id: ${id} is not found`);
    }
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `order status cannot be changed when its delivered or cancelled`,
      );
    }
    order.status = updateStatus.status;
    return await this.orderRepository.save(order);
  }

  async consumerPlaceOrder() {
    await this.consumer.subscribe({
      topic:`prabath.inventory.update`,
    })

    this.consumer.run({
      eachMessage: async ({ message }) => {
        const { customerId, items } = JSON.parse(
          message.value.toString()
        )

        this.placeOrder({ customerId, items });
      }
    })
  }

  async placeOrder(createOrderDto: createOrderDto) {
    const { customerId, items } = createOrderDto;

    const order = this.orderRepository.create({
      customerId,
      status: 'PENDING',
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = items.map((item) =>
      this.orderItemRepository.create({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        order: savedOrder,
      }),
    );

    const savedOrderItems = await this.orderItemRepository.save(orderItems);

    console.log("Order placed");

    // produce an order confirmation as an event
    this.producer.send({
      topic:`prabath.order.confirmed`,
      messages: [
        { value: JSON.stringify({ customerId, items })}
      ]
    });

    return { message: `Order is successfully created.` }
  }
}
