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

routes.get('/recipients', RecipientController.index);

routes.get('/recipients/:recipientId', RecipientController.show);

routes.post('/recipients', RecipientController.store);

routes.put('/recipients/:recipientId', RecipientController.update);

routes.delete('/recipients/:recipientId', RecipientController.delete);

export default routes;
