import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../src/config/multerConfig';
import PhotosController from './app/controllers/PhotosController';
import DeliverymansController from './app/controllers/DeliverymansController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import AuthenticationMiddleware from './app/middlewares/auth';
import OrderManagementsController from './app/controllers/OrderManagementsController';
import OrderDeliveryController from './app/controllers/OrderDeliveryController';
import ScheduleController from './app/controllers/ScheduleController';
import ProblemsDeliveryController from './app/controllers/ProblemsDeliveryController';

const routes = Router();

const upload = multer(multerConfig);

routes.get('/deliverymans/:deliverymanId/deliveries', ScheduleController.index);

routes.put(
  '/deliverymans/:deliverymanId/deliveries/:orderDeliverId',
  ScheduleController.update
);

routes.put(
  '/order-delivery/:orderDeliveryId/deliverymans/:deliveryId',
  OrderDeliveryController.update
);

routes.get(
  '/order-delivery/:orderDeliveryId/deliverymans',
  OrderDeliveryController.index
);

routes.post('/user', UserController.store);

routes.post('/sessions', SessionController.store);

routes.post('/deliveries/:orderManagementId/problems', ProblemsDeliveryController.store);

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

routes.get(
  '/order-management/:orderManagementId',
  OrderManagementsController.show
);

routes.post('/order-management', OrderManagementsController.store);

routes.put(
  '/order-management/:orderManagementId',
  OrderManagementsController.update
);

routes.delete(
  '/order-management/:orderManagementId',
  OrderManagementsController.delete
);

routes.get('/problems', ProblemsDeliveryController.index);

routes.get('/problems/:orderManagementId', ProblemsDeliveryController.show);

routes.delete('/problems/:problemId', ProblemsDeliveryController.delete);

export default routes;
