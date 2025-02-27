import { IsDecimal, IsInt } from "class-validator";

// dto for create order request
export class CreateProductDto {
    name: string;
    @IsDecimal()
    price: number;
    @IsInt()
    quentity: number;
}