import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import { Dispatcher } from './entity/dispatcher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createDispatcherDto } from './dto/create-dispatcher.dto';
import { log } from 'console';

@Injectable()
export class DispatcherService implements OnModuleInit {
    private readonly kafka = new Kafka({ brokers: ['3.0.159.213:9092']});
    private readonly producer = this.kafka.producer();
    private readonly consumer = this.kafka.consumer({ groupId: 'prabath-dispatcher-service' });
    private readonly redis = new Redis({ host:'3.0.159.213', port:6379});

    constructor(
        @InjectRepository(Dispatcher)
        private readonly dispatcherRepository: Repository<Dispatcher>,
      ) {}

    async onModuleInit() {
        await this.consumer.connect();
        await this.producer.connect();
        await this.consumeDispatcherService();
    }

    async createDispatch(createDispatcherDto: createDispatcherDto): Promise<Dispatcher> {
        const dispatcher = this.dispatcherRepository.create(createDispatcherDto);
    
        return this.dispatcherRepository.save(dispatcher);
    }

    async getDispatcherByCity(city: string) {
        const dispatcher = await this.dispatcherRepository.findOne({ where: { city } });
        if (!dispatcher) {
          throw new NotFoundException(`Can't find dispatcher from city: ${ city }`);
        }
        return dispatcher;
    }

    async consumeDispatcherService() {
        await this.consumer.subscribe({
            topic:`prabath.order.confirmed`,
        });

        await this.consumer.run({
            eachMessage: async ({message}) => {
                if (message.value === null || message.value === undefined) {
                    console.log('No message received');
                    return; 
                }
                    
                const { customerId, city, items } = JSON.parse(
                    message.value.toString()
                );

                console.log("Dispatcher: Order created successfully: " + message.value.toString());
 
                const dispatcherCity = city;

                const availableVehicles = this.getDispatcherByCity(dispatcherCity);
                console.log("Available: " + availableVehicles);
                
                if (!availableVehicles) {
                    console.log(`Cannot find vehicle for order: ${city}`);
                }
                else {
                    // aquire lock
                        // const lockKey = `prabath:dispatch:${availableVehicles}:lock`;
                        // const lock = await this.redis.set(lockKey, 'locked', 'EX', 3600*24, 'NX');
                
                        // if (!lock) {
                        // throw new BadRequestException(`Product id ${item.productId } is being processed. Please try again later`)
                        // }
                
                        // console.log("Lock created");
                        
                }



                
            }
        })


    }


}
