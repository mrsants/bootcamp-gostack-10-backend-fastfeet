'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('order_management', 'deliveryman_id', {
      type: Sequelize.INTEGER,
      reference: { model: 'deliveryman_id', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('order_management', 'deliveryman_id  ');
  },
};
