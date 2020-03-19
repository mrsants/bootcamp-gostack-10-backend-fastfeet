module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'problems_deliverys',
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
    'problems_deliverys',
    'order_managements_id  ',
  ),
};
