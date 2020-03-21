/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
/**
 * @module DeliverymanController
 */

import { Op } from 'sequelize';
import { isNullOrUndefined } from 'util';
import * as Yup from 'yup';
import Deliverymans from '../models/Deliverymans';
import Photos from '../models/Photos';
/** DeliverymanController é responsável pelo controle de entregadores. */
class DeliverymanController {
  /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar entregadores.
   */
  async index(req, res) {
    const { name, page = 1 } = req.query;

    const deliverymans = await Deliverymans.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      order: [['created_at']],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: Photos,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
          required: true,
        },
      ],
    });

    return res.json(deliverymans);
  }

  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar um entregador por id.
   */
  async show(req, res) {
    const { deliveryId } = req.params;

    const delivery = await Deliverymans.findByPk(deliveryId, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: Photos,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
          required: true,
        },
      ],
    });

    if (isNullOrUndefined(delivery)) {
      return res.status(401).json({
        error: {
          message: 'Delivery not found',
          statusCode: 401,
        },
      });
    }

    return res.status(200).json(delivery);
  }

  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por cadastrar um entregador.
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: {
          message: 'Validations fails',
          statusCode: 401,
        },
      });
    }

    const { id, name, email } = await Deliverymans.create(req.body);

    return res.status(200).json({
      id,
      name,
      email,
    });
  }

  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por atualizar entregadores.
   */
  async update(req, res) {
    const { deliverymanId } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const emailExists = await Deliverymans.findOne({
      where: { email: req.body.email },
    });

    if (emailExists) {
      return res.status(401).json({
        error: 'E-mail already exists',
      });
    }

    const deliveryman = await Deliverymans.findByPk(deliverymanId);

    if (isNullOrUndefined(deliveryman)) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { name, email, avatar_id } = await deliveryman.update(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por atualizar entregadores.
   */

  async delete(req, res) {
    const { deliverymanId } = req.params;

    const deliveryman = await Deliverymans.findByPk(deliverymanId);

    if (!deliveryman) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();

    return res.json({ msg: 'Deleted with success' });
  }
}

export default new DeliverymanController();
