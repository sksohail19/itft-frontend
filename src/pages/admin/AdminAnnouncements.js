import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useData } from "../../context/DataContext";
import { Bell, Calendar, Pencil, Trash2, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";

const initialAnnouncement = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  isActive: true,
};

const AdminAnnouncements = () => {
  const { announcements, addAnnouncement, editAnnouncement, deleteAnnouncement } = useData();

  const [formData, setFormData] = useState(initialAnnouncement);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const query = (searchQuery || "").toLowerCase();
    setFiltered(
      announcements.filter((a) =>
        (a?.title || "").toLowerCase().includes(query)
      )
    );
  }, [searchQuery, announcements]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date) {
      alert("Please fill all fields");
      return;
    }
    await addAnnouncement(formData);
    setFormData(initialAnnouncement);
    setShowFormModal(false);
  };

  const handleDelete = async () => {
    console.log("Current ID to delete:", currentId);
    console.log("Form Data:", formData);
    await deleteAnnouncement(currentId);
    setShowDeleteModal(false);
    setCurrentId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date) {
      alert("Please fill all fields");
      return;
    }
    await editAnnouncement(currentId, formData);
    setShowFormModal(false);
    setCurrentId(null);
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="d-flex align-items-center gap-2">
            <Bell size={24} />
            Manage Announcements
          </h2>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => {
              setFormData(initialAnnouncement);
              setCurrentId(null);
              setShowFormModal(true);
            }}
          >
            <Plus size={18} /> New Announcement
          </button>
        </div>

        {/* Search bar */}
        <div className="input-group mb-3">
          <span className="input-group-text">Search</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Announcements Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, index) => (
                    <tr key={a?._id || index}>
                      <td>{a?.title}</td>
                      <td>{a?.description}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <Calendar size={16} />
                          {a?.date ? format(parseISO(a.date), "PPP") : "No date"}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${a?.isActive ? "bg-success" : "bg-secondary"}`}
                        >
                          {a?.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => {
                            setCurrentId(a._id);
                            setFormData({
                              title: a.title,
                              description: a.description,
                              date: a.date,
                              isActive: a.isActive,
                            });
                            setShowFormModal(true);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setCurrentId(a._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(filtered?.length || 0) === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-3">
                        No announcements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showFormModal && currentId === null && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">New Announcement</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
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
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active announcement
                    </label>
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
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showFormModal && currentId !== null && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Announcement</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
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
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActiveEdit"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="isActiveEdit">
                      Active announcement
                    </label>
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
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this announcement?
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

export default AdminAnnouncements;