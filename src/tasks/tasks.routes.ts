import { Router } from 'express';
import { tasksController } from './tasks.controller';
import { createValidator, updateValidator } from './tasks.validator';

export const tasksRoutes: Router = Router();

tasksRoutes.get('/tasks', tasksController.getAll);

tasksRoutes.post(
  '/tasks',
  createValidator,
  tasksController.create
);

tasksRoutes.put(
  '/tasks',
  updateValidator,
  tasksController.update
);
