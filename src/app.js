import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import logger from './utils/logger.js';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('swagger/swagger.json'), 'utf8')
);

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(`mongodb+srv://coderhouse:codercoder2023@cluster0.wpxpupc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(cookieParser());




app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use('/api/mocks', mocksRouter);

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
