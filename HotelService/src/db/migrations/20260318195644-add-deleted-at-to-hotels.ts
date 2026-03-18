"use strict";

import { DataTypes } from "sequelize";
import { QueryInterface } from "sequelize/types/dialects/abstract/query-interface";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("hotels", "deletedAt", {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("hotels", "deletedAt");
    // Note: In a real application, you might want to handle the data in the "deletedAt" column before removing it, such as archiving or logging the deleted records.
  },
};
