import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useData } from "../../context/DataContext";
import { Pencil, Trash2, Plus, Linkedin, Github, Twitter } from "lucide-react";

const initialTeamMember = {
  name: "",
  role: "",
  description: "",
  imageUrl: "",
  email: "",
  socialLinks: {
    linkedin: "",
    github: "",
    twitter: "",
  },
};

const AdminTeam = () => {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useData();

  const [formData, setFormData] = useState(initialTeamMember);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    document.title = "ITFT Admin - Team Management";
  }, []);

  useEffect(() => {
    let list = team;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          (m.description || "").toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [team, searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social-")) {
      const field = name.replace("social-", "");
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const openAdd = () => {
    setFormData(initialTeamMember);
    setCurrentId(null);
    setShowFormModal(true);
  };

  const openEdit = (id) => {
    const found = team.find((m) => m.id === id);
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
    if (!formData.name || !formData.role || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }
    if (currentId) {
      updateTeamMember({ ...formData, id: currentId });
    } else {
      addTeamMember(formData);
    }
    setShowFormModal(false);
  };

  const handleDelete = () => {
    deleteTeamMember(currentId);
    setShowDeleteModal(false);
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 fw-bold">Team Management</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      {/* Search */}
      <div className="card mb-3">
        <div className="card-body">
          <input
            type="text"
            className="form-control"
            placeholder="Search team members..."
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
              <th>Role</th>
              <th>Email</th>
              <th>Social Links</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No team members found.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={m.imageUrl || "https://placehold.co/50x50?text=Team"}
                        alt={m.name}
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td>{m.role}</td>
                  <td>{m.email || "-"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {m.socialLinks?.linkedin && (
                        <a href={m.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin size={16} className="text-muted" />
                        </a>
                      )}
                      {m.socialLinks?.github && (
                        <a href={m.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github size={16} className="text-muted" />
                        </a>
                      )}
                      {m.socialLinks?.twitter && (
                        <a href={m.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter size={16} className="text-muted" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(m.id)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(m.id)}
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
                    {currentId ? "Edit Team Member" : "Add Team Member"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      className="form-control"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
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
                    <label className="form-label">Profile Image URL</label>
                    <input
                      className="form-control"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
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

                  <h6 className="mt-3">Social Links (Optional)</h6>
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center gap-1">
                      <Linkedin size={14} /> LinkedIn
                    </label>
                    <input
                      className="form-control"
                      name="social-linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center gap-1">
                      <Github size={14} /> GitHub
                    </label>
                    <input
                      className="form-control"
                      name="social-github"
                      value={formData.socialLinks.github}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center gap-1">
                      <Twitter size={14} /> Twitter
                    </label>
                    <input
                      className="form-control"
                      name="social-twitter"
                      value={formData.socialLinks.twitter}
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
                    {currentId ? "Update Member" : "Create Member"}
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
                Are you sure you want to remove this team member?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
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

export default AdminTeam;
