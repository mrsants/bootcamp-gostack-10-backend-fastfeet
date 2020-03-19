
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('order_managements', 'deliveryman_id', {
    type: Sequelize.INTEGER,
    reference: { model: 'deliverymans', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: true,
  }),

  down: (queryInterface) => queryInterface.removeColumn('order_managements', 'deliveryman_id  '),
};
