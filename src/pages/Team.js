import { useEffect } from "react";
import { useData } from "../context/DataContext";
import MainLayout from "../components/layout/MainLayout";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";

const Team = () => {
  const { team, professors } = useData();
    
  // Set page title
  useEffect(() => {
    document.title = "ITFT Student Association - Our Team";
  }, []);

  return (
    <MainLayout>
      <div className="bg-light py-5">
        <div className="container">
          <h1 className="mb-3 fw-bold">Our Team</h1>
          <p className="text-muted mb-4">
            Meet the dedicated students and faculty who make ITFT Student Association possible.
          </p>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4" id="teamTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="coordinators-tab"
                data-bs-toggle="tab"
                data-bs-target="#coordinators"
                type="button"
                role="tab"
              >
                Student Coordinators
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="professors-tab"
                data-bs-toggle="tab"
                data-bs-target="#professors"
                type="button"
                role="tab"
              >
                Faculty Advisors
              </button>
            </li>
          </ul>

          <div className="tab-content" id="teamTabsContent">
            {/* Student Coordinators */}
            <div
              className="tab-pane fade show active"
              id="coordinators"
              role="tabpanel"
            >
              <div className="row g-4">
                {team.map((member) => (
                  <div className="col-md-6 col-lg-4" key={member._id}>
                    <div className="card h-100 shadow-sm">
                      <div className="bg-light" style={{ height: "250px", overflow: "hidden" }}>
                        <img
                          src={
                            member.image ||
                            "https://placehold.co/400x400?text=Profile+Photo"
                          }
                          alt={member.name}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title mb-1">{member.name}</h5>
                        <h6 className="text-primary mb-2">{member.role}</h6>
                        <p className="card-text text-muted">{member.description}</p>
                      </div>
                      <div className="card-footer bg-white border-0 d-flex gap-2 flex-wrap">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="btn btn-outline-secondary btn-sm"
                            title="Email"
                          >
                            <Mail size={16} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-secondary btn-sm"
                            title="LinkedIn"
                          >
                            <Linkedin size={16} />
                          </a>
                        )}
                        {member.gitHub && (
                          <a
                            href={member.gitHub}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-secondary btn-sm"
                            title="GitHub"
                          >
                            <Github size={16} />
                          </a>
                        )}
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professors */}
            <div className="tab-pane fade" id="professors" role="tabpanel">
              <div className="row g-4">
                {professors.map((professor) => (
                  <div className="col-md-6 col-lg-4" key={professor._id}>
                    <div className="card h-100 shadow-sm">
                      <div className="bg-light" style={{ height: "250px", overflow: "hidden" }}>
                        <img
                          src={
                            professor.image ||
                            "https://placehold.co/400x400?text=Professor+Photo"
                          }
                          alt={professor.name}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title mb-1">{professor.name}</h5>
                        <h6 className="text-primary mb-1">{professor.designation}</h6>
                        <p className="text-muted small mb-2">{professor.department}</p>
                        <p className="text-muted small mb-2">{professor.message}</p>
                        <blockquote className="blockquote mb-0">
                          <small className="text-muted fst-italic">
                            "{professor.message}"
                          </small>
                        </blockquote>
                      </div>
                      {professor.email && (
                        <div className="card-footer bg-white border-0">
                          <a
                            href={`mailto:${professor.email}`}
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                          >
                            <Mail size={16} />
                            <span>Contact</span>
                          </a>
                        </div>
                      )}
                      {professor.googleScholar && (
                        <div className="card-footer bg-white border-0">
                          <a
                            href={`mailto:${professor.googleScholar}`}
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                          >
                            <Mail size={16} />
                            <span>Contact</span>
                          </a>
                        </div>
                      )}
                      {professor.linkedIn && (
                        <div className="card-footer bg-white border-0">
                          <a
                            href={`mailto:${professor.linkedIn}`}
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                          >
                            <Mail size={16} />
                            <span>Contact</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Team;
