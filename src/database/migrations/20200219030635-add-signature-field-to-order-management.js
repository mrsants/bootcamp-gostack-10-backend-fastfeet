'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('order_management', 'signature_id', {
      type: Sequelize.INTEGER,
      reference: { model: 'signature_id', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('order_management', 'signature_id  ');
  },
};
