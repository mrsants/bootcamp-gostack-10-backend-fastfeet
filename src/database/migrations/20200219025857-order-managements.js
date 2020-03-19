module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('order_managements', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    canceled_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('order_managements'),
};
