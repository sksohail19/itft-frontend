import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useData } from "../../context/DataContext";
import { User, Pencil, Trash2, Plus, Mail } from "lucide-react";

const initialStudent = {
  regno: "",
  name: "",
  year: "",
  section: "A",
  studentEmail: "",
  image: "",
  linkedin: "",
  github: "",
  personalEmail: "",
  portfolio: ""
};

const AdminStudents = () => {
  const { students, addStudent, editStudent, deleteStudent } = useData();

  const [formData, setFormData] = useState(initialStudent);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    document.title = "ITFT Admin - Students";
  }, []);

  useEffect(() => {
    let list = students;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.regno.toLowerCase().includes(q) ||
          s.year.toLowerCase().includes(q) ||
          s.section.toLowerCase().includes(q) ||
          (s.studentEmail || "").toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [students, searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openAdd = () => {
    setFormData(initialStudent);
    setCurrentId(null);
    setShowFormModal(true);
  };

  const openEdit = (id) => {
    const found = students.find((s) => s._id === id);
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
    if (!formData.name || !formData.regno || !formData.studentEmail) {
      alert("Please fill all required fields");
      return;
    }
    if (currentId) {
      editStudent(currentId, formData);
    } else {
      addStudent(formData);
    }
    setShowFormModal(false);
  };

  const handleDelete = () => {
    deleteStudent(currentId);
    setShowDeleteModal(false);
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 fw-bold">Students Management</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="card mb-3">
        <div className="card-body">
          <input
            type="text"
            className="form-control"
            placeholder="Search students..."
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
              <th>Reg No</th>
              <th>Name</th>
              <th>Year</th>
              <th>Section</th>
              <th>Email</th>
              <th>GitHub</th>
              <th>LinkedIn</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No students found.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id}>
                  <td>{s.regno}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <User size={18} className="text-primary" />
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td>{s.year}</td>
                  <td>{s.section}</td>
                  <td>
                    {s.studentEmail ? (
                      <a href={`mailto:${s.studentEmail}`} className="text-decoration-none">
                        <Mail size={14} className="me-1" />
                        {s.studentEmail}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {s.github ? (
                      <a href={s.github} target="_blank" rel="noreferrer">GitHub</a>
                    ) : "-"}
                  </td>
                  <td>
                    {s.linkedin ? (
                      <a href={s.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    ) : "-"}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(s._id)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(s._id)}
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
                    {currentId ? "Edit Student" : "Add Student"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label">Reg No</label>
                      <input
                        className="form-control"
                        name="regno"
                        value={formData.regno}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-2 mt-2">
                    <div className="col-md-4">
                      <label className="form-label">Year</label>
                      <input
                        className="form-control"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Section</label>
                      <select
                        className="form-select"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        required
                      >
                        {["A","B","C","D","E","F","G","H"].map((sec) => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Student Email</label>
                      <input
                        className="form-control"
                        type="email"
                        name="studentEmail"
                        value={formData.studentEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-2 mt-2">
                    <div className="col-md-6">
                      <label className="form-label">Personal Email</label>
                      <input
                        className="form-control"
                        type="email"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Image URL</label>
                      <input
                        className="form-control"
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-2 mt-2">
                    <div className="col-md-4">
                      <label className="form-label">LinkedIn</label>
                      <input
                        className="form-control"
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">GitHub</label>
                      <input
                        className="form-control"
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Portfolio</label>
                      <input
                        className="form-control"
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                      />
                    </div>
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
                Are you sure you want to delete this student?
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

export default AdminStudents;
