
exports.up = async function(knex) {
  await knex.schema.createTable("zoos", (table) => {
    table.increments("id")
    table.text("name").notNull()
    table.text("address").notNull().unique()
  })

  await knex.schema.createTable("species", (table) => {
    table.increments("id")
    table.text("name").notNull().unique()
  })

  await knex.schema.createTable("animals", (table) => {
    table.increments("id")
    table.text("name").notNull().unique()
    table.integer("species_id")
      .references("id")
      .inTable("species")
      .onDelete("SET NULL")
      .onUpdate("CASCADE")
  })

  await knex.schema.createTable("zoos_animals", (table) => {
    table.integer("zoo_id")
      .references("id")
      .inTable("zoos")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
    table.integer("animal_id")
      .references("id")
      .inTable("animals")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
    // knex.raw will pass `current_timestamp` without quotes, meaning it's 
    // an internal SQL variable and not a literal string
    table.date("from_date").defaultTo(knex.raw("current_timestamp"))
    table.date("to_date")
    // sincs this table doesn't need an ID column, we can make the 
    // primary key a combination of two column tather than a single column
    table.primary(["zoo_id", "animal_id"])
  })
}

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("zoos_animals")
  await knex.schema.dropTableIfExists("animals")
  await knex.schema.dropTableIfExists("species")
  await knex.schema.dropTableIfExists("zoos")
}
