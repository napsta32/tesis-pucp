import request from 'supertest';
import server from '../index';

describe('test something', () => {
    it('should have a projects endpoint', async() => {
        const res = await request(server).get('/projects');
        expect(res.status).toEqual(200);
    });
});