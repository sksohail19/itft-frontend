import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useData } from "../../context/DataContext";
import { Pencil, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

const initialForm = {
  eventID: "",
  eventName: "",
  winner: [],      // only IDs
  runnerUp: [],    // only IDs
  date: new Date().toISOString().split("T")[0],
  noOfParticipants: "",
  video: "",
  venue: "",
  eventsImages: [],
  resultSheet: "",
};

const AdminResults = () => {
  const { results, addResult, updateResult, deleteResult, students, events } =
    useData();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(results);

  const [eventInput, setEventInput] = useState("");
  const [showEventSuggestions, setShowEventSuggestions] = useState(false);

  const [studentInput, setStudentInput] = useState("");
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [studentRole, setStudentRole] = useState("winner");

  // 🔍 Search results
  useEffect(() => {
    let list = results;
    const q = (search || "").toLowerCase();

    if (q) {
      list = list.filter(
        (r) =>
          (r?.eventName || "").toLowerCase().includes(q) ||
          r?.winner?.some(
            (w) =>
              (w?.name || "").toLowerCase().includes(q) ||
              (w?.regno || "").toLowerCase().includes(q)
          ) ||
          r?.runnerUp?.some(
            (ru) =>
              (ru?.name || "").toLowerCase().includes(q) ||
              (ru?.regno || "").toLowerCase().includes(q)
          )
      );
    }
    setFiltered(list);
  }, [search, results]);

  // ✅ Event suggestions
  const getEventSuggestions = (input) => {
    if (!input || input.length < 1) return [];
    const uncompletedEvents = events.filter(
      (event) =>
        event.status !== "completed" &&
        event.status !== "cancelled" &&
        event.status !== "postponed"
    );

    return uncompletedEvents
      .filter((event) =>
        (event?.title || "").toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 10);
  };

  const selectEvent = (event) => {
    setFormData({
      ...formData,
      eventID: event._id,
      eventName: event.title,
    });
    setEventInput(event.title);
    setShowEventSuggestions(false);
  };

  // ✅ Student suggestions
  const getStudentSuggestions = (input) => {
    if (!input || input.length < 1) return [];
    return students
      .filter(
        (s) =>
          (s?.name || "").toLowerCase().includes(input.toLowerCase()) ||
          (s?.regno || "").toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 10);
  };

  const selectStudent = (student) => {
    setFormData({
      ...formData,
      [studentRole]: [...formData[studentRole], student._id], // store only IDs
    });
    setStudentInput("");
    setShowStudentSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateResult(editingId, formData);
    } else {
      await addResult(formData);
    }
    setFormData(initialForm);
    setEditingId(null);
    setEventInput("");
  };

  const handleEdit = (result) => {
    setFormData({
      ...result,
      winner: result.winner.map((w) => (typeof w === "string" ? w : w._id)),
      runnerUp: result.runnerUp.map((ru) =>
        typeof ru === "string" ? ru : ru._id
      ),
    });
    setEditingId(result._id);
    setEventInput(result.eventName);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      deleteResult(id);
    }
  };

  // Helper: get student by ID for display
  const getStudentById = (id) => students.find((s) => s._id === id);

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Manage Results</h4>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        {/* Event autocomplete */}
        <div className="mb-3 position-relative">
          <label className="form-label">Event</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search event..."
            value={eventInput}
            onChange={(e) => {
              setEventInput(e.target.value);
              setShowEventSuggestions(true);
            }}
          />
          {showEventSuggestions && (
            <div className="list-group position-absolute w-100 z-3">
              {getEventSuggestions(eventInput).map((event) => (
                <button
                  key={event._id}
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={() => selectEvent(event)}
                >
                  <div className="fw-medium">{event.title}</div>
                  <small className="text-muted">
                    {format(parseISO(event.date), "PPP")}
                  </small>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Extra inputs */}
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Number of Participants</label>
          <input
            type="number"
            className="form-control"
            value={formData.noOfParticipants}
            onChange={(e) =>
              setFormData({ ...formData, noOfParticipants: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Video URL</label>
          <input
            type="text"
            className="form-control"
            value={formData.video}
            onChange={(e) => setFormData({ ...formData, video: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Venue</label>
          <input
            type="text"
            className="form-control"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Event Images (comma separated URLs)</label>
          <input
            type="text"
            className="form-control"
            value={formData.eventsImages.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                eventsImages: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Result Sheet (URL)</label>
          <input
            type="text"
            className="form-control"
            value={formData.resultSheet}
            onChange={(e) =>
              setFormData({ ...formData, resultSheet: e.target.value })
            }
          />
        </div>

        {/* Student autocomplete */}
        <div className="mb-3 position-relative">
          <label className="form-label">Add Student</label>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search student..."
              value={studentInput}
              onChange={(e) => {
                setStudentInput(e.target.value);
                setShowStudentSuggestions(true);
              }}
            />
            <select
              className="form-select"
              value={studentRole}
              onChange={(e) => setStudentRole(e.target.value)}
            >
              <option value="winner">Winner</option>
              <option value="runnerUp">Runner Up</option>
            </select>
          </div>
          {showStudentSuggestions && (
            <div className="list-group position-absolute w-100 z-3">
              {getStudentSuggestions(studentInput).map((student) => (
                <button
                  key={student._id}
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={() => selectStudent(student)}
                >
                  <div className="fw-medium">{student.name}</div>
                  <small className="text-muted">{student.regno}</small>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Winner & Runner up lists */}
        <div className="mb-3">
          <label className="form-label">Winner(s)</label>
          <ul className="list-group">
            {formData.winner.map((id, idx) => {
              const s = getStudentById(id);
              return (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between"
                >
                  {s ? `${s.name} (${s.regno})` : id}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mb-3">
          <label className="form-label">Runner Up(s)</label>
          <ul className="list-group">
            {formData.runnerUp.map((id, idx) => {
              const s = getStudentById(id);
              return (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between"
                >
                  {s ? `${s.name} (${s.regno})` : id}
                </li>
              );
            })}
          </ul>
        </div>

        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Result" : "Add Result"}
        </button>
      </form>

      {/* Results table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Participants</th>
            <th>Winner(s)</th>
            <th>Runner Up(s)</th>
            <th>Venue</th>
            <th>Video</th>
            <th>Result Sheet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r._id}>
              <td>{r.eventName}</td>
              <td>{r.date ? format(parseISO(r.date), "PPP") : ""}</td>
              <td>{r.noOfParticipants}</td>
              <td>
                {r.winner.map((w) => {
                  const s = typeof w === "string" ? getStudentById(w) : w;
                  return (
                    <div key={w._id || w}>
                      {s ? `${s.name} (${s.regno})` : w}
                    </div>
                  );
                })}
              </td>
              <td>
                {r.runnerUp.map((ru) => {
                  const s = typeof ru === "string" ? getStudentById(ru) : ru;
                  return (
                    <div key={ru._id || ru}>
                      {s ? `${s.name} (${s.regno})` : ru}
                    </div>
                  );
                })}
              </td>
              <td>{r.venue}</td>
              <td>
                {r.video && (
                  <a href={r.video} target="_blank" rel="noreferrer">
                    Video
                  </a>
                )}
              </td>
              <td>
                {r.resultSheet && (
                  <a href={r.resultSheet} target="_blank" rel="noreferrer">
                    Sheet
                  </a>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(r)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(r._id)}
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default AdminResults;
