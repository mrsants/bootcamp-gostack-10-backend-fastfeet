/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/**
 * @module RecipientController
 */

import { Op } from 'sequelize';
import { isNullOrUndefined } from 'util';
import * as Yup from 'yup';
import Recipients from '../models/Recipients';

/** RecipientController é responsável pelo controle dos destinários. */
class RecipientController {
  /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Array} listRecipient
   * @description Método responsável por retorna uma lista de destinários
   */
  async index(req, res) {
    const { name, page = 1 } = req.query;

    const recipients = await Recipients.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      attributes: [
        'id',
        'name',
        'street',
        'number',
        'complement',
        'state',
        'city',
        'zip_code',
      ],
      order: [['created_at', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(recipients);
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
      name: Yup.string(),
      street: Yup.string().required(),
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
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipients.create(req.body);

    return res.status(201).json({
      name,
      street,
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
      name: Yup.string(),
      street: Yup.string(),
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
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.status(200).json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
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
      message: 'Recipient successfully deleted',
    });
  }
}

export default new RecipientController();
