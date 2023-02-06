import express,{ Express } from 'express';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Task } from './src/tasks/tasks.entity';
import { tasksRoutes } from './src/tasks/tasks.routes';

const app: Express = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [Task],
  synchronize: true
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on POR: ${PORT}`));
  })
  .catch(error => console.log('Error during Data Source initializacion', error));

app.use('/', tasksRoutes);

