import { Link } from "react-router-dom";
const AnnouncementsBanner = () => {
  return (
    <section className="bg-primary text-white py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          {/* Left Side */}
          <div className="col-lg-8">
            <h2 className="h3 fw-bold mb-3">Stay Updated with ITFT Announcements</h2>
            <p className="mb-0">
              Get the latest news, updates, and important information from the ITFT Student Association. 
              Stay informed about upcoming events, opportunities, and deadlines.
            </p>
          </div>

          {/* Right Side */}
          <div className="col-lg-4 text-lg-end">
            <Link href="/announcements" className="btn btn-light fw-semibold">
              View Announcements
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsBanner;
