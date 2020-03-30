/* eslint-disable no-unused-expressions */
import Sequelize from 'sequelize';
import Deliverymans from '../app/models/Deliverymans';
import OrderManagements from '../app/models/OrderManagements';
import Photos from '../app/models/Photos';
import Problems from '../app/models/Problems';
import Recipients from '../app/models/Recipients';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [
  User,
  Recipients,
  Photos,
  Deliverymans,
  OrderManagements,
  Problems,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      // eslint-disable-next-line array-callback-return
      .map((model) => {
        if (model && model.associate) {
          model.associate && model.associate(this.connection.models);
        }
      });
  }
}

export default new Database();
