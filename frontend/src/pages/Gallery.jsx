import React from 'react';
import { Camera, Image } from 'lucide-react';

const Gallery = () => {
  const images = [
    { url: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=600', title: 'Golden Temple' },
    { url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600', title: 'Chandigarh Sukhna' },
    { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a52b?q=80&w=600', title: 'Qila Mubarak Patiala' },
    { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600', title: 'Jagatjit Palace Kapurthala' }
  ];

  return (
    <div className="gallery-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div className="section-header">
        <h1 className="section-title">Punjab Media Gallery</h1>
        <p className="section-subtitle">Experience 360 views and high-quality photography from Punjab's heritage hubs.</p>
      </div>

      <div className="grid-cols-3">
        {images.map((img, i) => (
          <div key={i} className="glass-panel glass-panel-hover" style={{ overflow: 'hidden' }}>
            <div style={{ height: '240px', position: 'relative' }}>
              <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="card-gradient-overlay" />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', color: '#FFFFFF', zIndex: '2' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)', color: '#FFFFFF' }}>
                  <Camera size={14} />
                  <span>{img.title}</span>
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
