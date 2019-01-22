import React from "react";
import withAuth from "../lib/withAuth";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = BigCalendar.momentLocalizer(moment);

const events = [];

const Calendar = () => (
  <div>
    <BigCalendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "100vh" }}
    />
  </div>
);

export default withAuth(Calendar);
