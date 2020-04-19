import { format, startOfHour } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import { isNullOrUndefined } from 'util';
import Deliverymans from '../models/Deliverymans';
import OrderManagements from '../models/OrderManagements';
import Photos from '../models/Photos';
import Recipients from '../models/Recipients';

class OrderDeliveryController {
  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas por entregador.
   */
  async index(req, res) {
    const { id } = req.params;

    const deliverymans = await Deliverymans.findByPk(id);

    if (isNullOrUndefined(deliverymans)) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const deliveried = await OrderManagements.findAll({
      where: {
        deliveryman_id: id,
        end_date: { [Op.not]: null },
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipients,
          as: 'recipients',
          attributes: [
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Photos,
          as: 'signatures',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    if (deliveried.length === 0) {
      res
        .status(400)
        .json({ error: 'You did not deliveried any deliveries yet' });
    }

    return res.json(deliveried);
  }

  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object}  orders
   * @description Método responsável por criar as encomendas.
   */
   	async update(req, res) {
		const { idOrder, idDelivery } = req.params;

		const deliveryman = await Deliverymans.findByPk(idDelivery);

		if (!deliveryman) {
			return res.status(400).json({ error: 'Delivery man does not exists' });
		}


		const delivery = await OrderManagements.findOne({
			where: {
				id: idOrder,
				start_date: { [Op.not]: null },
				signature_id: null,
			},
		});

		if (!delivery) {
			return res.status(400).json({ error: 'Delivery does not exists' });
		}

		const { signature_id } = req.body;

		const signatureImage = await Photos.findByPk(signature_id);

		if (!signatureImage) {
			return res.status(400).json({ error: 'Signature image does not exists' });
		}

		await delivery.update({
			end_date: new Date(),
			signature_id,
			status: 'ENTREGUE',
		});

		return res.json({});
	}
}


export default new OrderDeliveryController();
