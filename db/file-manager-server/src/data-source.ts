import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {Project} from './entity/Project';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'file_manager_db',
    synchronize: true,
    logging: false,
    entities: [Project],
    migrations: [],
    subscribers: []
});
