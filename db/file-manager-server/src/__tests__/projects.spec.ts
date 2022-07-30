import request from 'supertest';
import {AppDataSource} from '../data-source';
import {app} from '../index';

describe('projects', () => {
    test('should list all the active projects in database', async() => {
        const res = await request(app).get('/projects');
        expect(res.status).toEqual(200);
    });
});

describe('projects2', () => {
    test('should list all the active projects in database', async() => {
        const res = await request(app).get('/projects');
        expect(res.status).toEqual(200);
    });
});
