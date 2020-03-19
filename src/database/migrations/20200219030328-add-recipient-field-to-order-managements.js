
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('order_managements', 'recipient_id', {
    type: Sequelize.INTEGER,
    reference: { model: 'recipients', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: true,
  }),

  down: (queryInterface) => queryInterface.removeColumn('order_managements', 'recipient_id  '),
};
