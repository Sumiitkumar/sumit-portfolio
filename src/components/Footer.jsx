import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <>
      <section className="social-section">
        <div className="container">
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Sumit Kumar. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
