/**
 * @module RecipientController
 */

import * as Yup from 'yup';
import Recipients from '../models/Recipients';
import { isNullOrUndefined } from 'util';

/** RecipientController é responsável pelo controle dos destinários. */
class RecipientController {
  /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Array} listRecipient
   * @description Método responsável por retorna uma lista de destinários
   */
  async index(_, res) {
    const listRecipient = await Recipients.findAll();
    return res.status(200).json(listRecipient);
  }

  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Object} listRecipient
   * @description Método responsável por retorna uma lista de destinários por id.
   */
  async show(req, res) {
    const { recipientId } = req.params;

    const recipient = await Recipients.findByPk(recipientId);

    if (isNullOrUndefined(recipient)) {
      return res.status(401).json({
        error: {
          message: 'Recipient not exists!',
          statusCode: 401,
        },
      });
    }

    return res.status(201).json({
      recipient,
    });
  }

  /**
   * Método responsável por criar um destinário.
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Object} listRecipient
   * @description Método responsável por criar um destinário.
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      street: Yup.string().required(),
      district: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: {
          message: 'Validation fails',
          statusCode: 401,
        },
      });
    }

    const {
      street,
      district,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipients.create(req.body);

    return res.status(201).json({
      street,
      district,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object} listRecipient
   * @description Método responsável por atualizar um destinário por id.
   */
  async update(req, res) {
    const { recipientId } = req.params;

    const schema = Yup.object().shape({
      street: Yup.string(),
      district: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: {
          message: 'Validation fails',
          statusCode: 401,
        },
      });
    }

    const recipient = await Recipients.findByPk(recipientId);

    if (isNullOrUndefined(recipient)) {
      return res.status(401).json({
        error: {
          message: 'Recipient not exists!',
          statusCode: 401,
        },
      });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await recipient.update(req.body);

    return res.status(200).json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  /**
   * @method delete
   * @param {*} req
   * @param {*} res
   * @returns {Object} listRecipient
   * @description Método responsável por deletar um destinário por id.
   */
  async delete(req, res) {
    const { recipientId } = req.params;

    const recipient = await Recipients.findByPk(recipientId);

    if (isNullOrUndefined(recipient)) {
      return res.status(401).json({
        error: {
          message: 'Recipient not found',
          statusCode: 401,
        },
      });
    }

    await Recipients.destroy({
      where: {
        id: recipientId,
      },
    });

    return res.status(200).json({
      message: `Recipient successfully deleted`,
    });
  }
}

export default new RecipientController();
