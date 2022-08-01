import {Router} from 'express';
import wrap  from 'express-async-handler';
import {AppDataSource} from '../data-source';
import {Project} from '../entity/Project';

const projectsAPI = Router();
const projectsRepository = AppDataSource.getRepository(Project);

projectsAPI.get('/projects', wrap(async (req, res) => {
    // const projects = await projectsRepository.find({
    //     order: {id: 'DESC'}, take: 100, skip: 0
    // });
    // res.json(projects);
    res.json({});
}));

export default projectsAPI;
