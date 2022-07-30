import {Router} from 'express';
import projects from './projects';

const api = Router();

api.get('/', (_, res) => {
    return res.json({
        service: 'file-manager-server',
        version: '0.0.1'
    });
});
api.use(projects);

export default api;
