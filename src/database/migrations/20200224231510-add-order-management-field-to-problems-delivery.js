module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'problems',
    'order_managements_id',
    {
      type: Sequelize.INTEGER,
      reference: { model: 'order_managements', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'problems',
    'order_managements_id  ',
  ),
};
