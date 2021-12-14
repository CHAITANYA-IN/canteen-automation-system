const mysql = require("mysql2");

db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// Session storage options
options = {
  clearExpired: true,
  createDatabaseTable: true,
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
};

module.exports = { db, options };

// const knex = require("knex")({
//   client: "mysql",
//   connection: {
//     host: "127.0.0.1",
//     user: "root",
//     password: "chaitanya",
//     database: "canteen",
//   },
// });

// console.log(knex("customer"));
