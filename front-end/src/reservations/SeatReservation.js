//When user clicks "seat" on reservation, this page is displayed

import React from "react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatTable } from "../utils/api";

function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState();
  const [error, setError] = useState(null);
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

  async function submitHandler(e) {
    e.preventDefault();
    const abortController = new AbortController();
    seatTable(
      selectedTable,
      Number(params.reservation_id),
      abortController.signal
    )
      .then(() => history.push(`/dashboard`))
      .catch(setError);
  }

  function cancelHandler() {
    history.goBack();
  }

  return (
    <div className="mb-3">
      <ErrorAlert error={error} />
      <label className="form-label" htmlFor="tables">
        Tables
      </label>
      <select
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
      </button>
    </div>
  );
}

export default SeatReservation;
