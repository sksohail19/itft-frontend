import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "ITFT Student Association - Contact Us";
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit with EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAIL_JS_SERVICE_ID,   // replace with your EmailJS service ID
        process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY,  // replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID   // replace with your EmailJS public key
      );

      setStatus({
        type: "success",
        message: "Thank you for your message. We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus({
        type: "error",
        message: "There was a problem sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-light py-5">
        <div className="container">
          <h1 className="fw-bold mb-3">Contact Us</h1>
          <p className="text-muted mb-4">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <div className="row g-4">
            {/* Contact Info */}
            <div className="col-lg-4">
              <div className="card mb-3">
                <div className="card-body d-flex align-items-center gap-3">
                  <i className="bi bi-envelope-fill fs-4 text-primary"></i>
                  <div>
                    <h6 className="fw-semibold">Email</h6>
                    <a href="mailto:contact@itft.edu" className="text-primary">
                      itft2026@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="card mb-3">
                <div className="card-body d-flex align-items-center gap-3">
                  <i className="bi bi-telephone-fill fs-4 text-primary"></i>
                  <div>
                    <h6 className="fw-semibold">Phone</h6>
                    <a href="tel:+919550279051" className="text-primary">
                      +91 95502 79051
                    </a>
                  </div>
                </div>
              </div>

              <div className="card mb-3">
                <div className="card-body d-flex align-items-center gap-3">
                  <i className="bi bi-geo-alt-fill fs-4 text-primary"></i>
                  <div>
                    <h6 className="fw-semibold">Location</h6>
                    <p className="text-muted small mb-0">
                      D-Block, 4th Floor <br />
                      Kallam Haranadhareddy Institute of Technology, Guntur
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header fw-bold">Active Hours</div>
                <div className="card-body small">
                  <p className="mb-1">
                    <strong>Monday - Saturday:</strong> 10:00 AM - 4:00 PM
                  </p>
                  <p className="mb-0">
                    <strong>Sunday:</strong> Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header fw-bold">Send us a message</div>
                <div className="card-body">
                  {status && (
                    <div
                      className={`alert ${
                        status.type === "success"
                          ? "alert-success"
                          : "alert-danger"
                      }`}
                    >
                      {status.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        placeholder="What is this regarding?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        minLength={5}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        className="form-control"
                        placeholder="Your message..."
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        minLength={10}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
