// When user clicks New Table, this page is displayed.

import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
  const history = useHistory();

  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState(null);

  const handleTableNameChange = (event) => setTableName(event.target.value);
  const handleCapacityChange = (event) =>
    setCapacity(parseInt(event.target.value));

  function cancelHandler() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    const table = {
      table_name: tableName,
      capacity: capacity,
    };
    createTable(table)
      .then(() => {
        history.push("/");
      })
      .catch(setError);
  }

  //This is the form for creating a new table.
  return (
    <>
      <h1>New Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="table_name" className="form-label">
            Table Name
          </label>
          <input
            placeholder="Table Name"
            type="text"
            className="form-control"
            id="table_name"
            name="table_name"
            value={tableName}
            onChange={handleTableNameChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="capacity" className="form-label">
            Capacity
          </label>
          <input
            placeholder="Capacity"
            type="number"
            className="form-control"
            id="capacity"
            name="capacity"
            value={capacity}
            onChange={handleCapacityChange}
          />
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={submitHandler}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default NewTable;
