import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-content">
        {/* <div className="footer-section">
          <h2>About Us</h2>
          <p>
            We are a company committed to providing excellent service. Lorem ipsum dolor sit amet consectetur
            adipisicing elit.
          </p>
        </div> */}

        <div className="footer-section">
          <h2>Follow Me</h2>
          <Link to="https://www.facebook.com/Varingagardet" target="_blank" rel="noopener noreferrer">
            Facebook
          </Link>
          <Link to="https://varingasagan.com/" target="_blank" rel="noopener noreferrer">
            Varingasagan
          </Link>
          <Link to="https://www.linkedin.com/in/leif-selander-792b7624/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Link>
        </div>

        <div className="footer-section">
          <h2>Contact</h2>
          <p>leif.selander@gmail.com</p>
        </div>

        <div className="footer-section">
          <h2>Quick Links</h2>
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/audioBooks">Audiobooks</Link>
          <Link to="/about">About</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Varingasagan. All rights reserved.</p>
      </div>
    </div>
  );
}
