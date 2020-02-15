/**
 * @module SessionController
 */
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/authConfig';
import * as Yup from 'yup';

/** SessionController é responsável por adminstrar a sessoes do usuário */
class SessionController {
   /**
   * @method index
   * @param {*} req
   * @param {*} res
   * @returns {Array} listRecipient  
   * @description Método responsável por criar um token JWT
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.authSecret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
