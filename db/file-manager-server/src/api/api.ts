import {Router} from 'express';

const api = Router();

api.get('/', (_, res) => {
    return res.json({
        service: 'file-manager-server',
        version: '0.0.1'
    });
});

api.get('/projects', (req, res) => {
    return res.json({});
});

export default api;
