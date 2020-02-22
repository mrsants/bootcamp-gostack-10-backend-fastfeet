import * as Yup from 'yup';
import OrderManagement from '../models/OrderManagement';

class OrderManagementController {
  /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas.
   */
  async index() {}

  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas.
   */
  async show() {}

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
  async update() {}

  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por deletar as encomendas.
   */
  async delete() {}
}

export default new OrderManagementController();
