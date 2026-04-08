/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "password123",
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
