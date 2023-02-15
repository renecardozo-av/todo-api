import { Task } from './tasks.entity';
import { AppDataSource } from '../../index';
import {
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

class TasksController {
  public async getAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    let allTasks: Task[];
    try {
      allTasks = await AppDataSource.getRepository(
        Task,
      ).find({
        order: {
          date: 'ASC',
        },
      });

      allTasks = instanceToPlain(allTasks) as Task[];
      return res.json(allTasks).status(200);
    } catch (_error) {
      console.log(_error);
      return res
        .json({ error: 'Interval Server Error' })
        .status(500);
    }
  }

  public async create(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array() });
      }
      const newTask = new Task();
      newTask.title = req.body.title;
      newTask.date = req.body.date;
      newTask.description = req.body.description;
      newTask.priority = req.body.priority;
      newTask.status = req.body.status;
      let createdTask: Task;
      createdTask = await AppDataSource.getRepository(
        Task,
      ).save(newTask);
      createdTask = instanceToPlain(createdTask) as Task;
      return res.send(createdTask).status(201);
    } catch (_error) {
      console.log(_error);
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }

  public async update(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let task: Task | null;
    let updatedTask: UpdateResult;

    try {
      const { id, status } = req.body;
      task = await AppDataSource.getRepository(
        Task,
      ).findOne({
        where: { id },
      });
      if (!task) {
        return res.status(404).json({
          error: 'The task with given ID does not exist',
        });
      }
      updatedTask = await AppDataSource.getRepository(
        Task,
      ).update(
        id,
        plainToInstance(Task, {
          status,
        }),
      );
      updatedTask = instanceToPlain(
        updatedTask,
      ) as UpdateResult;
      return res.json(updatedTask).status(200);
    } catch (_error) {
      console.log(_error);
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }
}

export const tasksController = new TasksController();
