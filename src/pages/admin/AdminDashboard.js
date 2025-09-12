import { useEffect } from "react";
import { useData } from "../../context/DataContext";
import AdminLayout from "../../components/layout/AdminLayout";
import { Calendar, Trophy, Users, BellRing, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { events, results, team, professors, announcements } = useData();

  // Set page title
  useEffect(() => {
    document.title = "ITFT Admin - Dashboard";
  }, []);

  // Stats
  const upcomingEvents = events.filter((event) => !event.isPast);
  const pastEvents = events.filter((event) => event.isPast);
  const activeAnnouncements = announcements.filter((a) => a.isActive);

  // Recent events
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Next upcoming event
  const nextEvent = [...upcomingEvents]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .shift();

  return (
    <AdminLayout>
      <h1 className="h3 fw-bold mb-4">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-medium">Upcoming Events</span>
                <Calendar size={18} className="text-muted" />
              </div>
              <h3 className="mt-2">{upcomingEvents.length}</h3>
              <p className="text-muted small">{pastEvents.length} past events</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-medium">Event Results</span>
                <Trophy size={18} className="text-muted" />
              </div>
              <h3 className="mt-2">{results.length}</h3>
              <p className="text-muted small">
                {results.length > 0
                  ? `From ${results.length} events`
                  : "No results yet"}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-medium">Team Members</span>
                <Users size={18} className="text-muted" />
              </div>
              <h3 className="mt-2">{team ? team.length : 0}</h3>

              <p className="text-muted small">
                {professors.length} supporting professors
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-medium">Announcements</span>
                <BellRing size={18} className="text-muted" />
              </div>
              <h3 className="mt-2">{announcements.length}</h3>
              <p className="text-muted small">{activeAnnouncements.length} active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Upcoming Event */}
      <div className="mb-4">
        <h2 className="h5 mb-3">Next Event</h2>
        {nextEvent ? (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>{nextEvent.title}</h5>
              <p className="text-muted small mb-2">
                {format(parseISO(nextEvent.date), "MMMM d, yyyy")} at{" "}
                {nextEvent.time}
              </p>
              <div className="d-flex gap-3">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                  <Clock size={22} className="text-primary" />
                </div>
                <div>
                  <p className="small text-muted mb-1">
                    Location: {nextEvent.location}
                  </p>
                  <p className="mb-2">{nextEvent.description}</p>
                  <Link to={`/admin/events?edit=${nextEvent.id}`} className="text-primary small">
                    Edit Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <p className="mb-2">No upcoming events scheduled.</p>
              <Link to="/admin/events" className="text-primary small">
                Create an Event
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Recent Events */}
      <div>
        <h2 className="h5 mb-3">Recent Events</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            {recentEvents.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {recentEvents.map((event) => (
                  <li
                    key={event._id}
                    className="d-flex justify-content-between align-items-center py-2 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className={`rounded-circle`}
                        style={{
                          width: "10px",
                          height: "10px",
                          backgroundColor: event.isPast ? "#ccc" : "#28a745",
                        }}
                      ></div>
                      <div>
                        <p className="mb-0 fw-medium">{event.title}</p>
                        <small className="text-muted">
                          {format(parseISO(event.date), "MMM d, yyyy")}
                        </small>
                      </div>
                    </div>
                    <Link
                      to={`/admin/events?edit=${event._id}`}
                      className="text-primary small"
                    >
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted py-4">No events found.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
