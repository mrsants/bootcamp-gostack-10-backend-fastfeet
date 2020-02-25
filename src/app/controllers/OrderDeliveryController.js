import { format, startOfHour } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import { isNullOrUndefined } from 'util';
import Deliverymans from '../models/Deliverymans';
import OrderManagements from '../models/OrderManagements';
import Photos from '../models/Photos';
import Recipient from '../models/Recipient';

class OrderDeliveryController {
  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas por entregador.
   */
  async index(req, res) {
    const { orderDeliveryId } = req.params;

    const deliverymans = await Deliverymans.findByPk(orderDeliveryId);

    if (isNullOrUndefined(deliverymans)) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    const deliveried = await OrderManagements.findAll({
      where: {
        deliveryman_id: orderDeliveryId,
        end_date: { [Op.not]: null },
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
        {
          model: Photos,
          as: 'signatures',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    if (deliveried.length === 0) {
      res
        .status(400)
        .json({ error: 'You did not deliveried any deliveries yet' });
    }

    return res.json(deliveried);
  }

  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object}  orders
   * @description Método responsável por criar as encomendas.
   */
  async update(req, res) {
    const { deliveryId, orderDeliveryId } = req.params;
    const { signature_id } = req.body;

    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: {
          message: 'Signature is not required',
          statusCode: 401,
        },
      });
    }

    const deliverymans = await Deliverymans.findByPk(deliveryId);

    if (isNullOrUndefined(deliverymans)) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    const OrderManagements = await OrderManagements.findByPk(orderDeliveryId);

    if (isNullOrUndefined(OrderManagements)) {
      return res.status(401).json({ error: 'Order delivery not found' });
    }

    if (OrderManagements.deliveryman_id !== Number(deliveryId)) {
      return res.status(401).json({
        error: {
          message: 'You can only edit deliveries that you own',
          statusCode: 401,
        },
      });
    }

    if (!OrderManagements.start_date) {
      return res.status(401).json({
        error: {
          message: 'You did not withdraw this delivery yet',
          statusCode: 401,
        },
      });
    }

    if (OrderManagements.end_date) {
      return res.status(401).json({
        error: {
          message: 'You have already finished this delivery',
          statusCode: 401,
        },
      });
    }

    const now = new Date();

    const hourStart = startOfHour(now);

    const formattedDate = format(hourStart, "yyyy-MM-dd'T'HH:mm:ssxxx", {
      locale: pt,
    });

    const { id, product, start_date, end_date } = await OrderManagements.update({
      end_date: formattedDate,
      signature_id,
    });

    return res.status(200).json({
      id,
      product,
      start_date,
      end_date,
    });
  }
}

export default new OrderDeliveryController();
