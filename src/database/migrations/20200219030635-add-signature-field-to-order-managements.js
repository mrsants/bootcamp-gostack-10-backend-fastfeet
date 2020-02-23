'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('order_managements', 'signature_id', {
      type: Sequelize.INTEGER,
      reference: { model: 'photos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('order_managements', 'signature_id  ');
  },
};
