'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('order_managements', 'deliveryman_id', {
      type: Sequelize.INTEGER,
      reference: { model: 'deliverymans', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('order_managements', 'deliveryman_id  ');
  },
};
