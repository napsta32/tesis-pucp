import request from 'supertest';
import {AppDataSource} from '../../data-source';
import server, {app} from '../../index';

describe('projects', () => {
    test('should list all the active projects in database', async() => {
        const res = await request(app).get('/projects');
        expect(res.status).toEqual(200);
    });
});

afterAll(async () => {
    await new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) reject(err);
            else resolve(undefined);
        });
    });
});
