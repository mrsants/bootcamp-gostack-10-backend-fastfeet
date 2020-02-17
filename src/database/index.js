import Sequelize from 'sequelize';
import config from '../config/database';
import User from '../models/User';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';

const models = [User, Recipient, Delivery];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(config);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
