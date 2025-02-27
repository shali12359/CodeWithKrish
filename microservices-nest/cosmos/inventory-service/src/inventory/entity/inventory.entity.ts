import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// inventory entity class with validations
@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    @IsNotEmpty({ message: 'Name is required'})
    name: string;
    @Column('decimal')
    @IsNotEmpty({ message: 'Price is required'})
    price: number;
    @Column()
    @IsNotEmpty({ message: 'Quentity is required'})
    quentity: number;
}