import { IsOptional, IsString } from "class-validator";

// dto for create customer request
export class CreateCustomerDto {
    name: string;
    @IsString()
    email: string;
    @IsOptional()
    address: string;
}