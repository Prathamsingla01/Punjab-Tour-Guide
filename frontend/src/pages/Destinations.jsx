import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Accessibility, Clock, Eye } from 'lucide-react';
import { getDestinations } from '../services/api';

const Destinations = () => {
  const [searchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(searchParamQuery);
  const [filterAccessibility, setFilterAccessibility] = useState('All');
  const [filterCrowd, setFilterCrowd] = useState('All');
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      const data = await getDestinations(query, filterAccessibility, filterCrowd);
      setFilteredDestinations(data);
      setLoading(false);
    };
    fetchCities();
  }, [query, filterAccessibility, filterCrowd]);

  return (
    <div className="destinations-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div className="section-header">
        <h1 className="section-title">Explore Punjab Cities</h1>
        <p className="section-subtitle">Browse through the historical centers of Punjab, filtering by accessibility services and crowd metrics.</p>
      </div>

      {/* Filter and Search Panel */}
      <div className="glass-panel" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
          {/* Text Search */}
          <div style={{ flex: '1 1 300px', display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: 'var(--space-2) var(--space-3)' }}>
            <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: 'var(--space-2)' }} />
            <input 
              type="text" 
              placeholder="Search cities..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', flex: '1' }}
            />
          </div>

          {/* Access Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Accessibility size={18} style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={filterAccessibility} 
              onChange={(e) => setFilterAccessibility(e.target.value)}
              style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <option value="All">All Accessibility</option>
              <option value="Wheelchair Friendly">Wheelchair Friendly</option>
              <option value="Limited">Limited</option>
              <option value="Not Accessible">Not Accessible</option>
            </select>
          </div>

          {/* Crowd Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={18} style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={filterCrowd} 
              onChange={(e) => setFilterCrowd(e.target.value)}
              style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <option value="All">All Crowd Levels</option>
              <option value="Low">Low Crowd</option>
              <option value="Medium">Medium Crowd</option>
              <option value="High">High Crowd</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid-cols-3">
        {filteredDestinations.map((city) => (
          <div key={city.id} className="destination-card glass-panel-hover">
            <div className="card-img-wrapper">
              <img src={city.image} alt={city.name} className="card-img" />
              <div className="card-gradient-overlay" />
              <div className="card-content">
                <span className="card-meta">
                  <span>{city.bestTime}</span>
                  <span>&bull;</span>
                  <span>{city.avgTime}</span>
                </span>
                <h3 className="card-title">{city.name}</h3>
                <p style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginBottom: 'var(--space-2)' }}>{city.tagline}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                    {city.accessibility}
                  </span>
                  <a href={`/destinations/${city.id}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)', color: 'var(--color-mustard)', fontWeight: '600' }}>
                    <Eye size={14} />
                    <span>View Details</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
