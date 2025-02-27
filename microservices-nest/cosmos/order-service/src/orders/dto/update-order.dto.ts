import { IsEnum } from "class-validator";

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPED = 'SHIPED',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED'
}

export class UpdateOrderStatus {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}