const HeroSection = () => {
  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Side - Text */}
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold mb-4">
              Welcome to ITFT Student Association
            </h1>
            <p className="lead text-muted mb-4">
              Empowering students to explore, innovate, and excel in technology
              and future domains. Join us to be part of a community that fosters
              learning, collaboration, and growth.
            </p>
            <div className="d-flex gap-3">
              <a href="/events" className="btn btn-primary btn-lg">
                Explore Events
              </a>
              <a href="/team" className="btn btn-outline-primary btn-lg">
                Meet the Team
              </a>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="col-lg-6 text-center">
            <div className="position-relative rounded overflow-hidden shadow-lg d-flex justify-content-center align-items-center" style={{ aspectRatio: '1 / 1', backgroundColor: '#fff', transition: 'transform 0.3s' }}>
              <img
                src="INFORMATION TECHNOLOGY FUTURE TECHNOCRACTS.png"
                alt="Students collaborating at ITFT"
                className="img-fluid"
                style={{ maxWidth: '70%', height: 'auto', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.05)' }}></div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
