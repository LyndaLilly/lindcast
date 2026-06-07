import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">

        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-box">
              ₿
            </div>

            <div>
              <h3 className="footer-logo">
                Crypto Predict
              </h3>

              <p className="footer-text2">
                Predict market direction, compete with traders,
                climb the leaderboard and earn rewards.
              </p>
            </div>
          </div>

          <div className="footer-nav">
            
             <div className="footer-column">
              <h6>Legal</h6>

              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link">
                Terms
              </Link>
              <Link to="/disclaimer" className="footer-link">
                Disclaimer
              </Link  >
            </div>

            {/* <div className="footer-column">
              <h6>Platform</h6>

              <a href="#">Markets</a>
              <a href="#">Leaderboard</a>
              <a href="#">Challenges</a>
            </div> */}

            <div className="footer-column">
              <h6>Company</h6>

              
              <a href="/contact">Contact</a>
              <a href="mailto:support@cryptopredict.com">Support</a>
            </div>

           
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Crypto Predict. All rights reserved.
          </p>

          <div className="footer-social">
            <a href="#">𝕏</a>
            <a href="#">Telegram</a>
            <a href="#">Discord</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;