import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import LayoutTA from "./Layout-TA";

import "../../pages/assets/plugin/fullcalendar/main.min.css";
import "../../pages/assets/css/my-task.style.min.css";

const CalendarTA = () => {
  // pull TA ID and auth token from storage
  const taId = localStorage.getItem("userId");
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

  // adjust fetched busy-hours by +3 hours for display
  const adjustPlusThree = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    date.setHours(date.getHours());
    return date.toISOString();
  };

  // convert JS Date to ISO string without timezone offset for user input
  const toLocalIso = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 19);
  };

  // user clicks on empty slot
  const handleDateClick = (info) => {
    const startDate = info.date;
    const endDate = new Date(startDate.getTime() + 30 * 60000);

    setModalInfo({
      isEdit: false,
      id: null,
      title: "",
      recurring: false,
      start: toLocalIso(startDate),
      end: toLocalIso(endDate),
    });
    setModalOpen(true);
  };

  // user clicks on existing event
  const handleEventClick = (info) => {
    const e = info.event;
    setModalInfo({
      isEdit: true,
      id: e.extendedProps.originalId,
      title: e.title,
      recurring: e.extendedProps.recurring,
      start: toLocalIso(e.start),
      end: toLocalIso(e.end),
    });
    setModalOpen(true);
  };

  // load events from server, adjust only fetched busy-hours for display
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/ta/${taId}/busy-hours`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const dtos = await res.json();

      // one-off events
      const oneOff = dtos
        .filter((d) => !d.recurring)
        .map((d) => ({
          id: String(d.id),
          title: d.name || "Busy Hour",
          start: adjustPlusThree(d.startDateTime),
          end: adjustPlusThree(d.endDateTime),
          extendedProps: { originalId: d.id, recurring: false },
        }));

      // recurring events -> generate weekly occurrences
      const recur = dtos
        .filter((d) => d.recurring)
        .flatMap((d) => {
          // base times adjusted by +3
          const startBase = new Date(d.startDateTime);
          startBase.setHours(startBase.getHours() + 3);
          const endBase = new Date(d.endDateTime);
          endBase.setHours(endBase.getHours() + 3);
          const duration = endBase.getTime() - startBase.getTime();
          const windowStart = new Date(`${RANGE_START}T00:00:00`);
          const windowEnd = new Date(`${RANGE_END}T23:59:59`);

          let cur = new Date(startBase);
          while (cur < windowStart) {
            cur.setDate(cur.getDate() + 7);
          }

          const instances = [];
          while (cur <= windowEnd) {
            instances.push({
              id: `${d.id}-${cur.toISOString()}`,
              title: d.name || "Recurring",
              start: cur.toISOString(),
              end: new Date(cur.getTime() + duration).toISOString(),
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

  useEffect(() => {
    loadEvents();
  }, []);

  // save or update busy-hour: convert user input to UTC before sending
  const saveBusyHour = async () => {
    const { isEdit, id, start, end } = modalInfo;
    if (!start || !end || !taId) {
      alert("Start time, end time, and TA ID are required.");
      return;
    }
    // convert local ISO to full UTC ISO
    const startDate = new Date(start);
    startDate.setHours(startDate.getHours() + 3);

    const endDate = new Date(end);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString(),
    taId: Number(taId)
    };

    const baseUrl = `http://localhost:8080/api/ta/${taId}/busy-hours`;
    const url = isEdit ? `${baseUrl}/${id}` : baseUrl;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

  // delete busy-hour
  const deleteBusyHour = async () => {
    if (!window.confirm("Are you sure you want to delete this busy hour?")) return;
    try {
      const res = await fetch(`${baseUrl}/${modalInfo.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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

  const baseUrl = `http://localhost:8080/api/ta/${taId}/busy-hours`;

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
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          timeZone="local"
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
                  <h5 className="modal-title">{modalInfo.isEdit ? "Edit" : "Add"} Busy Hour</h5>
                  <button type="button" className="btn-close" onClick={() => setModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <p><strong>Start:</strong> {modalInfo.start}</p>
                  <p><strong>End:</strong> {modalInfo.end}</p>
                </div>
                <div className="modal-footer">
                  {modalInfo.isEdit && (
                    <button className="btn btn-danger me-auto" onClick={deleteBusyHour}>Delete</button>
                  )}
                  <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={saveBusyHour}>Save</button>
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
