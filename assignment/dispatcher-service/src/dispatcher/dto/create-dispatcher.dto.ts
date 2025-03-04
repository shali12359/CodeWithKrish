import { Column, PrimaryGeneratedColumn } from "typeorm";

export class createDispatcherDto {
    @Column()
    vehicle_number: string;
  
    @Column()
    city: string;
}