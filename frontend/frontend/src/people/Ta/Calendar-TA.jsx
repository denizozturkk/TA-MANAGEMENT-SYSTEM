// src/people/TA/Calendar-TA.jsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import LayoutTA from "./Layout-TA";

import "../../pages/assets/plugin/fullcalendar/main.min.css";
import "../../pages/assets/css/my-task.style.min.css";

const CalendarTA = () => {
  const taId = localStorage.getItem("user_id");
  const token = localStorage.getItem("authToken");
  const RANGE_START = "2025-01-27";
  const RANGE_END = "2025-05-18";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    isEdit: false,
    id: null,
    start: null,
    end: null,
    title: "",
    recurring: false,
  });

  

  useEffect(() => {
    loadEvents();
  }, []);

  // handlers
  
const handleDateClick = info => {
  const startDate = info.date;                        // a JS Date in your local TZ
  const endDate   = new Date(startDate.getTime() + 30 * 60000);

  setModalInfo({
    isEdit:    false,
    id:        null,
    title:     "",
    recurring: false,

    // use our helper instead of toISOString()
    start:     toLocalIso(startDate),  // e.g. "2025-05-09T14:30:00"
    end:       toLocalIso(endDate),
  });
  setModalOpen(true);
};
function toLocalIso(date) {
  // offset in ms
  const tzOffset = date.getTimezoneOffset() * 60000;
  // substract the offset, then build an ISO string, and drop the “Z”
  return new Date(date.getTime() - tzOffset)
    .toISOString()
    .slice(0, 19);
}

const handleEventClick = info => {
  const e = info.event;
  const startDate = e.start;
  const endDate   = e.end;

  setModalInfo({
    isEdit:    true,
    id:        e.extendedProps.originalId,
    title:     e.title,
    recurring: e.extendedProps.recurring,

    // same conversion on existing events
    start:     toLocalIso(startDate),
    end:       toLocalIso(endDate),
  });
  setModalOpen(true);
};


// Fetch & build events…
const loadEvents = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      `http://localhost:8080/api/ta/${taId}/busy-hours`,
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const dtos = await res.json();

    // One-off (non-recurring) events:
    const oneOff = dtos
      .filter(d => !d.recurring)
      .map(d => ({
        id:    String(d.id),
        title: d.name,
        // These ISO strings (no “Z”) will be parsed as local (GMT+3) by new Date()
        start: d.start_date_time,
        end:   d.end_date_time,
        extendedProps: { originalId: d.id, recurring: false },
      }));

    // Recurring events → expand weekly
    const recur = dtos
      .filter(d => d.recurring)
      .flatMap(d => {
        const start0   = new Date(d.start_date_time);
        const end0     = new Date(d.end_date_time);
        const duration = end0.getTime() - start0.getTime();

        // Define your calendar bounds in local time:
        const windowStart = new Date(`${RANGE_START}T00:00:00`);
        const windowEnd   = new Date(`${RANGE_END}T23:59:59`);

        // Roll forward until the first occurrence inside the window
        let cur = new Date(start0);
        while (cur < windowStart) {
          cur.setDate(cur.getDate() + 7);
        }

        // Collect one instance per week
        const instances = [];
        while (cur <= windowEnd) {
          instances.push({
            id:    `${d.id}-${cur.toISOString()}`,
            title: d.name,
            start: cur.toISOString(),
            end:   new Date(cur.getTime() + duration).toISOString(),
            extendedProps: { originalId: d.id, recurring: true },
          });
          cur.setDate(cur.getDate() + 7);
        }
        return instances;
      });

    setEvents([...oneOff, ...recur]);
  } catch (err) {
    console.error("loadEvents error:", err);
    alert("Failed to load busy hours: " + err.message);
  } finally {
    setLoading(false);
  }
};


useEffect(() => { loadEvents(); }, []);

// build payload without ever including `id`
const saveBusyHour = async () => {
  const { isEdit, id, start, end, title, recurring } = modalInfo;
  const day = new Date(start).getDay() || 7; // Sunday→7

  const payload = {
    start_date_time: start,         // maps to DTO.startDateTime
    end_date_time:   end,           // maps to DTO.endDateTime
    ta_id:           Number(taId),  // maps to DTO.taId
  };



  const baseUrl = `http://localhost:8080/api/ta/${taId}/busy-hours`;
  const url     = isEdit ? `${baseUrl}/${id}` : baseUrl;
  const method  = isEdit ? "PUT" : "POST";

  try {
    console.log("→ payload:", payload);
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${res.status}`);
    }
    await loadEvents();
    setModalOpen(false);
  } catch (err) {
    console.error("saveBusyHour error:", err);
    alert("Failed to save busy hour: " + err.message);
  }
};
// build payload without ever including `id`
const baseUrl = `http://localhost:8080/api/ta/${taId}/busy-hours`;

// … after saveBusyHour …

const deleteBusyHour = async () => {
  if (!window.confirm("Are you sure you want to delete this busy hour?")) return;

  try {
    const res = await fetch(`${baseUrl}/${modalInfo.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    await loadEvents();
    setModalOpen(false);
  } catch (err) {
    console.error("deleteBusyHour error:", err);
    alert("Failed to delete busy hour: " + err.message);
  }
};

  

  // layout identical to PendingDutiesTA
  if (loading) {
    return (
      <div className="d-flex flex-column flex-lg-row">
        <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
          <LayoutTA />
        </div>
        <div className="container-fluid py-4">
          <p>Loading calendar…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutTA />
      </div>
      <div className="container-fluid py-4">
        <h3 className="fw-bold mb-4 text-primary">My Calendar</h3>
        <FullCalendar
          plugins={[ timeGridPlugin, interactionPlugin ]}
          initialView="timeGridWeek"
          timeZone="local"               // <-- this uses your system clock (GMT+3)
          validRange={{ start: RANGE_START, end: RANGE_END }}
          slotMinTime="08:30:00"
          slotMaxTime="21:30:00"
          slotDuration="00:30:00"
          headerToolbar={{ left: "prev", center: "title", right: "next" }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          height="auto"
        />


{modalOpen && (
  <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {modalInfo.isEdit ? "Edit" : "Add"} Busy Hour
          </h5>
          <button type="button" className="btn-close" onClick={() => setModalOpen(false)} />
        </div>
        <div className="modal-body">
          {/* … your existing form fields … */}
        </div>
        <div className="modal-footer">
          {modalInfo.isEdit && (
            <button
              type="button"
              className="btn btn-danger me-auto"
              onClick={deleteBusyHour}
            >
              Delete
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={saveBusyHour}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default CalendarTA;
