import { format, startOfHour } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as Yup from 'yup';
import Deliverymans from '../models/Deliverymans';
import OrderManagements from '../models/OrderManagements';
import ProblemsDeliverys from '../models/ProblemsDeliverys';
import Recipient from '../models/Recipients';

import Queue from '../../lib/Queue';
import CancelJobs from '../jobs/CancelJobs';

class ProblemsDeliveryController {
  /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar os problemas das encomendas.
   */
  async index(req, res) {
    const problem = await ProblemsDeliverys.findAll({
      attributes: ['id', 'description'],
      include: [
        {
          model: OrderManagements,
          as: 'order_managements',
          attributes: ['id', 'product', 'start_date', 'canceled_at'],
        },
      ],
    });

    return res.status(200).json(problem);
  }

  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar os problemas das encomendas por id.
   */
  async show(req, res) {
    const { orderManagementId } = req.params;

    const problem = await ProblemsDeliverys.findOne({
      where: { order_managements_id: orderManagementId },
      attributes: ['id', 'description'],
      include: [
        {
          model: OrderManagements,
          as: 'order_managements',
          attributes: ['id', 'product', 'start_date', 'canceled_at'],
        },
      ],
    });

    if (!problem) {
      return res
        .status(400)
        .json({ error: 'This delivery does not have problems' });
    }

    return res.json(problem);
  }

  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por cadastrar os problemas das encomendas.
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Description is required',
      });
    }

    const { orderManagementId } = req.params;
    const delivery = await OrderManagements.findByPk(orderManagementId);

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery not found',
      });
    }

    const { description } = req.body;

    const deliveryProblem = await ProblemsDeliverys.create({
      description,
      order_managements_id: orderManagementId,
    });

    return res.json(deliveryProblem);
  }

  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por cancelar as encomendas por entregador.
   */

  async delete(req, res) {
    const { problemId } = req.params;

    const problem = await ProblemsDeliverys.findByPk(problemId, {
      attributes: ['id', 'description', 'order_managements_id'],
    });

    if (!problem) {
      return res.status(400).json({ error: 'Problem not found' });
    }

    const { order_managements_id } = problem;

    const orderManagement = await OrderManagements.findByPk(
      order_managements_id,
      {
        attributes: ['id', 'product', 'canceled_at'],
        include: [
          {
            model: Recipient,
            as: 'recipients',
            attributes: [
              'street',
              'district',
              'number',
              'complement',
              'state',
              'city',
              'zip_code',
            ],
          },
          {
            model: Deliverymans,
            as: 'deliverymans',
            attributes: ['id', 'name', 'email'],
          },
        ],
      }
    );

    if (orderManagement.canceled_at) {
      return res
        .status(401)
        .json({ error: 'This delivery is already canceled' });
    }

    const now = new Date();
    const hourStart = startOfHour(now);
    const formattedDate = format(hourStart, "yyyy-MM-dd'T'HH:mm:ssxxx", {
      locale: pt,
    });

    const updatedDelivery = await orderManagement.update({
      canceled_at: formattedDate,
    });

    await Queue.add(CancelJobs.key, {
      updatedDelivery,
      problem,
    });

    return res.json(updatedDelivery);
  }
}

export default new ProblemsDeliveryController();
