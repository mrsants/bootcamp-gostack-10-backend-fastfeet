/**
 * @module Delivery
 */

import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        avatar_id: Sequelize.STRING,
        email: Sequelize.STRING
      },
      { sequelize }
    );
  }
}
export default Delivery;
