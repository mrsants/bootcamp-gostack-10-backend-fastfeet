import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Deliverymans from '../models/Deliverymans';
import Photos from '../models/Photos';
import Recipient from '../models/Recipient';
import User from '../models/User';

const models = [User, Recipient, Photos, Deliverymans];

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
