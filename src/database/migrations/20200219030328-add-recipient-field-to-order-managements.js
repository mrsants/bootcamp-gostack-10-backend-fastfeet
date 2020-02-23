'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('order_managements', 'recipient_id', {
      type: Sequelize.INTEGER,
      reference: { model: 'recipients', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('order_managements', 'recipient_id  ');
  },
};
