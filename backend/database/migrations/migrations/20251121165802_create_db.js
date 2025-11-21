/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("girls", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("name").notNullable();
      table.integer("age");
      table.string("image_url");
      table.boolean("active").notNullable().defaultTo(true);
    })
    .createTable("boys", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("name").notNullable();
      table.integer("age");
      table.string("image_url");
      table.boolean("active").notNullable().defaultTo(true);
    })
    .createTable("matches", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table
        .uuid("girls_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("girls")
        .onDelete("CASCADE");
      table
        .uuid("boys_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("boys")
        .onDelete("CASCADE");
      table.boolean("is_match").notNullable().defaultTo(false);
      table.integer("week");
      table.unique(["girls_id", "boys_id"]);
    })
    .createTable("matchbox", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table
        .uuid("girls_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("girls")
        .onDelete("CASCADE");
      table
        .uuid("boys_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("boys")
        .onDelete("CASCADE");
      table.boolean("result").notNullable();
    })
    .createTable("matching_nights", table => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.integer("week").notNullable();
        table.integer("beams");
    })
    .createTable()
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
