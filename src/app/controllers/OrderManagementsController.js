/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
import { isNullOrUndefined } from 'util';
import * as Yup from 'yup';
import Deliverymans from '../models/Deliverymans';
import OrderManagements from '../models/OrderManagements';
import Photos from '../models/Photos';
import Recipients from '../models/Recipients';

import NewJobs from '../jobs/NewJobs';
import Queue from '../../lib/Queue';

class OrderManagementsController {
  /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar entregadores.
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliverymans = await OrderManagements.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      order: ['id'],
      include: [
        {
          model: Recipients,
          as: 'recipients',
          attributes: [
            'name',
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
    const { OrderManagementsId } = req.params;

    const OrderManagements = await OrderManagements.findOne({
      where: { id: OrderManagementsId },
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      include: [
        {
          model: Recipients,
          as: 'recipients',
          attributes: [
            'name',
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

    if (isNullOrUndefined(OrderManagements)) {
      return res.status(400).json({
        error: {
          message: 'Order not found',
        },
      });
    }

    return res.status(200).json(OrderManagements);
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
    } = OrderManagements.update(req.body);

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
  async delete(req, res) {
    const id = req.params.orderManagementId;
    const OrderManager = await OrderManagements.findByPk(id);

    if (isNullOrUndefined(OrderManager)) {
      return res.status(400).json({
        error: {
          message: 'Order not exists',
        },
      });
    }

    OrderManager.canceled_at = new Date();

    await OrderManager.save();

    return res.status(200).json(OrderManager);
  }
}

export default new OrderManagementsController();
