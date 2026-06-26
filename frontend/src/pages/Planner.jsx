import React, { useState } from 'react';
import { 
  Sparkles, Compass, ShieldAlert, 
  MapPin, CheckCircle, Navigation, Users, DollarSign 
} from 'lucide-react';
import { postPlannerItinerary } from '../services/api';

const Planner = () => {
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('Mid');
  const [travelStyle, setTravelStyle] = useState('Religious');
  const [hasKids, setHasKids] = useState(false);
  const [hasSeniors, setHasSeniors] = useState(false);
  const [transport, setTransport] = useState('Private');
  
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const data = await postPlannerItinerary({
        days,
        budget,
        travelStyle,
        hasKids,
        hasSeniors,
        transport
      });
      setItinerary(data);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div className="section-header">
        <h1 className="section-title">AI Trip Planner</h1>
        <p className="section-subtitle">Define your travel constraints and let our smart rules-engine structure your optimal daily schedule.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-5)' }}>
        {/* Input Panel */}
        <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--color-mustard)' }} />
            <span>Travel Parameters</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: '600', marginBottom: '4px' }}>Duration (Days)</label>
              <select value={days} onChange={(e) => setDays(parseInt(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <option value={1}>1 Day (Express Tour)</option>
                <option value={3}>3 Days (Core Cities)</option>
                <option value={5}>5 Days (Complete Punjab)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: '600', marginBottom: '4px' }}>Budget Bracket</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <option value="Budget">Budget (₹2,500/day)</option>
                <option value="Mid">Mid-Range (₹6,000/day)</option>
                <option value="Luxury">Luxury (₹15,000/day)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: '600', marginBottom: '4px' }}>Travel Style</label>
              <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <option value="Religious">Spiritual & Devotional</option>
                <option value="Food">Culinary Explorer</option>
                <option value="History">Forts & Heritage</option>
                <option value="Nature">Rivers & Gardens</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px', margin: '8px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)' }}>
                <input type="checkbox" checked={hasKids} onChange={(e) => setHasKids(e.target.checked)} />
                <span>Travelling with Kids</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)' }}>
                <input type="checkbox" checked={hasSeniors} onChange={(e) => setHasSeniors(e.target.checked)} />
                <span>Senior Citizens</span>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: '600', marginBottom: '4px' }}>Transport Preference</label>
              <select value={transport} onChange={(e) => setTransport(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <option value="Public">Public Transport (Train, Buses)</option>
                <option value="Private">Private Cab / Personal Vehicle</option>
              </select>
            </div>

            <button 
              onClick={generateItinerary} 
              disabled={loading}
              className="login-nav-btn" 
              style={{ width: '100%', marginTop: 'var(--space-3)' }}
            >
              {loading ? 'Generating Itinerary...' : 'Generate Custom Itinerary'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div>
          {itinerary ? (
            <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h2>Generated Plan Details</h2>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Style: <strong>{travelStyle}</strong> &bull; Transport: <strong>{transport}</strong></span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Estimated Cost</span>
                  <p style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-green)' }}>₹{itinerary.cost}</p>
                </div>
              </div>

              {/* Day-by-Day Timeline */}
              {Object.keys(itinerary.timeline).slice(0, days).map((dayKey) => {
                const day = itinerary.timeline[dayKey];
                return (
                  <div key={dayKey} style={{ borderLeft: '3px solid var(--color-mustard)', paddingLeft: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Day {dayKey}</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)' }}>
                      <li><strong>🌅 Morning:</strong> {day.morning}</li>
                      <li><strong>☀️ Afternoon:</strong> {day.afternoon}</li>
                      <li><strong>🌇 Evening:</strong> {day.evening}</li>
                    </ul>
                  </div>
                );
              })}

              {/* Sidebar Quick details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-5)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)' }}>
                <div>
                  <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Packing Checklist</h4>
                  <ul style={{ fontSize: 'var(--text-xs)', listStyle: 'none', marginTop: '6px' }}>
                    {itinerary.packing.map((pack, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <CheckCircle size={10} color="var(--color-green)" /> {pack}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Travel Info</h4>
                  <p style={{ fontSize: 'var(--text-xs)', margin: '4px 0' }}>🏨 <strong>Stay:</strong> {itinerary.hotel}</p>
                  <p style={{ fontSize: 'var(--text-xs)', margin: '4px 0' }}>🚕 <strong>Distance:</strong> {itinerary.distance}</p>
                  <p style={{ fontSize: 'var(--text-xs)', margin: '4px 0', color: 'var(--color-phulkari-pink)' }}>⚠️ <strong>SOS:</strong> 1800-180-2111</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Compass size={40} style={{ margin: '0 auto var(--space-3) auto', color: 'var(--color-mustard)' }} />
              <h2>No Itinerary Generated Yet</h2>
              <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>Select your preferences on the left pane and hit the generate button to view your custom visual itinerary timeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planner;
