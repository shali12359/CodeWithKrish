import { IsNotEmpty, IsOptional } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// customer entity class with validations
@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    @IsNotEmpty({ message: 'Name is required'})
    name: string;
    @Column({ unique: true })
    @IsNotEmpty({ message: 'Email is required'})
    email: string;
    @Column({ nullable: true })
    address: string;
}