import { body, ValidationChain, param } from 'express-validator';

export const createValidator: ValidationChain[] = [
  body('author')
    .not()
    .isEmpty()
    .withMessage('The author of the post is mandatory')
    .trim()
    .isString()
    .withMessage('The author needs to be in text format'),
  body('text')
    .not()
    .isEmpty()
    .withMessage('The post text is mandatory')
    .trim(),
  body('createdAt')
    .trim()
    .isDate()
    .withMessage('createAt with wrong format')
    .not()
    .isEmpty()
    .withMessage('createdAt is mandatory'),
];

export const findOneValidator: ValidationChain[] = [
  param('id')
    .not()
    .isEmpty()
    .withMessage('post id is mandatory'),
];

export const updateValidator: ValidationChain[] = [
  param('id')
  .not()
  .isEmpty()
  .withMessage('post id is mandatory'),
  body('text')
    .not()
    .isEmpty()
    .withMessage('The post text is mandatory')
    .trim()
    .isString()
    .withMessage('Only string are allowed'),
  body('updatedAt')
    .trim()
    .isDate()
    .withMessage('createAt with wrong format')
    .not()
    .isEmpty()
    .withMessage('updatedAt is mandatory'),
];

export const deleteValidator: ValidationChain[] = [
  param('id')
  .not()
  .isEmpty()
  .withMessage('Id is mandatory')
]