import request from 'supertest';
import {AppDataSource} from '../data-source';
import {app} from '../index';

describe('test something', () => {
    it('should have a projects endpoint', async() => {
        const res = await request(app).get('/projects');
        expect(res.status).toEqual(200);
    });
});
