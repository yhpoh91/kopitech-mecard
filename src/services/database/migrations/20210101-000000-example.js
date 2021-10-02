module.exports = {
  up: (queryInterface, Sequelize) => {
    const createExamplesTable = () => queryInterface.createTable('Examples', {
      id: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      deleted: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    return Promise.resolve()
      .then(createExamplesTable);
  },
  down: (queryInterface) => {
    const dropExamplesTable = () => queryInterface.dropTable('Examples');
    return Promise.resolve()
      .then(dropExamplesTable);
  },
};