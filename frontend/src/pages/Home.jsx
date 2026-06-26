import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import FolkBeatsPlayer from '../components/CulturalPortal/FolkBeatsPlayer';
import { MapPin, Calendar, Sparkles, Shield, HeartHandshake, ShieldAlert } from 'lucide-react';

const Home = () => {
  const featuredCities = [
    {
      id: 1,
      name: 'Amritsar',
      tagline: 'The Spiritual Heart of Punjab',
      image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=800',
      attractionsCount: 8,
      rating: 4.9
    },
    {
      id: 2,
      name: 'Chandigarh',
      tagline: 'The Modern Planned City of Gardens',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800',
      attractionsCount: 6,
      rating: 4.7
    },
    {
      id: 3,
      name: 'Patiala',
      tagline: 'The Royal City of Heritage & Craft',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a52b?q=80&w=800',
      attractionsCount: 5,
      rating: 4.6
    }
  ];

  return (
    <div className="home-page animate-fade-in-up">
      {/* Hero Banner */}
      <Hero />

      {/* Value Proposition Grid */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Why Visit Punjab?</h2>
          <p className="section-subtitle">Discover the unforgettable warmth of local dhabas, historical forts, and sacred landscapes.</p>
        </div>
        <div className="grid-cols-3">
          <div className="glass-panel p-4 flex-col text-center" style={{ padding: 'var(--space-4)' }}>
            <div className="flex-center" style={{ color: 'var(--color-mustard)', marginBottom: 'var(--space-2)' }}>
              <HeartHandshake size={32} />
            </div>
            <h3>Legendary Hospitality</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
              Experience "Sewa" (selfless service) and open community kitchens (Langar) that feed over 100,000 people daily.
            </p>
          </div>
          <div className="glass-panel p-4 flex-col text-center" style={{ padding: 'var(--space-4)' }}>
            <div className="flex-center" style={{ color: 'var(--color-phulkari-pink)', marginBottom: 'var(--space-2)' }}>
              <Sparkles size={32} />
            </div>
            <h3>Cultural Vitality</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
              Hear the vibrant beats of Bhangra, explore colourful Phulkari textiles, and witness energetic seasonal fairs.
            </p>
          </div>
          <div className="glass-panel p-4 flex-col text-center" style={{ padding: 'var(--space-4)' }}>
            <div className="flex-center" style={{ color: 'var(--color-green)', marginBottom: 'var(--space-2)' }}>
              <Shield size={32} />
            </div>
            <h3>Smart Tour Safety</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
              Access direct emergency SOS links, verified weather guides, and automated offline phrase translation calculators.
            </p>
          </div>
        </div>
      </section>

      {/* Folk Beats Synthesizer Section */}
      <section className="section container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h2 className="section-title">Punjab Folk Beats</h2>
          <p className="section-subtitle">Interact with our real-time synthesizer to create traditional rhythmic loops.</p>
        </div>
        <FolkBeatsPlayer />
      </section>

      {/* Featured Cities Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Explore historical forts, royal gardens, and heritage spaces in these key cities.</p>
          </div>
          
          <div className="grid-cols-3">
            {featuredCities.map((city) => (
              <Link to={`/destinations/${city.id}`} key={city.id} className="destination-card">
                <div className="card-img-wrapper">
                  <img src={city.image} alt={city.name} className="card-img" />
                  <div className="card-gradient-overlay" />
                  <div className="card-content">
                    <span className="card-meta">
                      <MapPin size={12} />
                      <span>{city.attractionsCount} Attractions</span>
                      <span>&bull;</span>
                      <span>{city.rating} ★</span>
                    </span>
                    <h3 className="card-title">{city.name}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>{city.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="flex-center" style={{ marginTop: 'var(--space-6)' }}>
            <Link to="/destinations" className="login-nav-btn">
              View All Cities
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Planner Promo Banner */}
      <section className="section container">
        <div className="glass-panel" style={{ padding: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-3)' }}>AI-Powered Custom Itinerary Planner</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Specify your travel budget, group size, kids or senior citizens attendance, and travel style. Our algorithms map out your optimal day-by-day morning, afternoon, and evening agenda matching nearby restaurants and hotels.
            </p>
            <Link to="/planner" className="login-nav-btn">
              Generate Plan Now
            </Link>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 200 200" width="100%" height="160" style={{ maxWidth: '240px' }}>
              <defs>
                <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-mustard)" />
                  <stop offset="100%" stopColor="var(--color-phulkari-pink)" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="180" height="180" rx="20" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="1" />
              <path d="M40 100 Q100 30 160 100 T40 100" fill="none" stroke="url(#planeGrad)" strokeWidth="3" strokeDasharray="5,5" />
              <circle cx="40" cy="100" r="8" fill="var(--color-green)" />
              <circle cx="160" cy="100" r="8" fill="var(--color-phulkari-pink)" />
              <circle cx="100" cy="65" r="8" fill="var(--color-mustard)" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
