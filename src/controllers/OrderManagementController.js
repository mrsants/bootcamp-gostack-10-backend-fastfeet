import { isNullOrUndefined } from 'util';
import * as Yup from 'yup';
import Deliverymans from '../models/Deliverymans';
import OrderManagement from '../models/OrderManagement';
import Photos from '../models/Photos';
import Recipient from '../models/Recipient';

class OrderManagementController {
  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas por entregador.
   */
  async show(req, res) {
    const { orderManagementId } = req.params;

    const orderManagement = await OrderManagement.findOne({
      where: { id: orderManagementId },
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
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
          attributes: ['name', 'email'],
          include: [
            {
              model: Photos,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: Photos,
          as: 'signatures',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (isNullOrUndefined(orderManagement)) {
      return res.status(400).json({
        error: {
          message: 'Order not found',
        },
      });
    }

    return res.status(200).json(orderManagement);
  }

  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas.
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: {
          message: 'Validations fails',
          statusCode: 401,
        },
      });
    }

    const { product, recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (isNullOrUndefined(recipient)) {
      return res.status(401).json({
        error: {
          message: 'Recipient not exists',
          statusCode: 401,
        },
      });
    }

    const deliveryman = await Deliverymans.findByPk(deliveryman_id);

    if (isNullOrUndefined(deliveryman)) {
      return res.status(401).json({
        error: {
          message: 'Deliverymans not exists',
          statusCode: 401,
        },
      });
    }

    const orderCreated = await OrderManagement.create({
      product,
      recipient_id,
      deliveryman_id,
    });

    return res.status(201).json(orderCreated);
  }

  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object}  orders
   * @description Método responsável por criar as encomendas.
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: {
          message: 'Validations fails',
          statusCode: 401,
        },
      });
    }

    const {
      product,
      recipient_id,
      deliveryman_id,
      signature_id,
      canceled_at,
      start_date,
      end_date,
    } = OrderManagement.update(req.body);

    return res.status(201).json({
      product,
      recipient_id,
      deliveryman_id,
      signature_id,
      canceled_at,
      start_date,
      end_date,
    });
  }

  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por deletar as encomendas.
   */
  async delete() {
    const { orderManagementId } = req.params;

    const orderManagement = await OrderManagement.findByPk(orderManagementId);

    if (isNullOrUndefined(orderManagement)) {
      return res.status(400).json({
        error: {
          message: 'Order not exists',
        },
      });
    }

    await OrderManagement.destroy({ where: orderManagementId });

    return res.status(200).json(orderManagement);
  }
}

export default new OrderManagementController();
