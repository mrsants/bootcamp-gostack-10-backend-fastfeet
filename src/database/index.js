import Sequelize from 'sequelize';
import config from '../config/database';
import Recipient from '../models/Recipient';

const models = [Recipient];

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
