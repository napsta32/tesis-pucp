import 'reflect-metadata';
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import api from './api';

import {AppDataSource} from './data-source';
import {DataSource} from 'typeorm';


dotenv.config();

export const app: Express = express();
const host: string = process.env.HOST || 'http://localhost';
const port: string = process.env.PORT || '8500';

app.use('/', api);

const dataSourceInitPromise = AppDataSource.initialize();
async function getDataSource(): Promise<DataSource> {
    return await dataSourceInitPromise;
}

const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${host}:${port}`);
});

export async function destroyServer() {
    await new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) reject(err);
            else resolve(undefined);
        });
    });
    const dataSource = await getDataSource();
    await dataSource.destroy().catch(console.error);
}
