import { Type } from 'class-transformer';
import { IsArray, IsInt, isInt, IsString, ValidateNested } from 'class-validator';

class OrderItemDto {
  @IsInt()
  productId: number;
  @IsInt()
  price: number;
  @IsInt()
  quantity: number;
}

export class confirmOrderDto {
  @IsInt()
  customerId: number;

  // city field
  @IsString()
  city: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
