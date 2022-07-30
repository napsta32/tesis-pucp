import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column} from 'typeorm';

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'varchar', length: 45})
    public name: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    public createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'
    })
    public updatedAt: Date;

}
