import request from 'supertest';
import {AppDataSource} from '../../data-source';
import server, {app} from '../../index';

describe('root', () => {
    test('should show server version', async() => {
        const res = await request(app).get('/');
        expect(res.status).toEqual(200);
        expect(res.body.service).toBe('file-manager-server');
        expect(res.body.version).toMatch(/\d+\.\d+\.\d+/); // Semantic versioning
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
