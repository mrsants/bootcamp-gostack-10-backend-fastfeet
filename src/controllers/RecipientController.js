/**
 * @module RecipientController
 */

import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import User from '../models/User';

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
    const listRecipient = await User.findAll();
    return res.status(200).json(listRecipient);
  }

  /**
   * Método responsável por criar um destinário.
   * @method index
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });
    
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const {
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.status(201).json({
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
