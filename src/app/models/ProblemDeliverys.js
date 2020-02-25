import Sequelize, { Model } from 'sequelize';

class ProblemDeliverys extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.OrderManagements, {
      foreignKey: 'order_managements_id',
      as: 'order_managements',
    });
  }
}

export default ProblemDeliverys;
