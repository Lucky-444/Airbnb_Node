"use strict";

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("Hotels", "ratings", {
      type: "FLOAT",
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn("Hotels", "rating_count", {
      type: "INTEGER",
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface: QueryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.sequelize.query(
       `ALTER TABLE Hotels
        DROP COLUMN ratings,
        DROP COLUMN rating_count;`,
    );
  },
};
