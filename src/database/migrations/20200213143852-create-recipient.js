'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'recipient',
      {
        id: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      {
        street: Sequelize.STRING,
        allowNull: false,
      },
      {
        number: Sequelize.STRING,
        allowNull: false,
      },
      {
        complement: Sequelize.STRING,
        allowNull: false,
      },
      {
        state: Sequelize.STRING,
        allowNull: false,
      },
      {
        city: Sequelize.STRING,
        allowNull: false,
      },
      {
        zip_code: Sequelize.STRING,
        allowNull: false,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('recipient');
  },
};
