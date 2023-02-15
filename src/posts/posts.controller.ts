import { Posts } from './posts.entity';
import { AppDataSource } from '../../index';
import {
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateResult, DeleteResult } from 'typeorm';

class PostsController {
  public async findAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    let allPosts: Posts[];
    try {
      allPosts = await AppDataSource.getRepository(
        Posts,
      ).find({
        order: {
          createdAt: 'ASC',
        },
      });

      allPosts = instanceToPlain(allPosts) as Posts[];
      return res.status(200).json(allPosts);
    } catch (_error) {
      console.error(_error);
      return res
        .status(500)
        .json({ error: 'Internal Server Error' });
    }
  }

  public async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res
          .status(404)
          .json({errors: errors.array()});
      }
      const { id } = req.params;
      let postFound = await AppDataSource.getRepository(
        Posts
      ).findOne({where: {id}});
      if (!postFound) {
        return res
          .status(404)
          .json({error: 'The post with the given ID was not found'})
      }
      postFound = instanceToPlain(postFound) as Posts;
      return res
        .status(200)
        .json(postFound);
    } catch (_error) {
      console.error(_error);
      return res
        .status(500)
        .json({error: 'Internal Server Error'})
    }
  }
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res
          .status(400)
          .json({errors: errors.array()});
      }

      const newPost = new Posts();
      const { author, text, createdAt, title} = req.body;
      newPost.author = author;
      newPost.text = text;
      newPost.createdAt = new Date(createdAt);
      newPost.updatedAt = new Date(createdAt);
      newPost.title = title;
      let createdPost: Posts = await AppDataSource.getRepository(Posts).save(newPost);
      createdPost = instanceToPlain(createdPost) as Posts;
      return res.status(201).json(createdPost);
    } catch (_error) {
      console.log(_error);
      return res
        .status(500)
        .json({error: 'Internal Server Error'});
        
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.json({error: errors.array()}).status(400);
      }

      let post: Posts | null;
      let updatedPost: UpdateResult;

      const { text, author, title, updatedAt } = req.body;
      const { id } = req.params;
      post = await AppDataSource.getRepository(Posts).findOne({ where: { id }});
      if (!post) {
        return res
          .status(404)
          .json({error: 'The post with given ID does not exist'});
      }
      let postData: Posts = {} as Posts;
      if (text) postData.text = text;
      if (author) postData.author = author;
      if (title) postData.title = title;
      if (text) postData.text = text;
      if (updatedAt) postData.updatedAt = new Date(updatedAt);
      updatedPost = await AppDataSource.getRepository(
        Posts
      ).update(
        id,
        plainToInstance(Posts, {...postData})
      );
      updatedPost = instanceToPlain(updatedPost) as UpdateResult;
      return res
        .status(200)
        .json(updatedPost);
    } catch (_error) {
      console.log(_error);
      return res
        .status(500)
        .json({error: 'Internal Server Error'});
    }
  }

  public async searchPost(req: Request, res: Response): Promise<Response> {
    try {
      const results = await AppDataSource.query( 'SELECT id, text FROM posts WHERE text LIKE "%' + req.query.text +'%"');
      return res
        .status(200)
        .json(results)
    } catch (_error) {
      console.error(_error);
      return res
        .status(404)
        .json({message: 'Internal Server Error'})
    }
  }

  public async delete(req:Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(404)
          .json({error: errors.array()})
      }

      const {id} = req.params;
      let postFound: Posts | null;
      let deletedPost: DeleteResult;
      postFound = await AppDataSource.getRepository(Posts).findOne({
        where: { id }
      });
      if (!postFound) {
        return res
          .status(404)
          .json({error: 'The post with given id does not exist'});
      }
      deletedPost = await AppDataSource.getRepository(Posts).delete({id});
      deletedPost = instanceToPlain(deletedPost) as DeleteResult;
      return res
        .status(200)
        .json(deletedPost);

    } catch (_error) {
      console.error(_error);
      return res
        .json({error: 'Internal Served Error'})
        .status(500);
    }
  }
}


export const postsController = new PostsController();