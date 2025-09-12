import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useData } from "../../context/DataContext";
import { Trophy, Calendar, Pencil, Trash2, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";

const initialResult = {
  eventName: "",
  winner: "",
  runnerUp: "",
  date: new Date().toISOString().split("T")[0],
};

const AdminResults = () => {
  const { results, addResult, updateResult, deleteResult } = useData();

  const [formData, setFormData] = useState(initialResult);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    document.title = "ITFT Admin - Results";
  }, []);

  useEffect(() => {
    let list = results;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.eventName.toLowerCase().includes(q) ||
          r.winner.toLowerCase().includes(q) ||
          r.runnerUp.toLowerCase().includes(q)
      );
    }
    list = list.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFiltered(list);
  }, [results, searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openAdd = () => {
    setFormData(initialResult);
    setCurrentId(null);
    setShowFormModal(true);
  };

  const openEdit = (id) => {
    const found = results.find((r) => r._id === id);
    if (found) {
      setFormData(found);
      setCurrentId(id);
      setShowFormModal(true);
    }
  };

  const confirmDelete = (id) => {
    setCurrentId(id);
    setShowDeleteModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.eventName || !formData.winner || !formData.date) {
      alert("Please fill all required fields");
      return;
    }
    if (currentId) {
      updateResult(currentId, formData);
    } else {
      addResult(formData);
    }
    setShowFormModal(false);
  };

  const handleDelete = () => {
    deleteResult(currentId);
    setShowDeleteModal(false);
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 fw-bold">Results Management</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> Add Result
        </button>
      </div>

      {/* Search */}
      <div className="card mb-3">
        <div className="card-body">
          <input
            type="text"
            className="form-control"
            placeholder="Search results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Event</th>
              <th>Winner</th>
              <th>Runner Up</th>
              <th>Date</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No results found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Trophy size={18} className="text-warning" />
                      <span>{r.eventName}</span>
                    </div>
                  </td>
                  <td>{r.winner}</td>
                  <td>{r.runnerUp || "-"}</td>
                  <td>
                    <Calendar size={14} className="me-1 text-muted" />
                    {format(parseISO(r.date), "MMM d, yyyy")}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(r._id)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(r._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showFormModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {currentId ? "Edit Result" : "Add Result"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Event Name</label>
                    <input
                      className="form-control"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Winner</label>
                    <input
                      className="form-control"
                      name="winner"
                      value={formData.winner}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Runner Up</label>
                    <input
                      className="form-control"
                      name="runnerUp"
                      value={formData.runnerUp}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowFormModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {currentId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this result?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminResults;
