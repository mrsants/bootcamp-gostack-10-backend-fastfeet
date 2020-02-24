
class OrderDeliveryController {
  /**
   * @method show
   * @param {*} req
   * @param {*} res
   * @returns {Array}  list
   * @description Método responsável por listar as encomendas por entregador.
   */
  async show(req, res) {
    console.log(req.params)
  }

  /**
   * @method update
   * @param {*} req
   * @param {*} res
   * @returns {Object}  orders
   * @description Método responsável por criar as encomendas.
   */
  async update(req, res) {}
}

export default new OrderDeliveryController();
