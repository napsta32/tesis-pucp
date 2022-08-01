import request from 'supertest';
import {app, destroyServer, waitForDatabase} from '../../index';

beforeEach(async () => {
    await waitForDatabase();
});

describe('root', () => {
    test('should show server version', async() => {
        const res = await request(app).get('/');
        expect(res.status).toEqual(200);
        expect(res.body.service).toBe('file-manager-server');
        expect(res.body.version).toMatch(/\d+\.\d+\.\d+/); // Semantic versioning
    });
});

afterAll(async () => {
    await destroyServer();
});
