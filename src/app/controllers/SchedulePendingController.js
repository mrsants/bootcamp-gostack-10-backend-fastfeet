import {
  endOfDay, format, startOfDay, startOfHour,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import { isNullOrUndefined } from 'util';
import Deliverymans from '../models/Deliverymans';
import OrderManagements from '../models/OrderManagements';
import Recipients from '../models/Recipients';

class SchedulePendingController {
  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas por entregador.
   */
  async show(req, res) {
    const { id } = req.params;

    const deliverymans = await Deliverymans.findByPk(id);

    if (isNullOrUndefined(deliverymans)) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    const deliveries = await OrderManagements.findAll({
      where: {
        deliveryman_id: id,
      },
      attributes: ['id', 'product',
        'start_date',
        'end_date',
        'canceled_at',
        'cancelable',
        'status'],
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
      ],
    });

    if (deliveries.length === 0) {
      res.status(400).json({ error: 'No deliveries for this deliveryman' });
    }

    return res.json(deliveries);
  }

  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object}  orders
   * @description
   */
  async update(req, res) {
    const { idDeliveryman, idOrder } = req.params;

    const deliverymans = await Deliverymans.findByPk(idDeliveryman);

    if (isNullOrUndefined(deliverymans)) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    const orderManagements = await OrderManagements.findByPk(idOrder);

    if (isNullOrUndefined(orderManagements)) {
      res.status(400).json({ error: 'Order not found' });
    }

    if (orderManagements.start_date) {
      return res.status(401).json({
        error: {
          message: 'This delivery was already withdrawn',
          statusCode: 401,
        },
      });
    }

    const now = new Date();

    const hourStart = startOfHour(now);

    const formattedDate = format(hourStart, "yyyy-MM-dd'T'HH:mm:ssxxx", {
      locale: pt,
    });

    const orderWithdrawal = await OrderManagements.findAndCountAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(now.getTime(), endOfDay(now.getTime))],
        },
        deliveryman_id: idDeliveryman,
      },
    });

    if (orderWithdrawal.count > 4) {
      return res.status(401).json({
        error: {
          message: 'You can withdraw 5 shipments per day',
        },
      });
    }

    const {
      id, product, start_date, end_date,
    } = await orderManagements.update(
      {
        start_date: formattedDate,
      },
    );

    return res.status(200).json({
      id,
      product,
      start_date,
      end_date,
    });
  }
}

export default new SchedulePendingController();
