import {Router} from 'express';

const projects = Router();

projects.get('/projects', (req, res) => {
    return res.json({});
});

export default projects;
