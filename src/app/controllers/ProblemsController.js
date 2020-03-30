import { format, startOfHour } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import CancelJobs from '../jobs/CancelJobs';
import Deliverymans from '../models/Deliverymans';
import OrderManagements from '../models/OrderManagements';
import Problems from '../models/Problems';
import Recipients from '../models/Recipients';

class ProblemsController {
  /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar os problemas das encomendas.
   */

  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveryPromblens = await Problems.findAll({
      attributes: ['id', 'description'],
      order: [['created_at', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: OrderManagements,
          as: 'order_managements',
          attributes: ['id', 'product'],
          include: [
            {
              model: Deliverymans,
              as: 'deliverymans',
              attributes: ['id', 'name'],
            },
            {
              model: Recipients,
              as: 'recipients',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'complement',
                'state',
                'city',
                'zip_code',
              ],
            },
          ],
        },
      ],
    });

    return res.json(deliveryPromblens);
  }

  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar os problemas das encomendas por id.
   */
  async show(req, res) {
    const { id } = req.params;

    const problem = await Problems.findOne({
      where: { order_managements_id: id },
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

    const { id } = req.params;
    const delivery = await OrderManagements.findByPk(id);

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery not found',
      });
    }

    const { description } = req.body;

    const deliveryProblem = await Problems.create({
      description,
      order_managements_id: id,
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
    const { id } = req.params;

    const problem = await Problems.findByPk(id, {
      attributes: ['id', 'description', 'order_managements_id'],
    });

    if (!problem) {
      return res.status(400).json({ error: 'Problem not found' });
    }

    // eslint-disable-next-line camelcase
    const { order_managements_id } = problem;

    const orderManagement = await OrderManagements.findByPk(
      order_managements_id,
      {
        attributes: ['id', 'product', 'canceled_at'],
        include: [
          {
            model: Recipients,
            as: 'recipients',
            attributes: [
              'street',
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
      },
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

export default new ProblemsController();
