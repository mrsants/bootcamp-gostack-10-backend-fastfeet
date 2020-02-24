import { endOfDay, format, startOfDay, startOfHour } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import { isNullOrUndefined } from 'util';
import Deliverymans from '../models/Deliverymans';
import OrderManagement from '../models/OrderManagement';
import Recipient from '../models/Recipient';

class ScheduleController {
  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas por entregador.
   */
  async index(req, res) {
    const { deliverymanId } = req.params;

    const deliverymans = await Deliverymans.findByPk(deliverymanId);

    if (isNullOrUndefined(deliverymans)) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    const deliveries = await OrderManagement.findAll({
      where: {
        deliveryman_id: deliverymanId,
        end_date: null,
        start_date: null,
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
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
    const { deliverymanId, orderDeliverId } = req.params;

    const deliverymans = await Deliverymans.findByPk(deliverymanId);

    if (isNullOrUndefined(deliverymans)) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    const orderManagement = await OrderManagement.findByPk(orderDeliverId);

    if (isNullOrUndefined(orderManagement)) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    if (orderManagement.deliveryman_id !== Number(orderDeliverId)) {
      return res.status(401).json({
        error: {
          message: 'You can only edit deliveries that you own',
          statusCode: 401,
        },
      });
    }

    if (orderManagement.start_date) {
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

    const orderWithdrawal = await OrderManagement.findAndCountAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(now.getTime(), endOfDay(now.getTime))],
        },
        deliveryman_id: deliveryId,
      },
    });

    if (orderWithdrawal.count > 4) {
      return res.status(401).json({
        error: {
          message: 'You can withdraw 5 shipments per day',
        },
      });
    }

    const { id, product, start_date, end_date } = await orderManagement.update({
      start_date: formattedDate,
    });

    return res.status(200).json({
      id,
      product,
      start_date,
      end_date,
    });
  }
}

export default new ScheduleController();
