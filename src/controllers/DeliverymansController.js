/**
 * @module DeliverymanController
 */


import * as Yup from 'yup';
import { isNullOrUndefined } from 'util';
import Deliverymans from '../models/Deliverymans';
import Photos from '../models/Photos';

class DeliverymanController {
  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Object} listDelivery
   * @description Método responsável por listar entregadores.
   */
  async index(req, res) {
    const { page = 1 } = req.query;
    
    const deliverymans = await Deliverymans.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: Photos,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
          required: true
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

    const delivery = await Deliverymans.findByPk(deliveryId);

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
      email: Yup.string().required(),
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

  async update() {}

  async delete() {}
}

export default new DeliverymanController();
