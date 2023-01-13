const knex = require("../db/connection");

async function create(newReservation) {
  return await knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function list(queryParams) {
  const value = Object.values(queryParams)[0];
  let key = Object.keys(queryParams)[0];
  if (key === "date") {
    key = "reservation_date";
  }
  if (key === "mobile_number") {
    return await knex("reservations")
      .select("*")
      .where(key, "ilike", `${value}%`)
      .orderBy("reservation_time");
  } else {
    return await knex("reservations")
      .select("*")
      .where(key, value)
      .orderBy("reservation_time");
  }
}

async function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

async function update(updateReservation) {
  return await knex("reservations")
    .select("*")
    .where({ reservation_id: updateReservation.reservation_id })
    .update(updateReservation, "*");
}

module.exports = {
  create,
  list,
  read,
  update,
};
