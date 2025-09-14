import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import MainLayout from "../components/layout/MainLayout";
import { format, parseISO } from "date-fns";

const Results = () => {
  const { results, events, students } = useData();
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [filteredResults, setFilteredResults] = useState([]);
  const pastEvents = events.filter((event) => event.isPast);

  // Set page title
  useEffect(() => {
    document.title = "ITFT Student Association - Results";
  }, []);

  // Filter results when event changes
  useEffect(() => {
    if (selectedEventId === "all") {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter((r) => r.eventID === selectedEventId));
    }
  }, [results, selectedEventId]);

  // Find event details by ID
  const getEventDetails = (eventId) => {
    return events.find((e) => e._id === eventId);
  };

  // Find student by ID
  const getStudent = (id) => {
    return students.find((s) => s._id === id);
  };

  return (
    <MainLayout>
      <div className="bg-light py-5">
        <div className="container">
          <h1 className="fw-bold mb-4">Event Results</h1>

          {/* Filter dropdown */}
          <div className="mb-4">
            <label htmlFor="eventFilter" className="form-label">
              Filter by Event
            </label>
            <select
              id="eventFilter"
              className="form-select w-auto"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="all">All Events</option>
              {pastEvents.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          {filteredResults.length === 0 ? (
            <div className="text-center py-5">
              <h3 className="fw-semibold mb-2">No results found</h3>
              <p className="text-muted">
                {pastEvents.length === 0
                  ? "There are no past events with results yet."
                  : "Try selecting a different event from the dropdown."}
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-5">
              {filteredResults.map((result) => {
                const event = getEventDetails(result.eventID);

                return (
                  <div key={result._id} className="card shadow-sm">
                    <div className="card-header bg-light">
                      <div className="d-flex justify-content-between flex-wrap">
                        <h5 className="mb-0">{result.eventName}</h5>
                        <small className="text-muted">
                          {event && format(parseISO(result.date), "MMMM d, yyyy")}
                        </small>
                      </div>
                      <small className="text-muted">
                        {result.noOfParticipants} Participants • {result.venue}
                      </small>
                    </div>

                    <div className="card-body">
                      {/* Links */}
                      <div className="mb-4 d-flex flex-wrap gap-3">
                        {result.resultSheet && (
                          <a
                            href={result.resultSheet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Result Sheet
                          </a>
                        )}
                        {result.video && (
                          <a
                            href={result.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-secondary btn-sm"
                          >
                            Watch Video
                          </a>
                        )}
                      </div>

                      {/* Winners */}
                      <div className="mb-4">
                        <h6 className="fw-bold text-primary mb-3">Winners</h6>
                        <div className="row g-3">
                          {(result.winner || []).map((id) => {
                            const student = getStudent(id);
                            if (!student) return null;
                            return (
                              <div key={id} className="col-md-6">
                                <div className="d-flex bg-light p-3 rounded">
                                  <div
                                    className="rounded-circle overflow-hidden bg-secondary me-3"
                                    style={{ width: "64px", height: "64px" }}
                                  >
                                    <img
                                      src={
                                        student.image ||
                                        "https://placehold.co/100?text=Winner"
                                      }
                                      alt={student.name}
                                      className="w-100 h-100 object-fit-cover"
                                    />
                                  </div>
                                  <div>
                                    <h6 className="mb-1">{student.name}</h6>
                                    <small className="text-muted d-block">
                                      {student.role || "Participant"}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Runners-up */}
                      {(result.runnerUp || []).length > 0 && (
                        <div className="mb-4">
                          <h6 className="fw-bold text-secondary mb-3">
                            Runners-up
                          </h6>
                          <div className="row g-3">
                            {(result.runnerUp || []).map((id) => {
                              const student = getStudent(id);
                              if (!student) return null;
                              return (
                                <div key={id} className="col-md-6">
                                  <div className="d-flex bg-white border p-3 rounded">
                                    <div
                                      className="rounded-circle overflow-hidden bg-secondary me-3"
                                      style={{ width: "64px", height: "64px" }}
                                    >
                                      <img
                                        src={
                                          student.image ||
                                          "https://placehold.co/100?text=Runner"
                                        }
                                        alt={student.name}
                                        className="w-100 h-100 object-fit-cover"
                                      />
                                    </div>
                                    <div>
                                      <h6 className="mb-1">{student.name}</h6>
                                      <small className="text-muted d-block">
                                        {student.role || "Participant"}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Gallery */}
                      {(result.eventsImages || []).length > 0 && (
                        <div className="mt-4 pt-3 border-top">
                          <h6 className="fw-bold mb-3">Event Gallery</h6>
                          <div className="row g-3">
                            {result.eventsImages.map((image, index) => (
                              <div key={index} className="col-6 col-sm-4 col-md-3">
                                <div className="ratio ratio-1x1 rounded bg-light overflow-hidden">
                                  <img
                                    src={image}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-100 h-100 object-fit-cover"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Results;
