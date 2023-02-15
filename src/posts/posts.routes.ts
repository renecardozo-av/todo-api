import { Router } from 'express';
import { postsController } from './posts.controller';
import { createValidator, updateValidator, deleteValidator } from './posts.validator';

export const postsRoutes: Router = Router();

postsRoutes.get('/posts', postsController.findAll);
postsRoutes.get('/posts/:id', postsController.findOne);
postsRoutes.post('/posts/search/', postsController.searchPost);
postsRoutes.post('/posts', createValidator, postsController.create);
postsRoutes.put('/posts/:id', updateValidator, postsController.update);
postsRoutes.delete('/posts/:id', deleteValidator, postsController.delete);
