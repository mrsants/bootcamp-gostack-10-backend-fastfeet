/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import { isNullOrUndefined } from 'util';
import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import NewJobs from '../jobs/NewJobs';
import Deliverymans from '../models/Deliverymans';
import OrderManagements from '../models/OrderManagements';
import Photos from '../models/Photos';
import Recipients from '../models/Recipients';

class OrderManagementsController {
  /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar entregadores.
   */
  async index(req, res) {
    const { product, page = 1 } = req.query;

    const deliverymans = await OrderManagements.findAll({
      where: {
        product: {
          [Op.iLike]: `%${product}%`,
        },
      },
      order: [['created_at']],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'canceled_at',
        'cancelable',
        'status',
      ],
      include: [
        {
          model: Recipients,
          as: 'recipients',
          attributes: [
            'name',
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

    return res.json(deliverymans);
  }

  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas por entregador.
   */
  async show(req, res) {
    const { id } = req.params;

    const orderManagements = await OrderManagements.findOne({
      where: { id },
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'canceled_at',
        'cancelable',
        'status',
      ],
      include: [
        {
          model: Recipients,
          as: 'recipients',
          attributes: [
            'name',
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

    if (isNullOrUndefined(orderManagements)) {
      return res.status(400).json({
        error: {
          message: 'Order not found',
        },
      });
    }

    return res.status(200).json(orderManagements);
  }

  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  0
   * @description Método responsável por criar as encomendas.
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

    const recipient = await Recipients.findByPk(recipient_id);

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

    const { id } = await OrderManagements.create({
      product,
      recipient_id,
      deliveryman_id,
    });

    const delivery = await OrderManagements.findByPk(id, {
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      include: [
        {
          model: Recipients,
          as: 'recipients',
          attributes: [
            'name',
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
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(NewJobs.key, {
      delivery,
    });

    return res.status(201).json(delivery);
  }

  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object}  orders
   * @description Método responsável por atualizar as encomendas.
   */
  async update(req, res) {
    const { id } = req.params;

    const { recipient_id, deliveryman_id } = req.body;

    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    try {
      await schema.validate(req.body);

      const order = await OrderManagements.findByPk(id);

      if (!order) {
        return res.status(401).json({ error: 'Order cannot exists.' });
      }

      const recipientExists = await Recipients.findByPk(recipient_id);
      const deliverymanExists = await Deliverymans.findByPk(deliveryman_id);

      if (isNullOrUndefined(recipientExists)) {
        return res.status(401).json({
          error: {
            message: 'Recipient cannot exists.',
            statusCode: 401,
          },
        });
      }

      if (isNullOrUndefined(deliverymanExists)) {
        return res.status(401).json({
          error: {
            message: 'Deliveryman cannot exists.',
            statusCode: 401,
          },
        });
      }

      if (order.start_date && order.deliveryman_id !== deliveryman_id) {
        return res.status(401).json({
          error:
            'The order has left for delivery, you cannot change the delivery man',
        });
      }

      order.canceled_at = null;

      await order.save();

      await order.update(req.body);

      return res.json(order);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por deletar as encomendas.
   */
  async delete(req, res) {
    const { id } = req.params;
    const order = await OrderManagements.findByPk(id);

    if (isNullOrUndefined(order)) {
      return res.status(400).json({
        error: {
          message: 'Order not exists',
        },
      });
    }

    order.canceled_at = new Date();

    await order.save();

    return res.status(200).json(order);
  }
}

export default new OrderManagementsController();
