import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useData } from "../context/DataContext";
import { format, parseISO, isBefore } from "date-fns";

const Announcements = () => {
    const { announcements } = useData(); // assume announcements come from context
    const [activeAnnouncements, setActiveAnnouncements] = useState([]);

    useEffect(() => {
        document.title = "ITFT Student Association - Announcements";
    }, []);

    useEffect(() => {
        if (announcements) {
            // filter only active ones
            const active = announcements.filter((a) => a.isActive);
            setActiveAnnouncements(active);
        }
    }, [announcements]);

    return (
        <MainLayout>
            <div className="bg-light py-5">
                <div className="container">
                    <h1 className="fw-bold mb-4">Announcements</h1>

                    {activeAnnouncements.length === 0 ? (
                        <div className="text-center py-5">
                            <h3 className="fw-semibold mb-2">No active announcements</h3>
                            <p className="text-muted">
                                Please check back later for new updates.
                            </p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {activeAnnouncements.map((a) => {
                                const deadlineDate = a.date ? parseISO(a.date) : null;
                                const expired = deadlineDate ? isBefore(deadlineDate, new Date()) : false;

                                return (
                                    <div key={a._id || a.id} className="col-md-6 col-lg-4">
                                        <div className="card h-100 shadow-sm">
                                            <div className="card-body">
                                                <h5 className="card-title">{a.title}</h5>
                                                <p className="card-text">{a.content}</p>

                                                {deadlineDate && (
                                                    <p className="small text-muted mb-1">
                                                        <i className="bi bi-calendar-event me-1"></i>
                                                        Deadline: {format(deadlineDate, "MMMM d, yyyy")}
                                                    </p>
                                                )}

                                                {expired ? (
                                                    <span className="badge bg-danger">Expired</span>
                                                ) : (
                                                    <span className="badge bg-success">Active</span>
                                                )}
                                            </div>
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

export default Announcements;
