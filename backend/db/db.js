const promise = require('bluebird')

// Initialization Options
const initOption = {
  promiseLib: promise
}

const pgp = require('pg-promise')(initOption)
// const pgp = require('pg-promise')();

const connectionString = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
}

const db = pgp(connectionString)

module.exports = db
