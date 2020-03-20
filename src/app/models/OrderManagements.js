import Sequelize, { Model } from 'sequelize';

class OrderManagements extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return !this.start_date;
          },
        },
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            let status = 'PENDENTE';

            if (this.canceled_at) {
              status = 'CANCELADA';
            }

            if (!this.canceled_at && this.start_date) {
              if (this.end_date) {
                status = 'ENTREGUE';
              } else {
                status = 'RETIRADA';
              }
            }

            return status;
          },
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Photos, {
      foreignKey: 'signature_id',
      as: 'signatures',
    });

    this.belongsTo(models.Recipients, {
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
