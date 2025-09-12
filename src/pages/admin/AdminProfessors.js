import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useData } from "../../context/DataContext";
import { UserCog, Pencil, Trash2, Plus, Mail } from "lucide-react";

const initialProfessor = {
  name: "",
  department: "",
  email: "",
  specialization: "",
};

const AdminProfessors = () => {
  const { professors, addProfessor, updateProfessor, deleteProfessor } = useData();

  const [formData, setFormData] = useState(initialProfessor);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    document.title = "ITFT Admin - Professors";
  }, []);

  useEffect(() => {
    let list = professors;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          (p.specialization || "").toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [professors, searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openAdd = () => {
    setFormData(initialProfessor);
    setCurrentId(null);
    setShowFormModal(true);
  };

  const openEdit = (id) => {
    const found = professors.find((p) => p._id === id);
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
    if (!formData.name || !formData.department) {
      alert("Please fill all required fields");
      return;
    }
    if (currentId) {
      updateProfessor(currentId, formData);
    } else {
      addProfessor(formData);
    }
    setShowFormModal(false);
  };

  const handleDelete = () => {
    deleteProfessor(currentId);
    setShowDeleteModal(false);
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 fw-bold">Professors Management</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> Add Professor
        </button>
      </div>

      {/* Search */}
      <div className="card mb-3">
        <div className="card-body">
          <input
            type="text"
            className="form-control"
            placeholder="Search professors..."
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
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Specialization</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No professors found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <UserCog size={18} className="text-primary" />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.department}</td>
                  <td>
                    {p.email ? (
                      <a href={`mailto:${p.email}`} className="text-decoration-none">
                        <Mail size={14} className="me-1" />
                        {p.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{p.specialization || "-"}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(p._id)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(p._id)}
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
                    {currentId ? "Edit Professor" : "Add Professor"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input
                      className="form-control"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Specialization</label>
                    <input
                      className="form-control"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
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
                Are you sure you want to delete this professor?
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

export default AdminProfessors;
