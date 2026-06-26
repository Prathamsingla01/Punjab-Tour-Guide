import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';
import { Landmark, Compass, Award, Wifi, Shield, DollarSign } from 'lucide-react';

const Hotels = () => {
  const { token } = useAuth();
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [bookingStatus, setBookingStatus] = useState({});

  const handleBookHotel = async (hotelId, price) => {
    if (!token) {
      alert('Please Sign In to book stays.');
      return;
    }
    setBookingStatus(prev => ({ ...prev, [hotelId]: 'booking' }));
    try {
      const res = await createBooking(token, {
        hotelId,
        checkIn: '2026-07-15',
        checkOut: '2026-07-18',
        amount: price * 3
      });
      setBookingStatus(prev => ({ ...prev, [hotelId]: 'booked' }));
      alert(res.message || 'Hotel booked successfully!');
    } catch (err) {
      setBookingStatus(prev => ({ ...prev, [hotelId]: 'failed' }));
      alert(err.message || 'Booking failed');
    }
  };

  const hotelsData = [
    {
      id: 1,
      name: 'Taj Swarna',
      city: 'Amritsar',
      price: 9500,
      rating: 4.8,
      amenities: ['Pool', 'WiFi', 'Parking', 'Breakfast'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500'
    },
    {
      id: 2,
      name: 'Hyatt Regency',
      city: 'Amritsar',
      price: 7500,
      rating: 4.6,
      amenities: ['Pool', 'WiFi', 'Breakfast'],
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=500'
    },
    {
      id: 3,
      name: 'The Lalit Chandigarh',
      city: 'Chandigarh',
      price: 8500,
      rating: 4.7,
      amenities: ['Pool', 'WiFi', 'Parking', 'Breakfast'],
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=500'
    },
    {
      id: 4,
      name: 'Welcomhotel by ITC',
      city: 'Amritsar',
      price: 6000,
      rating: 4.5,
      amenities: ['WiFi', 'Parking', 'Breakfast'],
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=500'
    }
  ];

  const filteredHotels = hotelsData.filter((hotel) => {
    const matchesPrice = filterPrice === 'All' || 
      (filterPrice === 'Budget' && hotel.price < 5000) ||
      (filterPrice === 'Mid' && hotel.price >= 5000 && hotel.price <= 8000) ||
      (filterPrice === 'Luxury' && hotel.price > 8000);
      
    const matchesRating = filterRating === 'All' || hotel.rating >= parseFloat(filterRating);
    
    return matchesPrice && matchesRating;
  });

  return (
    <div className="hotels-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div className="section-header">
        <h1 className="section-title">Stay in Punjab</h1>
        <p className="section-subtitle">Find premium, verified accommodation closest to cultural centers and transport loops.</p>
      </div>

      {/* Filters */}
      <div className="glass-panel" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px', fontWeight: '600' }}>Price Band</label>
            <select 
              value={filterPrice} 
              onChange={(e) => setFilterPrice(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <option value="All">All Prices</option>
              <option value="Budget">Budget (&lt; ₹5,000)</option>
              <option value="Mid">Mid-Range (₹5,000 - ₹8,000)</option>
              <option value="Luxury">Luxury (&gt; ₹8,000)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px', fontWeight: '600' }}>Minimum Rating</label>
            <select 
              value={filterRating} 
              onChange={(e) => setFilterRating(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <option value="All">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.7">4.7+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid-cols-3">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="glass-panel glass-panel-hover" style={{ overflow: 'hidden' }}>
            <div style={{ height: '200px', position: 'relative' }}>
              <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--color-mustard)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                ₹{hotel.price} / night
              </div>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{hotel.city}</span>
              <h3 style={{ fontSize: 'var(--text-lg)', margin: '4px 0' }}>{hotel.name}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>Rating: {hotel.rating} ★</p>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                {hotel.amenities.map((am, i) => (
                  <span key={i} style={{ fontSize: '10px', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {am === 'WiFi' && <Wifi size={10} />}
                    {am === 'Pool' && <Award size={10} />}
                    {am === 'Parking' && <Landmark size={10} />}
                    <span>{am}</span>
                  </span>
                ))}
              </div>

              <button 
                onClick={() => handleBookHotel(hotel.id, hotel.price)}
                disabled={bookingStatus[hotel.id] === 'booking'}
                className="login-nav-btn" 
                style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
              >
                {bookingStatus[hotel.id] === 'booking' ? 'Booking...' : 
                 bookingStatus[hotel.id] === 'booked' ? 'Booked!' : 'Book Accommodation'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
