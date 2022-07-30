import request from 'supertest';
import {app, destroyServer} from '../../index';

describe('projects', () => {
    test('should list all the active projects in database', async() => {
        const res = await request(app).get('/projects');
        expect(res.status).toEqual(200);
    });
});

afterAll(async () => {
    await destroyServer();
});
