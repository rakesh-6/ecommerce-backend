import '../styles/Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>Your trusted online shopping destination</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/#products">Products</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@ecommerce.com</p>
            <p>Phone: +1-800-123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Ecommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
