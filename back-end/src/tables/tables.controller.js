const tablesService = require("./tables.service.js");
const reservationsService = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//validations below

const hasRequiredProperties = hasProperties("table_name", "capacity");

const VALID_PROPERTIES = ["table_name", "capacity"];

async function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function hasData(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: `Invalid field(s)`,
    });
  }
  next();
}

async function hasResId(req, res, next) {
  const resId = req.body.data.reservation_id;
  if (resId) {
    return next();
  }
  next({ status: 400, message: "reservation_id" });
}

async function hasCapacity(req, res, next) {
  const capacity = Number(req.body.data.capacity);
  if (capacity > 0) {
    return next();
  } else {
    return next({ status: 400, message: "capacity must be at least 1 person" });
  }
}
async function capacityNumber(req, res, next) {
  if (typeof req.body.data.capacity === "number") {
    return next();
  } else {
    return next({ status: 400, message: "capacity must be a number" });
  }
}

async function hasNameLength(req, res, next) {
  const name = req.body.data.table_name;
  if (name.length > 1) {
    return next();
  } else {
    return next({
      status: 400,
      message: "table_name must be at least 2 characters",
    });
  }
}

async function tableOccupied(req, res, next) {
  if (res.locals.table.reservation_id) {
    return next();
  }
  return next({ status: 400, message: `Table is not occupied.` });
}

async function hasSufficientCapacity(req, res, next) {
  const reservation = res.locals.reservation;
  const table = res.locals.table;
  if (reservation.people <= table.capacity) {
    return next();
  }
  return next({ status: 400, message: `Table does not have enough capacity.` });
}

async function reservationAlreadySeated(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status === "seated") {
    return next({ status: 400, message: `Reservation already seated.` });
  }
  return next();
}

async function reservationExists(req, res, next) {
  reservationsService
    .read(req.body.data.reservation_id)
    .then((reservation) => {
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
      next({
        status: 404,
        message: `Reservation #${req.body.data.reservation_id} cannot be found.`,
      });
    })
    .catch((e) => {
      return next({
        status: 404,
        message: `Reservation #${req.body.data.reservation_id} cannot be found.`,
      });
    });
}

async function tableResExists(req, res, next) {
  reservationsService
    .read(res.locals.table.reservation_id)
    .then((reservation) => {
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
      return next({
        status: 404,
        message: `Reservation #${res.locals.table.reservation_id} cannot be found.`,
      });
    })
    .catch((e) => {
      return next({
        status: 404,
        message: `Reservation #${res.locals.table.reservation_id} cannot be found.`,
      });
    });
}

async function tableExists(req, res, next) {
  tablesService
    .read(req.params.table_id)
    .then((table) => {
      if (table) {
        res.locals.table = table;
        return next();
      } else {
        return next({
          status: 404,
          message: `Table ${req.params.table_id} cannot be found.`,
        });
      }
    })
    .catch((e) => {
      return next({
        status: 404,
        message: `Table ${req.params.table_id} cannot be found.`,
      });
    });
}

async function tableUnoccupied(req, res, next) {
  if (res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: `Table is occupied`,
    });
  }
  return next();
}

//validations above

async function seatReservation(req, res, next) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  const table = await tablesService.update(updatedTable);
  const updatedTableReservation = {
    ...res.locals.reservation,
    status: "seated",
  };
  await reservationsService.update(updatedTableReservation);
  res.status(200).json({
    data: table,
  });
}

async function create(req, res) {
  const newTable = await tablesService.create(req.body.data);
  res.status(201).json({
    data: newTable,
  });
}

async function list(req, res) {
  const data = await tablesService.list();
  res.json({
    data,
  });
}

async function destroy(req, res, next) {
  const updatedTableReservation = {
    ...res.locals.table,
    reservation_id: null,
  };
  const data = await tablesService.destroy(updatedTableReservation);
  const updatedRes = {
    ...res.locals.reservation,
    status: "finished",
  };
  await reservationsService.update(updatedRes);
  res.json({
    data,
  });
}

module.exports = {
  create: [
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasCapacity,
    capacityNumber,
    hasNameLength,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  update: [
    hasData,
    hasResId,
    reservationExists,
    tableExists,
    tableUnoccupied,
    hasSufficientCapacity,
    reservationAlreadySeated,
    asyncErrorBoundary(seatReservation),
  ],
  destroy: [tableExists, tableOccupied, tableResExists, destroy],
};
