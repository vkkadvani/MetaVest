'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vestings', {

      vestingId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      beneficiary: {
        allowNull: false,
        type: Sequelize.STRING
      },
      locked: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      starttime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      cliff: {
        allowNull: false,
        type: Sequelize.DATE
      },
      slicePeriod: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      endTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      networkId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tokenId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "whitelists",
          key: "whitelistId",
          onDelete: "DO NOTHING",
        }
      },
      amount: {
        allowNull: false,
        type: Sequelize.NUMERIC
      },
      recieveOnInterval: {
        allowNull: false,
        type: Sequelize.NUMERIC
      },
      claimed: {
        allowNull: false,
        type: Sequelize.NUMERIC
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vestings');
  }
};