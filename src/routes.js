import { Router } from 'express';
import DeliveryController from './controllers/DeliveryController';
import RecipientController from './controllers/RecipientController';
import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';

import AuthenticationMiddleware from './middlewares/auth';

const routes = Router();

routes.post('/user', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthenticationMiddleware);

routes.put('/user', UserController.update);

routes.get('/recipient', RecipientController.index);

routes.get('/recipient/:recipientId', RecipientController.show);

routes.post('/recipient', RecipientController.store);

routes.put('/recipient/:recipientId', RecipientController.update);

routes.delete('/recipient/:recipientId', RecipientController.delete);

routes.get('/delivery', DeliveryController.index);

routes.get('/delivery/:deliveryId', DeliveryController.show);

routes.post('/delivery', DeliveryController.store);

routes.put('/delivery/:deliveryId', DeliveryController.update);

routes.delete('/delivery/:deliveryId', DeliveryController.delete);

export default routes;
