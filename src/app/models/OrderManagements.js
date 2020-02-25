import Sequelize, { Model } from 'sequelize';

class OrderManagements extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Photos, {
      foreignKey: 'signature_id',
      as: 'signatures',
    });

    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipients',
    });

    this.belongsTo(models.Deliverymans, {
      foreignKey: 'deliveryman_id',
      as: 'deliverymans',
    });
  }
}

export default OrderManagements;
