import {Router} from 'express';

const app = Router();

app.get('/', (_, res) => {
    return res.json({
        service: 'file-manager-server',
        version: '0.0.1'
    });
});

app.get('/projects', (req, res) => {
    return res.json({});
});

export default app;
