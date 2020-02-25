/**
 * @module UserController
 */
import * as Yup from 'yup';
import User from '../models/User';

/** RecipientController é responsável pelo controle dos usuários. */
class UserController {
  /**
   * @method store
   * @param {*} req
   * @param {*} res
   * @returns {Object} { id, name, email }
   * @description Método responsável por criar um usuário.
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: {
          message: 'Validation fails',
          statusCode: 401,
        },
      });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({
        error: {
          message: 'User already exists',
          statusCode: 400,
        },
      });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }
  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object} { id, name, email }
   * @description Método responsável por atualizar as informações do usuário
   */

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, filed) =>
        password ? filed.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: {
          message: 'Validation fails',
          statusCode: 401,
        },
      });
    }

    const { email, oldPassword } = req.body;

    const userOnDb = await User.findByPk(req.userId);

    if (email && email !== userOnDb.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({
          error: {
            message: 'User already exists',
            statusCode: 400,
          },
        });
      }
    }

    if (oldPassword && !(await userOnDb.checkPassword(oldPassword))) {
      return res.status(400).json({
        error: {
          message: 'Password does not match',
          statusCode: 400,
        },
      });
    }

    const { id, name } = await userOnDb.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
