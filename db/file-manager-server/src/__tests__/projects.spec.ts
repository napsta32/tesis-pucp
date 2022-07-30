import request from 'supertest';
import {AppDataSource} from '../data-source';
import server from '../index';

describe('test something', () => {
    it('should have a projects endpoint', async() => {
        const res = await request(server).get('/projects');
        expect(res.status).toEqual(200);
    });
});

afterAll(async ()=> {
    await AppDataSource.destroy();
});
