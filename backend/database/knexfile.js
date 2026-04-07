/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "datenbank",
      database: "matchmap",
    },
    migrations: {
      directory: "./migrations/migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
