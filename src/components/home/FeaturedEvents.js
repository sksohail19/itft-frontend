import { useData } from "../../context/DataContext";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

const FeaturedEvents = () => {
  const { events } = useData();

  // Get upcoming events, sorted by date
  const upcomingEvents = events
    .filter((event) => !event.isPast)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (upcomingEvents.length === 0) {
    return (
      <div className="py-5 text-center">
        <h2 className="h4 fw-bold mb-2">No Upcoming Events</h2>
        <p className="text-muted">Check back soon for new events!</p>
      </div>
    );
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Section Heading */}
        <div className="text-center mb-5">
          <h2 className="h3 fw-bold">Upcoming Events</h2>
          <p className="lead text-muted">
            Join us for these exciting opportunities to learn and connect
          </p>
        </div>

        {/* Event Cards */}
        <div className="row g-4">
          {upcomingEvents.map((event) => {
            const eventDate = parseISO(event.date);

            return (
              <div key={event._id || event.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="ratio ratio-16x9 bg-light">
                    <img
                      src={
                        event.image ||
                        "https://placehold.co/600x400?text=Event+Image"
                      }
                      alt={event.eventName || event.title}
                      className="w-100 h-100 object-fit-cover rounded-top"
                    />
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{event.eventName || event.title}</h5>
                    <p className="card-text text-muted small flex-grow-1">
                      {event.description || "No description available."}
                    </p>

                    <ul className="list-unstyled small text-muted mb-3">
                      <li>
                        <i className="bi bi-calendar-event me-2"></i>
                        {format(eventDate, "MMMM d, yyyy")}
                      </li>
                      <li>
                        <i className="bi bi-clock me-2"></i>
                        {event.time || "TBA"}
                      </li>
                      <li>
                        <i className="bi bi-geo-alt me-2"></i>
                        {event.venue || event.location}
                      </li>
                    </ul>

                    {event.registrationLink ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-100 mt-auto"
                      >
                        Register
                      </a>
                    ) : (
                      <Link
                        to={`/events/${event._id || event.id}`}
                        className="btn btn-outline-primary w-100 mt-auto"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Events Button */}
        <div className="text-center mt-5">
          <Link to="/events" className="btn btn-outline-secondary btn-lg">
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
