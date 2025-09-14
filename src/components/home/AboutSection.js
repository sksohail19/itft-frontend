import groupImage from "../../assests/ITFT_Group_Image.jpg";
const AboutSection = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column */}
          <div className="col-md-6">
            <h2 className="h2 fw-bold mb-4">About ITFT Student Association</h2>
            <div className="text-muted mb-4">
              <p>
                The Imaginary Tech & Future Technologies (ITFT) Student Association is a dynamic community of forward-thinking students passionate about innovation and technology.
              </p>
              <p>
                Founded in 2020, our association brings together students from diverse backgrounds with a common interest in exploring emerging technologies and developing practical skills that prepare them for future careers.
              </p>
              <p>
                Through workshops, competitions, guest lectures, and collaborative projects, we create opportunities for members to grow professionally while building meaningful connections with peers and industry professionals.
              </p>
            </div>

            <div className="row text-center g-3">
              <div className="col-6 col-md-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <div className="h3 fw-bold text-primary">500+</div>
                  <div className="small text-muted">Active Members</div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <div className="h3 fw-bold text-primary">50+</div>
                  <div className="small text-muted">Events Yearly</div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <div className="h3 fw-bold text-primary">15+</div>
                  <div className="small text-muted">Tech Partners</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6 position-relative">
            <div className="ratio ratio-1x1 bg-light rounded overflow-hidden">
              <img
                src={groupImage}
                alt="ITFT Student Association Members"
                className="w-100 h-100 "
              />
            </div>
            <div className="position-absolute bottom-0 end-0 translate-middle bg-primary bg-opacity-10 rounded" style={{ width: "120px", height: "120px", zIndex: -1 }}></div>
            <div className="position-absolute top-0 start-0 translate-middle bg-primary bg-opacity-10 rounded" style={{ width: "120px", height: "120px", zIndex: -1 }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
