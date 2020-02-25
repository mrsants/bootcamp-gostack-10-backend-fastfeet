/**
 * @module SessionController
 */
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/authConfig';
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
      return res.status(401).json({
        error: {
          message: 'Validation fails',
          statusCode: 401,
        },
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'User not found',
          statusCode: 401,
        },
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: {
          message: 'Password does not match',
          statusCode: 401,
        },
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
