
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('order_managements', 'signature_id', {
    type: Sequelize.INTEGER,
    reference: { model: 'photos', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: true,
  }),

  down: (queryInterface) => queryInterface.removeColumn('order_managements', 'signature_id  '),
};
