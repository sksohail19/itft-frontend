import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { useData } from "../../context/DataContext";
import { format, parseISO } from "date-fns";
import { Pencil, Trash2, Plus } from "lucide-react";

const initialEventState = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  imageUrl: "",
  registrationLink: "",
  type: "",
  status: "",
};

const AdminEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent, deleteEventByID } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // new state for edit-modal
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialEventState);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "ITFT Admin - Events Management";
  }, []);

  // Handle edit query param -> open edit modal (use _id)
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      const eventToEdit = events.find((e) => e._id === editId);
      if (eventToEdit) {
        setFormData(eventToEdit);
        setCurrentEventId(editId);
        setIsEditDialogOpen(true);
      }
    }
  }, [searchParams, events]);

  // Filter events
  useEffect(() => {
    let filtered = Array.isArray(events) ? [...events] : [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          (event.title || "").toLowerCase().includes(query) ||
          (event.description || "").toLowerCase().includes(query) ||
          (event.location || "").toLowerCase().includes(query)
      );
    }

    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredEvents(filtered);
  }, [events, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Clear error when user starts typing
  };

  const openAddDialog = () => {
    setFormData(initialEventState);
    setCurrentEventId(null);
    setIsDialogOpen(true);
    setError(null);
    setSearchParams({});
  };

  const openEditDialog = (eventId) => {
    const eventToEdit = events.find((e) => e._id === eventId);
    
    if (eventToEdit) {
      setFormData(eventToEdit);
      setCurrentEventId(eventToEdit._id);
      setIsEditDialogOpen(true);
      setError(null);
      setSearchParams({ edit: eventId });
    }
  };

  const confirmDelete = (eventId) => {
    const eventToDelete = events.find((e) => e._id === eventId);
    if (eventToDelete) {
      setFormData(eventToDelete);
      setCurrentEventId(eventId);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    if (currentEventId) {
      try {
        setIsSubmitting(true);
        await deleteEventByID(currentEventId);
        setIsDeleteDialogOpen(false);
        setFormData(initialEventState);
        setCurrentEventId(null);
        setSearchParams({});
      } catch (error) {
        console.error("Failed to delete event:", error);
        setError("Failed to delete event. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Add event submit (used by Add Modal)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setIsSubmitting(true);
      const eventData = {
        ...formData,
        imageUrl: formData.imageUrl || "",
        registrationLink: formData.registrationLink || "",
      };

      await addEvent(eventData);
      setIsDialogOpen(false);
      setFormData(initialEventState);
      setCurrentEventId(null);
      setSearchParams({});
    } catch (err) {
      console.error("Failed to save event:", err);
      setError("Failed to save event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit event submit (used by Edit Modal)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!currentEventId) {
      setError("Missing event id to update.");
      return;
    }
/*
    try {
      setIsSubmitting(true);
      const eventData = {
        ...formData,
        imageUrl: formData.imageUrl || "",
        registrationLink: formData.registrationLink || "",
      };
      console.log("Updating event with data:", currentEventId);
      // Note: updateEvent expects the object with an `id` property in your original code.
      await updateEvent({ ...eventData, id: currentEventId });

      setIsEditDialogOpen(false);
      setFormData(initialEventState);
      setCurrentEventId(null);
      setSearchParams({});
    } catch (err) {
      console.error("Failed to update event:", err);
      setError("Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }*/
   await updateEvent(formData);
   setIsEditDialogOpen(false);
   setFormData(initialEventState);
   setCurrentEventId(null);
   setSearchParams({});
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Events Management</h1>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={openAddDialog}
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Search */}
      <div className="card mb-4">
        <div className="card-body">
          <input
            type="text"
            className="form-control"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No events found. Click "Add Event" to create a new one.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event, index) => (
                <tr key={event?._id || index}>
                  <td>{event?.title}</td>
                  <td>
                    {event?.date ? format(parseISO(event?.date), "MMM d, yyyy") : "—"} at {event?.time}
                  </td>
                  <td>{event?.location}</td>
                  <td>{event?.type}</td>
                  <td>
                    <span
                      className={`badge ${event?.status === "Upcoming"
                        ? "bg-success"
                        : event?.status === "past"
                          ? "bg-secondary"
                          : "bg-warning"
                        }`}
                    >
                      {event?.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEditDialog(event._id)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(event._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditDialogOpen && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Event</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setError(null);
                      setCurrentEventId(null);
                      setFormData(initialEventState);
                      setSearchParams({});
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="time"
                        className="form-control"
                        placeholder="e.g. 14:00-16:00"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Location <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      className="form-control"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Registration Link</label>
                    <input
                      type="url"
                      name="registrationLink"
                      className="form-control"
                      value={formData.registrationLink}
                      onChange={handleInputChange}
                      placeholder="https://example.com/register"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Type <span className="text-danger">*</span>
                      </label>
                      <select
                        name="type"
                        className="form-select"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Type --</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="conference">Conference</option>
                        <option value="webinar">Webinar</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Postponed">Postponed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setError(null);
                      setCurrentEventId(null);
                      setFormData(initialEventState);
                      setSearchParams({});
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      "Update Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isDialogOpen && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Event</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setError(null);
                      setFormData(initialEventState);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="time"
                        className="form-control"
                        placeholder="e.g. 14:00-16:00"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Location <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      className="form-control"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Registration Link</label>
                    <input
                      type="url"
                      name="registrationLink"
                      className="form-control"
                      value={formData.registrationLink}
                      onChange={handleInputChange}
                      placeholder="https://example.com/register"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Type <span className="text-danger">*</span>
                      </label>
                      <select
                        name="type"
                        className="form-select"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Type --</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="conference">Conference</option>
                        <option value="webinar">Webinar</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Postponed">Postponed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setError(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      "Create Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isSubmitting}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete event "{formData.title}"?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete Event"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEvents;
