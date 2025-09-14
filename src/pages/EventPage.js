import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import MainLayout from "../components/layout/MainLayout";

const EventsPage = () => {
    const { events, results } = useData();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [selectedEvent, setSelectedEvent] = useState(null);

    // ---------- FILTERING EVENTS ----------
    useEffect(() => {
        document.title = "ITFT Student Association - Events";
    }, []);

    useEffect(() => {
        let filtered = events || [];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (event) =>
                    event.title.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query) ||
                    event.location.toLowerCase().includes(query)
            );
        }

        if (activeTab === "upcoming") {
            filtered = filtered.filter((event) => !event.isPast);
        } else if (activeTab === "past") {
            filtered = filtered.filter((event) => event.isPast);
        }

        filtered = filtered.sort((a, b) =>
            activeTab === "upcoming"
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date)
        );

        setFilteredEvents(filtered);
    }, [events, searchQuery, activeTab]);

    // ---------- LIST VIEW ----------
    const renderListView = () => (
        <div>
            <h1 className="mb-4 fw-bold">Events</h1>

            {/* Search + Tabs */}
            <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                <div className="flex-grow-1 position-relative">
                    <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i
                        className="bi bi-filter position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                        style={{ fontSize: "1rem" }}
                    ></i>
                </div>

                <ul className="nav nav-pills w-100 w-sm-auto">
                    {["all", "upcoming", "past"].map((tab) => (
                        <li key={tab} className="nav-item flex-fill">
                            <button
                                className={`nav-link w-100 ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Events */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-5">
                    <h3 className="fw-medium mb-2">No events found</h3>
                    <p className="text-muted mb-3">Try adjusting your search criteria</p>
                    {searchQuery && (
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="row g-4">
                    {filteredEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        return (
                            <div className="col-md-6 col-lg-4" key={event.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="ratio ratio-16x9 bg-light">
                                        <img
                                            src={
                                                event.imageUrl ||
                                                "https://placehold.co/600x400?text=Event+Image"
                                            }
                                            alt={event.title}
                                            className="card-img-top object-fit-cover"
                                        />
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{event.title}</h5>
                                        <p className="card-text text-truncate">{event.description}</p>
                                        <ul className="list-unstyled small mb-3">
                                            <li>
                                                <i className="bi bi-calendar-event me-2 text-muted"></i>
                                                {eventDate.toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </li>
                                            <li>
                                                <i className="bi bi-clock me-2 text-muted"></i>
                                                {event.time}
                                            </li>
                                            <li>
                                                <i className="bi bi-geo-alt me-2 text-muted"></i>
                                                {event.location}
                                            </li>
                                        </ul>
                                        <div className="mt-auto d-flex gap-2">
                                            {/* Always show Register if link is available */}
                                            {event.registrationLink && (
                                                <a
                                                    href={event.registrationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary flex-fill"
                                                >
                                                    Register
                                                </a>
                                            )}

                                            {/* Show View Details (past) OR Learn More (upcoming) */}
                                            <button
                                                onClick={() => setSelectedEvent(event)}
                                                className={`btn ${event.isPast ? "btn-outline-secondary" : "btn-primary"
                                                    } flex-fill`}
                                            >
                                                {event.isPast ? "View Details" : "Learn More"}
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    // ---------- DETAILS VIEW ----------
    const renderDetailsView = () => {
        const event = selectedEvent;
        if (!event) return null;
        const eventDate = new Date(event.date);
        const eventResults = results.filter((r) => r.eventId === event.id);

        return (
            <div>
                <button
                    onClick={() => setSelectedEvent(null)}
                    className="btn btn-link text-primary mb-4"
                >
                    <i className="bi bi-arrow-left me-2"></i> Back to Events
                </button>

                <div className="card shadow-sm overflow-hidden mx-auto" style={{ maxWidth: "1000px" }}>
                    <div style={{ height: "20rem", overflow: "hidden" }}>
                        <img
                            src={event.imageUrl || "https://placehold.co/1200x600?text=Event+Image"}
                            alt={event.title}
                            className="w-100 h-100 object-fit-cover"
                        />
                    </div>

                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                            <h1 className="h3 fw-bold">{event.title}</h1>
                            {!event.isPast && event.registrationLink && (
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-lg"
                                >
                                    Register Now
                                </a>
                            )}
                        </div>

                        <div className="row row-cols-1 row-cols-md-3 g-4 border-bottom pb-4 mb-4">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-calendar-event text-primary me-2 fs-5"></i>
                                <div>
                                    <small className="text-muted d-block">Date</small>
                                    <span className="fw-medium">
                                        {eventDate.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-clock text-primary me-2 fs-5"></i>
                                <div>
                                    <small className="text-muted d-block">Time</small>
                                    <span className="fw-medium">{event.time}</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-geo-alt text-primary me-2 fs-5"></i>
                                <div>
                                    <small className="text-muted d-block">Location</small>
                                    <span className="fw-medium">{event.location}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="h5 fw-semibold mb-3">About This Event</h2>
                            <p style={{ whiteSpace: "pre-line" }}>{event.description}</p>
                        </div>

                        {event.isPast && eventResults.length > 0 && (
                            <div className="mt-5 pt-4 border-top">
                                <h2 className="h5 fw-semibold mb-4">Event Results</h2>
                                {eventResults.map((result) => (
                                    <div key={result.id} className="mb-5">
                                        <h3 className="h6 fw-bold mb-3">{result.category}</h3>

                                        <div className="mb-4">
                                            <h4 className="fw-semibold text-primary mb-3">Winners</h4>
                                            <div className="row g-3">
                                                {result.winners.map((winner) => (
                                                    <div key={winner.id} className="col-md-6">
                                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                                            <div
                                                                className="rounded-circle overflow-hidden bg-secondary me-3"
                                                                style={{ width: "3rem", height: "3rem" }}
                                                            >
                                                                <img
                                                                    src={winner.imageUrl || "https://placehold.co/100?text=Team"}
                                                                    alt={winner.name}
                                                                    className="w-100 h-100 object-fit-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <h5 className="mb-1 h6">{winner.name}</h5>
                                                                <small className="text-muted">{winner.description}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {result.runnersUp.length > 0 && (
                                            <div>
                                                <h4 className="fw-semibold text-primary mb-3">Runners-Up</h4>
                                                <div className="row g-3">
                                                    {result.runnersUp.map((runner) => (
                                                        <div key={runner.id} className="col-md-6">
                                                            <div className="d-flex align-items-center p-3 bg-white border rounded">
                                                                <div
                                                                    className="rounded-circle overflow-hidden bg-secondary me-3"
                                                                    style={{ width: "3rem", height: "3rem" }}
                                                                >
                                                                    <img
                                                                        src={runner.imageUrl || "https://placehold.co/100?text=Team"}
                                                                        alt={runner.name}
                                                                        className="w-100 h-100 object-fit-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <h5 className="mb-1 h6">{runner.name}</h5>
                                                                    <small className="text-muted">{runner.description}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="bg-light py-5">
                <div className="container">
                    {selectedEvent ? renderDetailsView() : renderListView()}
                </div>
            </div>
        </MainLayout>
    );
};

export default EventsPage;
