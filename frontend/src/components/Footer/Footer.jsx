import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneCall, Mail, MapPin, Send, 
  Heart, Facebook, Twitter, Instagram, ShieldAlert 
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer glass-panel">
      <div className="container footer-content-grid">
        {/* Column 1: Brand Info */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <span className="logo-dome">ੴ</span>
            <div className="logo-text">
              <span className="logo-title">Punjab</span>
              <span className="logo-subtitle">Tour Guide</span>
            </div>
          </Link>
          <p className="brand-description">
            Experience the rich heritage, vibrant colors, legendary hospitality, and spiritual soul of Punjab. Your complete smart guide to exploring the land of five rivers.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col links-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links-list">
            <li><Link to="/destinations">Explore Destinations</Link></li>
            <li><Link to="/planner">Custom Itinerary Planner</Link></li>
            <li><Link to="/hotels">Book Accommodation</Link></li>
            <li><Link to="/food">Culinary Experience</Link></li>
            <li><Link to="/dashboard">Travel Profile</Link></li>
          </ul>
        </div>

        {/* Column 3: Emergency & Contact */}
        <div className="footer-col contact-col">
          <h4 className="footer-col-title">Emergency Helpline</h4>
          <div className="emergency-sos-bar">
            <Link to="/contact" className="sos-footer-btn">
              <ShieldAlert size={18} />
              <span>SOS EMERGENCY CALL</span>
            </Link>
          </div>
          <ul className="footer-contact-details">
            <li>
              <PhoneCall size={14} />
              <span>Tourist Helpline: 1800-180-2111</span>
            </li>
            <li>
              <Mail size={14} />
              <span>support@punjab.tour</span>
            </li>
            <li>
              <MapPin size={14} />
              <span>Punjab Tourism Board, Chandigarh</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="footer-col newsletter-col">
          <h4 className="footer-col-title">Join Newsletter</h4>
          <p className="newsletter-text">Subscribe to get seasonal festival announcements, mela guides, and customized travel itineraries.</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              aria-label="Email subscription"
            />
            <button type="submit" aria-label="Subscribe font">
              <Send size={16} />
            </button>
          </form>
          {subscribed && <span className="newsletter-status animate-fade-in-up">Subscribed! Check your inbox soon.</span>}
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-copyright">
        <div className="container flex-center copyright-container">
          <span>&copy; {new Date().getFullYear()} Punjab Tour Guide. Built with <Heart size={12} color="red" style={{ fill: 'red' }} /> for the land of five rivers.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
