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
    // configure kafka, redis
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

    // create a new dispatch
    async createDispatch(createDispatcherDto: createDispatcherDto): Promise<Dispatcher> {
        const dispatcher = this.dispatcherRepository.create(createDispatcherDto);
    
        return this.dispatcherRepository.save(dispatcher);
    }

    // get dispatchers by city
    async getDispatcherByCity(city: string) {
        const dispatcher = await this.dispatcherRepository.find({ where: { city } });
        if (!dispatcher) {
          throw new NotFoundException(`Can't find dispatcher from city: ${ city }`);
        }
        return dispatcher;
    }

    // release dispatcher
    async releaseDispatch(vehicle_number: string) {
        const dispatcher = await this.dispatcherRepository.findOne({ where: { vehicle_number } });


    }

    // consume order corfirmation event
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
                
                // check vehicles are available
                if (!availableVehicles) {
                    console.log(`Cannot find vehicle for order: ${city}`);
                }
                else {
                    // aquire lock
                    for (const vehicle of await availableVehicles) {
                        const lockKey = `prabath:dispatcher:${vehicle.vehicle_number}:lock`;
                        const lock = await this.redis.set(lockKey, 'locked', 'EX', 3600*24, 'NX');
                  
                        if (!lock) {
                          throw new BadRequestException(`Vehicle allocated: ${vehicle.vehicle_number }`)
                        }
                  
                        console.log("Lock created for dispatcher");
                        
                      }
                        
                }
            }
        })


    }


}
