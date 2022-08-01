import 'reflect-metadata';
import dotenv from 'dotenv';
import {DataSource} from 'typeorm';
import {Project} from './entity/Project';
import {FileState} from './entity/FileState';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'file_manager_db',
    synchronize: false,
    logging: false,
    entities: [Project, FileState],
    migrations: [],
    subscribers: []
});
