require("ts-node/register");

const { dbConfig } = require("./index.ts");
module.exports = {
  development: {
    username: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    host: dbConfig.DB_HOST,
    port: dbConfig.DB_PORT,
    dialect: "mysql",
  },
};

