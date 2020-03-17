/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
import * as Sentry from '@sentry/node';
import 'dotenv/config';
import express, { json } from 'express';
import 'express-async-errors';
import path from 'path';
import Youch from 'youch';
import sentryConfig from './config/sentryConfig';
import './database';
import routes from './routes';
import cors from 'cors';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')),
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }
      return res.status(500).json({
        error: 'Internal server error',
      });
    });
  }
}

export default new App().server;
