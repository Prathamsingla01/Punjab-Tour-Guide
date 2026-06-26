import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, ShieldAlert, Award, Camera, Star,
  Accessibility, HelpCircle, ThermometerSun, Users, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { getDestinationDetails, getDestinationReviews, submitReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Map from '../components/Map/Map';

const DestinationDetails = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [city, setCity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review Form state
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitErr, setSubmitErr] = useState('');

  const fetchCityData = async () => {
    try {
      const cityData = await getDestinationDetails(id);
      setCity(cityData);
      
      const reviewsData = await getDestinationReviews(id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to retrieve destination details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitMsg('');
    setSubmitErr('');

    try {
      const res = await submitReview(token, id, { comment, rating });
      setSubmitMsg(res.message || 'Review submitted! It will appear once approved by an admin.');
      setComment('');
      setRating(5);
    } catch (error) {
      setSubmitErr(error.message || 'Failed to submit review.');
    }
  };

  if (loading || !city) {
    return <div className="flex-center" style={{ height: '80vh', marginTop: '72px' }}>Loading City Details...</div>;
  }

  // Calculate Average Rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="destination-details-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: 'var(--space-6)' }}>
        <div style={{ height: '350px', position: 'relative' }}>
          <img src={city.image} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="card-gradient-overlay" />
          <div style={{ position: 'absolute', bottom: 'var(--space-4)', left: 'var(--space-4)', zIndex: '2', color: '#FFFFFF' }}>
            <h1 style={{ color: '#FFFFFF', fontSize: 'var(--text-4xl)' }}>{city.name}</h1>
            <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9 }}>{city.tagline}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-5)' }}>
        {/* Main Content Info */}
        <div>
          {/* Overview */}
          <section className="glass-panel" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>Overview</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{city.description}</p>
            <h3 style={{ fontSize: 'var(--text-base)', marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>History</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{city.history}</p>
          </section>

          {/* Quick Metrics */}
          <section className="glass-panel" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>Key Metrics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Best Time</span>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>{city.bestTime}</p>
              </div>
              <div style={{ padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Avg Time Needed</span>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>{city.avgTime}</p>
              </div>
              <div style={{ padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Crowd Level</span>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>{city.crowdLevel}</p>
              </div>
              <div style={{ padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Accessibility</span>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-green)' }}>{city.accessibility}</p>
              </div>
            </div>
          </section>

          {/* What to Carry / What to Avoid */}
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-green)', marginBottom: 'var(--space-2)' }}>
                <CheckCircle size={18} />
                <span>Things to Carry</span>
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{city.carry_items}</p>
            </div>
            <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-phulkari-pink)', marginBottom: 'var(--space-2)' }}>
                <AlertTriangle size={18} />
                <span>Things to Avoid</span>
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{city.avoid_items}</p>
            </div>
          </section>

          {/* FAQs */}
          <section className="glass-panel" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>FAQs</h2>
            {city.faqs && city.faqs.map((faq, i) => (
              <div key={i} style={{ marginBottom: 'var(--space-3)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
                  <HelpCircle size={16} style={{ color: 'var(--color-mustard)' }} />
                  <span>{faq.q}</span>
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', paddingLeft: '24px', marginTop: '4px' }}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* Dynamic Tourist Reviews & Feedback */}
          <section className="glass-panel" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Visitor Reviews</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={18} fill="var(--color-mustard)" stroke="var(--color-mustard)" />
                <strong style={{ fontSize: 'var(--text-lg)' }}>{averageRating}</strong>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>({reviews.length} reviews)</span>
              </div>
            </div>

            {/* List Reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: 'var(--text-sm)' }}>@{rev.user_name}</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            size={12} 
                            fill={s <= rev.rating ? 'var(--color-mustard)' : 'none'} 
                            stroke="var(--color-mustard)"
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '6px' }}>"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  No reviews posted for this destination yet. Be the first to share your experience!
                </p>
              )}
            </div>

            {/* Post Review Form */}
            {token ? (
              <form onSubmit={handleReviewSubmit} style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>Share Your Experience</h3>
                
                {submitMsg && <div style={{ color: 'var(--color-green)', fontSize: 'var(--text-xs)', marginBottom: '8px' }}>{submitMsg}</div>}
                {submitErr && <div style={{ color: 'var(--color-phulkari-pink)', fontSize: 'var(--text-xs)', marginBottom: '8px' }}>{submitErr}</div>}

                {/* Stars Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Your Rating:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                      >
                        <Star 
                          size={18} 
                          fill={star <= (hoverRating || rating) ? 'var(--color-mustard)' : 'none'} 
                          stroke="var(--color-mustard)"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Write a brief comment about accessibility, weather, safety..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }}
                    required
                  />
                  <button type="submit" className="login-nav-btn" style={{ padding: '8px 16px', fontSize: 'var(--text-xs)' }}>
                    Submit Review
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Please <Link to="/login" style={{ color: 'var(--color-phulkari-pink)', fontWeight: '600' }}>Login</Link> to share a travel review and earn loyalty points!
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Nearby Emergencies */}
          <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-phulkari-pink)', marginBottom: 'var(--space-3)' }}>
              <ShieldAlert size={18} />
              <span>Nearby Emergency</span>
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)' }}>
              <li><strong>Hospital:</strong> {city.hospital_nearby}</li>
              <li><strong>Police Station:</strong> {city.police_nearby}</li>
              <li><strong>Petrol Station:</strong> {city.petrol_nearby}</li>
              <li><strong>ATM:</strong> {city.atm_nearby}</li>
            </ul>
          </div>

          {/* Local Tips & Fun Facts */}
          <div className="glass-panel" style={{ padding: 'var(--space-4)', background: 'linear-gradient(135deg, rgba(255,184,0,0.05), rgba(194,24,91,0.05))' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-mustard)', marginBottom: 'var(--space-2)' }}>
              <Award size={18} />
              <span>Fun Fact</span>
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>{city.fun_facts}</p>
            
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-green)', marginBottom: 'var(--space-2)' }}>
              <Camera size={18} />
              <span>Photography Tip</span>
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{city.tips}</p>
          </div>

          {/* Interactive Map */}
          <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-mustard)', marginBottom: 'var(--space-2)' }}>
              <MapPin size={18} />
              <span>Interactive Map</span>
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Explore nearby attractions (yellow), stays (green), eateries (pink), and emergency services (red).
            </p>
            <Map 
              center={[city.coordinates_lat || 31.6200, city.coordinates_lng || 74.8765]} 
              markers={[
                { type: 'attraction', name: city.name, coords: [city.coordinates_lat || 31.6200, city.coordinates_lng || 74.8765], description: city.tagline },
                { type: 'emergency', name: 'Hospital Helpline', coords: [(city.coordinates_lat || 31.6200) + 0.004, (city.coordinates_lng || 74.8765) + 0.004], description: city.hospital_nearby },
                { type: 'emergency', name: 'Police Helpline', coords: [(city.coordinates_lat || 31.6200) - 0.004, (city.coordinates_lng || 74.8765) - 0.004], description: city.police_nearby },
                ...(city.hotels || []).map((h, i) => ({
                  type: 'hotel',
                  name: h.name,
                  coords: [(city.coordinates_lat || 31.6200) + 0.002 * (i + 1), (city.coordinates_lng || 74.8765) - 0.002 * (i + 1)],
                  description: `₹${h.price_per_night}/night`
                })),
                ...(city.restaurants || []).map((r, i) => ({
                  type: 'restaurant',
                  name: r.name,
                  coords: [(city.coordinates_lat || 31.6200) - 0.002 * (i + 1), (city.coordinates_lng || 74.8765) + 0.002 * (i + 1)],
                  description: `${r.specialty} (${r.rating}★)`
                }))
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
