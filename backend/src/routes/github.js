import express from 'express';
import {github} from '../controllers/github.js'
const githubRouter = new express.Router();

chatRouter.get('/github/summary', github);
export default githubRouter;