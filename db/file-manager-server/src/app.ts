import {Router} from 'express';

const app = Router();

app.get('/projects', (req, res) => {
    return res.json({});
});

export default app;
