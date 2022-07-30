import 'reflect-metadata';
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import api from './api';

import {AppDataSource} from './data-source';
import {DataSource} from 'typeorm';
import {Project} from './entity/Project';


dotenv.config();

export const app: Express = express();
const host: string = process.env.HOST || 'http://localhost';
const port: string = process.env.PORT || '8500';

app.use('/', api);

const dataSourceInitPromise = AppDataSource.initialize().then(async dataSource => {
    if (process.env.DEV === 'true') {
        const projectsRepository = AppDataSource.getRepository(Project);
        await projectsRepository.insert(new Project('dummy'));
    }
    return dataSource;
});
async function getDataSource(): Promise<DataSource> {
    return await dataSourceInitPromise;
}

const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${host}:${port}`);
});

export async function waitForDatabase() {
    return await getDataSource();
}
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
