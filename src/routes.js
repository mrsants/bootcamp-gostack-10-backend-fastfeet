import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multerConfig';
import DeliverymansController from './app/controllers/DeliverymansController';
import OrderDeliveryController from './app/controllers/OrderDeliveryController';
import OrderManagementsController from './app/controllers/OrderManagementsController';
import PhotosController from './app/controllers/PhotosController';
import ProblemsController from './app/controllers/ProblemsController';
import RecipientsController from './app/controllers/RecipientsController';
import ScheduleController from './app/controllers/ScheduleController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import AuthenticationMiddleware from './app/middlewares/auth';

const routes = Router();

const upload = multer(multerConfig);

routes.get('/deliverymans/:id/deliveries', ScheduleController.index);

routes.put(
  '/deliverymans/:idDeliveryman/deliveries/:idOrder',
  ScheduleController.update,
);

routes.put(
  '/order-delivery/:idOrder/deliverymans/:idDelivery',
  OrderDeliveryController.update,
);

routes.get('/order-delivery/:id/deliverymans', OrderDeliveryController.index);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.post('/deliveries/:id/problems', ProblemsController.store);

routes.use(AuthenticationMiddleware);

routes.put('/users', UserController.update);

routes.get('/recipients', RecipientsController.index);

routes.get('/recipients/:id', RecipientsController.show);

routes.post('/recipients', RecipientsController.store);

routes.put('/recipients/:id', RecipientsController.update);

routes.delete('/recipients/:id', RecipientsController.delete);

routes.post('/photos', upload.single('photos'), PhotosController.store);

routes.get('/deliverymans', DeliverymansController.index);

routes.get('/deliverymans/:id', DeliverymansController.show);

routes.post('/deliverymans', DeliverymansController.store);

routes.put('/deliverymans/:id', DeliverymansController.update);

routes.delete('/deliverymans/:id', DeliverymansController.delete);

routes.get('/order-management', OrderManagementsController.index);

routes.get('/order-management/:id', OrderManagementsController.show);

routes.post('/order-management', OrderManagementsController.store);

routes.put('/order-management/:id', OrderManagementsController.update);

routes.delete('/order-management/:id', OrderManagementsController.delete);

routes.get('/problems', ProblemsController.index);

routes.get('/problems/:id', ProblemsController.show);

routes.delete('/problems/:id', ProblemsController.delete);

export default routes;
