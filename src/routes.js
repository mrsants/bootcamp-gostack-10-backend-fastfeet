import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../src/config/multerConfig';
import PhotosController from './controllers/PhotosController';
import DeliverymansController from './controllers/DeliverymansController';
import RecipientController from './controllers/RecipientController';
import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';
import AuthenticationMiddleware from './middlewares/auth';
import OrderManagementController from './controllers/OrderManagementController';

const routes = Router();

const upload = multer(multerConfig);

routes.post('/user', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(AuthenticationMiddleware);

routes.put('/user', UserController.update);

routes.get('/recipient', RecipientController.index);

routes.get('/recipient/:recipientId', RecipientController.show);

routes.post('/recipient', RecipientController.store);

routes.put('/recipient/:recipientId', RecipientController.update);

routes.delete('/recipient/:recipientId', RecipientController.delete);

routes.post('/photos', upload.single('photos'), PhotosController.store);

routes.get('/deliverymans', DeliverymansController.index);

routes.get('/deliverymans/:deliveryId', DeliverymansController.show);

routes.post('/deliverymans', DeliverymansController.store);

routes.put('/deliverymans/:deliveryId', DeliverymansController.update);

routes.delete('/deliverymans/:deliveryId', DeliverymansController.delete);

routes.get('/order-management', OrderManagementController.index);

routes.get(
  '/order-management/:orderManagementId',
  OrderManagementController.show
);

routes.post('/order-management', OrderManagementController.store);

routes.put(
  '/order-management/:orderManagementId',
  OrderManagementController.update
);

routes.delete(
  '/order-management/:orderManagementId',
  OrderManagementController.delete
);

export default routes;
