import 'reflect-metadata';
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import api from './api';

import {AppDataSource} from './data-source';
import {Project} from './entity/Project';


dotenv.config();

export const app: Express = express();
const host: string = process.env.HOST || 'http://localhost';
const port: string = process.env.PORT || '8500';

app.use('/', api);

AppDataSource.initialize().then(async () => {
    // Initialize db
}).catch(error => console.log(error));


const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${host}:${port}`);
});

export default server;
