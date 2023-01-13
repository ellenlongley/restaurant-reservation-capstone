import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, updateReservation } from "../utils/api";

function ReservationForm({ editReservation }) {
  const history = useHistory();

  useEffect(() => {
    if (editReservation) {
      // make sure there are no seconds
      let resTime = editReservation.reservation_time;
      const resTimeArr = editReservation.reservation_time.split(":");
      if (resTimeArr.length === 3) {
        resTimeArr.pop();
        resTime = resTimeArr.join(":");
      }
      setFirstName(editReservation.first_name);
      setLastName(editReservation.last_name);
      setMobileNumber(editReservation.mobile_number);
      setDateOfReservation(editReservation.reservation_date);
      setTimeOfReservation(resTime);
      setNumberOfPeople(parseInt(editReservation.people));
    }
  }, [editReservation]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfReservation, setDateOfReservation] = useState("");
  const [timeOfReservation, setTimeOfReservation] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [error, setError] = useState(null);

  const handleFirstNameChange = (event) => setFirstName(event.target.value);
  const handleLastNameChange = (event) => setLastName(event.target.value);
  const handleMobileNumberChange = (event) =>
    setMobileNumber(event.target.value);
  const handleDateOfReservationChange = (event) =>
    setDateOfReservation(event.target.value);
  const handleTimeOfReservationChange = (event) =>
    setTimeOfReservation(event.target.value);
  const handleNumberOfPeopleChange = (event) =>
    setNumberOfPeople(parseInt(event.target.value));

  function cancelHandler() {
    history.push("/");
  }

  function submitHandler(event) {
    event.preventDefault();
    const reservation = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      reservation_date: dateOfReservation,
      reservation_time: timeOfReservation,
      people: numberOfPeople,
    };
    const abortController = new AbortController();

    if (!editReservation) {
      createReservation(
        { ...reservation, status: "booked" },
        abortController.signal
      )
        .then(() => {
          history.push(`/dashboard/${reservation.reservation_date}`);
        })
        .catch(setError);
    } else {
      updateReservation(
        reservation,
        editReservation.reservation_id,
        abortController.signal
      )
        .then(() => {
          history.push(`/dashboard/${reservation.reservation_date}`);
        })
        .catch(setError);
    }
    return () => abortController.abort();
  }

  function isNumberKey(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 45 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  return (
    <>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            placeholder="First Name"
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            placeholder="Last Name"
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="mobile_number"
            className="form-label"
            onKeyDown={isNumberKey}
            onKeyUp={isNumberKey}
          >
            Mobile Number
          </label>
          <input
            placeholder="Mobile Number"
            type="number"
            className="form-control"
            id="mobile_number"
            name="mobile_number"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reservation_date" className="form-label">
            Reservation Date
          </label>
          <input
            type="date"
            className="form-control"
            id="reservation_date"
            name="reservation_date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            value={dateOfReservation}
            onChange={handleDateOfReservationChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reservation_time" className="form-label">
            Reservation Time
          </label>
          <input
            type="time"
            className="form-control"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
            id="reservation_time"
            name="reservation_time"
            value={timeOfReservation}
            onChange={handleTimeOfReservationChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="people" className="form-label">
            Number Of People
          </label>
          <input
            placeholder="Number Of People"
            type="number"
            className="form-control"
            id="people"
            name="people"
            value={numberOfPeople}
            onChange={handleNumberOfPeopleChange}
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

export default ReservationForm;
