import { Injectable, OnModuleInit } from '@nestjs/common';
import { log } from 'console';
import { Kafka } from 'kafkajs';

@Injectable()
export class NotificationsService implements OnModuleInit {
    private readonly kafka = new Kafka({ brokers: ['3.0.159.213:9092']});
    private readonly producer = this.kafka.producer();
    private readonly consumer = this.kafka.consumer({ groupId: 'prabath-notification-service' });
    
    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect();
        await this.consumeOrderConfirmation();
    }

    async consumeOrderConfirmation() {
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

                console.log("Order created successfully: " + message.value.toString());
            }
        })
    }
}
