import 'reflect-metadata';
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import app from './app';

import {AppDataSource} from './data-source';
import {Project} from './entity/Project';


dotenv.config();

const server: Express = express();
const host: string = process.env.HOST || 'http://localhost';
const port: string = process.env.PORT || '8500';

server.use('/', app);

AppDataSource.initialize().then(async () => {
    // Initialize db
}).catch(error => console.log(error));


server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${host}:${port}`);
});

export default server;
