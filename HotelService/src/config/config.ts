import { dbConfig } from "./index";

const config = {
  development: {
    host : dbConfig.DB_HOST,
    user : dbConfig.DB_USER,
    password : dbConfig.DB_PASSWORD,
    database : dbConfig.DB_NAME,
    port: dbConfig.DB_PORT,
    dialect: 'mysql',
  },
}
export default config;