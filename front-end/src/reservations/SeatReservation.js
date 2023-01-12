//When user clicks "seat" on reservation, this page is displayed

import React from "react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, seatTable } from "../utils/api";

function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState();
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    loadTables();
  }, []);

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setSelectedTable(value);
  }

  // testing the submit handler w/ chat
  var e = document.getElementsByName("table_id")[0];

  const handleSubmit = async (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    seatTable(
      e.options[e.selectedIndex].value,
      Number(params.reservation_id),
      abortController.signal
    ).then(() => history.push(`/dashboard`));
    // .catch(setError);
  };

  // async function submitHandler(e) {
  //   e.preventDefault();
  //   const table = await seatTable(selectedTable, params.reservation_id);
  //   console.log("table", table);
  //   if (table) {
  //     history.push(`/dashboard`);
  //   }
  // }

  function cancelHandler() {
    history.goBack();
  }

  const tablesList = tables.map((table) => (
    <option
      key={table.table_id}
      name={table.table_id}
      id={table.table_name}
      value={table.table_id}
    >
      {table.table_name} - {table.capacity}
    </option>
  ));

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor="tables">
        Tables
      </label>
      {/* <select
        className="form-control"
        id="tables"
        name="table_id"
        value={selectedTable}
        onChange={changeHandler}
        required={true}
      >
        {tables.map((table) => {
          return (
            <option
              key={table.table_id}
              value={table.table_id}
            >{`${table.table_name} - ${table.capacity}`}</option>
          );
        })}
      </select>
      <button
        type="button"
        className="btn btn-secondary mr-2"
        onClick={cancelHandler}
      >
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" onClick={submitHandler}>
        Submit
      </button> */}
      <form onSubmit={handleSubmit}>
        <select name="table_id" required={true}>
          <option key="default-tbl-key" defaultValue value="">
            Table Number - Capacity Amount
          </option>
          {tablesList}
        </select>
        <button type="submit">Submit</button>
        <button type="button" onClick={cancelHandler}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SeatReservation;
