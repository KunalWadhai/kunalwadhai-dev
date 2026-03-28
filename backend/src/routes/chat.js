import express from 'express';
import {chat} from '../controllers/chat.js'
const chatRouter = express.Router();

chatRouter.get('/chat', chat);
export default chatRouter;