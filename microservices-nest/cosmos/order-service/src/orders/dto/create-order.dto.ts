import { Type } from "class-transformer";
import { IsArray, IsInt, ValidateNested } from "class-validator";

class OrderItemDto {
    @IsInt()
    productId: number;
    price: number;
    quentity: number;
}

export class CreateOrderDto {
    @IsInt()
    customerId: number;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    Items: OrderItemDto[];
}