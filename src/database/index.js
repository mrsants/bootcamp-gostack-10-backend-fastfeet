import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Deliverymans from '../app/models/Deliverymans';
import Photos from '../app/models/Photos';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import OrderManagements from '../app/models/OrderManagements';
import ProblemDeliverys from '../app/models/ProblemDeliverys';

const models = [
  User,
  Recipient,
  Photos,
  Deliverymans,
  OrderManagements,
  ProblemDeliverys,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => {
        if (model && model.associate) {
          model.associate && model.associate(this.connection.models);
        }
      });
  }
}

export default new Database();
