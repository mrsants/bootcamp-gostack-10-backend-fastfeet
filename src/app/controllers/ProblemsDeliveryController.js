import * as Yup from 'yup';
// import { startOfHour, format } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import OrderManagement from '../models/OrderManagements';
// import Recipient from '../models/Recipient';
// import Deliverymans from '../models/Deliverymans';
import ProblemDeliverys from '../models/ProblemDeliverys';
import OrderManagements from '../models/OrderManagements';
// import CancelDelivery from '../jobs/CancelDelivery';
// import Queue from '../../lib/Queue';

class ProblemsDeliveryController {
  async index(req, res) {
    const deliveriesWithProblems = await ProblemDeliverys.findAll({
      attributes: ['id', 'description'],
      include: [
        {
          model: OrderManagements,
          as: 'order_managements',
          attributes: ['id', 'product', 'start_date', 'canceled_at'],
        },
      ],
    });

    return res.json(deliveriesWithProblems);
  }

  // async show(req, res) {
  //   const { deliveryId } = req.params;

  //   const deliveryWithProblems = await DeliveryProblem.findOne({
  //     where: { delivery_id: deliveryId },
  //     attributes: ['id', 'description'],
  //     include: [
  //       {
  //         model: Delivery,
  //         as: 'delivery',
  //         attributes: ['id', 'product', 'start_date', 'canceled_at'],
  //       },
  //     ],
  //   });

  //   if (!deliveryWithProblems) {
  //     return res
  //       .status(400)
  //       .json({ error: 'This delivery does not have problems' });
  //   }

  //   return res.json(deliveryWithProblems);
  // }

  // async store(req, res) {
  //   const schema = Yup.object().shape({
  //     description: Yup.string().required(),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({
  //       error: 'Description is required',
  //     });
  //   }

  //   const { deliveryId } = req.params;
  //   const delivery = await Delivery.findByPk(deliveryId);

  //   if (!delivery) {
  //     return res.status(400).json({
  //       error: 'Delivery not found',
  //     });
  //   }

  //   const { description } = req.body;

  //   const deliveryProblem = await DeliveryProblem.create({
  //     description,
  //     delivery_id: deliveryId,
  //   });

  //   return res.json(deliveryProblem);
  // }

  // async delete(req, res) {
  //   const { problemId } = req.params;

  //   const problem = await DeliveryProblem.findByPk(problemId, {
  //     attributes: ['id', 'description', 'delivery_id'],
  //   });

  //   if (!problem) {
  //     return res.status(400).json({ error: 'Problem not found' });
  //   }

  //   const { delivery_id } = problem;

  //   const delivery = await OrderManagement.findByPk(delivery_id, {
  //     attributes: ['id', 'product', 'canceled_at'],
  //     include: [
  //       {
  //         model: Recipient,
  //         as: 'recipient',
  //         attributes: ['id', 'name', 'cep', 'number', 'complement'],
  //       },
  //       {
  //         model: Deliveryman,
  //         as: 'deliveryman',
  //         attributes: ['id', 'name', 'email'],
  //       },
  //     ],
  //   });
  //   if (delivery.canceled_at) {
  //     return res
  //       .status(401)
  //       .json({ error: 'This delivery is already canceled' });
  //   }
  //   const now = new Date();
  //   const hourStart = startOfHour(now);
  //   const formattedDate = format(hourStart, "yyyy-MM-dd'T'HH:mm:ssxxx", {
  //     locale: pt,
  //   });

  //   const updatedDelivery = await delivery.update({
  //     canceled_at: formattedDate,
  //   });

  //   await Queue.add(CancelDelivery.key, {
  //     updatedDelivery,
  //     problem,
  //   });

  //   return res.json(updatedDelivery);
  // }
}

export default new ProblemsDeliveryController();
