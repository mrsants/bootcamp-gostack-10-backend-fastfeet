import { Router } from 'express';
import UserController from './controllers/UserController';
import AuthenticationMiddleware from './middlewares/auth';
import SessionController from './controllers/SessionController';
import RecipientController from './controllers/RecipientController';

const routes = Router();

routes.post('/user', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthenticationMiddleware);

routes.put('/user', UserController.update);

routes.get('/recipient', RecipientController.index);

routes.post('/recipient', RecipientController.store);

export default routes;
