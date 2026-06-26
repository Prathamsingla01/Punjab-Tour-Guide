import React, { useState } from 'react';
import { ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="contact-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div className="section-header">
        <h1 className="section-title" style={{ color: 'var(--color-phulkari-pink)' }}>SOS & Tourist Support</h1>
        <p className="section-subtitle">Connect with verified state tourism agencies or trigger an immediate simulated emergency broadcast.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-5)' }}>
        {/* Emergencies info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-4)', border: '2px solid var(--color-phulkari-pink)', background: 'rgba(194, 24, 91, 0.02)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-phulkari-pink)', marginBottom: 'var(--space-2)' }}>
              <ShieldAlert size={20} />
              <span>SOS EMERGENCY CALL</span>
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              If you require immediate medical attention, police assistance, or highway support within Punjab, call the line below immediately.
            </p>
            <a href="tel:18001802111" className="sos-footer-btn" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
              Call 1800-180-2111
            </a>
          </div>

          <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
            <h3>Tourism Office</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="var(--color-mustard)" />
                <span>Helpline: +91 172-2704581</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="var(--color-mustard)" />
                <span>info@punjab.tour</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="var(--color-mustard)" />
                <span>Sector 22, Chandigarh, 160022</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Messaging form */}
        <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
          <h3>Send a Message</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Message</label>
              <textarea 
                rows="4" 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
            <button type="submit" className="login-nav-btn" style={{ padding: '10px' }}>
              Send Message
            </button>
          </form>
          {sent && <p style={{ color: 'var(--color-green)', fontSize: 'var(--text-sm)', marginTop: '12px' }}>Your message has been sent successfully!</p>}
        </div>
      </div>
    </div>
  );
};

export default Contact;
