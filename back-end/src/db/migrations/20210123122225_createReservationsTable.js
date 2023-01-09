exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.string("first_name", 255);
    table.string("last_name", 255);
    table.string("mobile_number");
    table.date("reservation_date");
    table.time("reservation_time");
    table.integer("people");
    table.string("reservation_status", 255);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
