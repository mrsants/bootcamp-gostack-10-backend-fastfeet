
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('deliverymans', 'avatar_id', {
    type: Sequelize.INTEGER,
    reference: { model: 'photos', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: true,
  }),

  down: (queryInterface) => queryInterface.removeColumn('deliverymans', 'avatar_id'),
};
