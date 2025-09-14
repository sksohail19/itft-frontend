import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5">
      <div className="container">
        <div className="row g-4">
          {/* About Section */}
          <div className="col-lg-6">
            <h3 className="h5 fw-bold mb-3">ITFT Student Association</h3>
            <p className="text-light small mb-3">
              Connecting students passionate about technology and innovation.
              We provide opportunities for learning, networking, and developing
              skills in various tech domains.
            </p>
            <div className="d-flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <Twitter size={20} />
                <span className="visually-hidden">Twitter</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <Facebook size={20} />
                <span className="visually-hidden">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <Instagram size={20} />
                <span className="visually-hidden">Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <Linkedin size={20} />
                <span className="visually-hidden">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h3 className="h6 fw-semibold mb-3">Quick Links</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/events" className="text-light text-decoration-none">
                  Events
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/results" className="text-light text-decoration-none">
                  Results
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/team" className="text-light text-decoration-none">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3">
            <h3 className="h6 fw-semibold mb-3">Contact Us</h3>
            <address className="small text-light mb-0">
              <p className="mb-1">ITFT Student Association</p>
              <p className="mb-1">D-Block, 4th Floor</p>
              <p className="mb-1">Kallam Haranadhareddy Institute of Technology, Guntur</p>
              <p className="mb-1">itft2026@gmail.com</p>
              <p className="mb-0">+91 95502 79051</p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top border-secondary mt-4 pt-3">
          <p className="text-center text-light small mb-0">
            &copy; {new Date().getFullYear()} ITFT Student Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
