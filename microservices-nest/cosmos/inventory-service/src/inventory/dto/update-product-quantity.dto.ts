import { IsDecimal, IsInt } from "class-validator";

// dto for update product quantity request
export class UpdateQuantityDto {
    @IsInt()
    quantity: number;
}