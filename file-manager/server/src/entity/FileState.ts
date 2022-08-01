import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class FileState {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'varchar', length: 200})
    public state: string;

    constructor(state: string) {
        this.state = state;
    }

}
