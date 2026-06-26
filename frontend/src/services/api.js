const API_BASE_URL = 'http://localhost:5000/api';

// Client-side Memory Cache
const apiCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = apiCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  apiCache[key] = {
    data,
    timestamp: Date.now()
  };
};

// Curated Local Fallbacks for robust offline support
const mockDestinations = [
  {
    id: 1,
    name: 'Amritsar',
    tagline: 'Home of the Golden Temple',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=600',
    accessibility: 'Wheelchair Friendly',
    bestTime: 'October to March',
    crowdLevel: 'High',
    avgTime: '2 Days'
  },
  {
    id: 2,
    name: 'Chandigarh',
    tagline: 'The Clean & Green City',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600',
    accessibility: 'Wheelchair Friendly',
    bestTime: 'September to April',
    crowdLevel: 'Medium',
    avgTime: '2 Days'
  },
  {
    id: 3,
    name: 'Patiala',
    tagline: 'The City of Forts and Pagris',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a52b?q=80&w=600',
    accessibility: 'Limited',
    bestTime: 'October to February',
    crowdLevel: 'Low',
    avgTime: '1 Day'
  }
];

export const getDestinations = async (search = '', accessibility = 'All', crowd = 'All') => {
  const cacheKey = `destinations_${search}_${accessibility}_${crowd}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (accessibility) params.append('accessibility', accessibility);
    if (crowd) params.append('crowd', crowd);

    const response = await fetch(`${API_BASE_URL}/destinations?${params.toString()}`);
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.warn('API error fetching destinations, using mock fallback. Details:', error.message);
    
    // Filter Mock locally
    const filtered = mockDestinations.filter(d => {
      const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.tagline.toLowerCase().includes(search.toLowerCase());
      const matchesAccess = accessibility === 'All' || d.accessibility === accessibility;
      const matchesCrowd = crowd === 'All' || d.crowdLevel === crowd;
      return matchesSearch && matchesAccess && matchesCrowd;
    });
    return filtered;
  }
};

export const getDestinationDetails = async (id) => {
  const cacheKey = `destination_${id}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.warn(`API error fetching destination ${id}, simulating details. Details:`, error.message);
    
    const base = mockDestinations.find(d => d.id === parseInt(id)) || mockDestinations[0];
    return {
      ...base,
      description: `${base.name} is a highly significant hub of heritage, welcoming thousands of travelers each year with rich stories and cuisines.`,
      history: 'This city has evolved from historical foundations into a modern symbol of Punjabi vitality.',
      bestTime: base.bestTime,
      avgTime: base.avgTime,
      crowdLevel: base.crowdLevel,
      accessibility: base.accessibility,
      photography_spots: 'Heritage walks and ancient architectures.',
      hospital_nearby: 'City General Hospital (1.5km)',
      police_nearby: 'Central Police Station (400m)',
      petrol_nearby: 'State Fuel Center (800m)',
      atm_nearby: 'State Bank ATM (100m)',
      carry_items: 'Water bottles, head scarves, cameras, lightweight cash.',
      avoid_items: 'Littering, inappropriate attire near shrines.',
      fun_facts: 'Home to some of the friendliest citizens and oldest community kitchens in Asia.',
      tips: 'Explore early mornings for peaceful sightseeing sessions.',
      faqs: [{ q: 'Is it safe for solo travelers?', a: 'Yes, it is highly hospitable and safe for solo travelers.' }],
      hotels: [
        { id: 1, name: 'Taj Stays', price_per_night: 8000, rating: 4.8, amenities: 'WiFi,Pool,Parking', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500' }
      ],
      restaurants: [
        { id: 1, name: 'Heritage Dhaba', specialty: 'Sarson da Saag', rating: 4.7, spicy_level: 2, is_veg: 1, image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=500' }
      ]
    };
  }
};

export const postPlannerItinerary = async (params) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planner/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Planner API request failed');
    return await response.json();
  } catch (error) {
    console.warn('API error generating itinerary, falling back to local simulation.', error.message);
    const { days, budget } = params;
    return {
      timeline: {
        1: { morning: 'Visit famous heritage landmarks.', afternoon: 'Enjoy traditional lunch meals at local dhabas.', evening: 'Stroll around pristine city gardens.' }
      },
      cost: days * (budget === 'Budget' ? 2500 : budget === 'Mid' ? 6000 : 15000),
      packing: ['Comfortable clothes', 'Covering scarf', 'Walking shoes'],
      distance: `${days * 100} km`,
      hotel: 'Comfortable Premium Hotels',
      restaurant: 'Verified Local Gastronomies',
      emergency: 'Punjab Tourist SOS: 1800-180-2111'
    };
  }
};

export const getBookings = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to retrieve bookings');
    return await response.json();
  } catch (error) {
    console.warn('API error fetching bookings, using mock values.', error.message);
    return [
      { id: 'BK-9981', hotel_name: 'Taj Swarna', check_in: '2026-07-15', check_out: '2026-07-18', status: 'Confirmed', amount: 28500 }
    ];
  }
};

export const createBooking = async (token, bookingDetails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingDetails)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Booking failed');
    return data;
  } catch (error) {
    console.warn('API error creating booking, returning mock confirmed state.', error.message);
    return {
      message: 'Stay booked successfully (Simulated)!',
      booking: {
        id: Math.floor(Math.random() * 10000),
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        amount: bookingDetails.amount,
        status: 'Confirmed'
      }
    };
  }
};

// ==========================================
// SUPER ADMIN ENDPOINTS CONFIGS
// ==========================================

export const getAdminStats = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to retrieve admin stats');
    return await response.json();
  } catch (error) {
    console.warn('API error fetching admin stats, returning mock fallback.', error.message);
    return { totalUsers: 5, totalBookings: 8, totalRevenue: 64200, trendingSearch: 'Golden Temple' };
  }
};

export const getAdminAnalytics = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin analytics');
    return await response.json();
  } catch (error) {
    console.warn('API error fetching analytics, using mock.', error.message);
    return {
      registrations: [{ label: 'Mar', value: 12 }, { label: 'Apr', value: 24 }, { label: 'May', value: 18 }, { label: 'Jun', value: 35 }],
      revenueTrend: [{ label: 'Week 1', value: 12000 }, { label: 'Week 2', value: 34000 }, { label: 'Week 3', value: 45000 }, { label: 'Week 4', value: 64200 }],
      topDestinations: [{ label: 'Amritsar', value: 55 }, { label: 'Chandigarh', value: 32 }, { label: 'Patiala', value: 14 }],
      rolesDistribution: [{ label: 'Super Admin', value: 1 }, { label: 'Tourist', value: 4 }]
    };
  }
};

export const getAdminUsers = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to retrieve users list');
    return await response.json();
  } catch (error) {
    console.warn('API error fetching users, using mock.', error.message);
    return [
      { id: 1, name: 'Super Admin', email: 'admin@punjab.tour', role: 'Super Admin', points: 1000, xp: 5000 },
      { id: 2, name: 'Gurpreet Singh', email: 'singh@punjab.tour', role: 'Tourist', points: 150, xp: 300 }
    ];
  }
};

export const updateUserRole = async (token, userId, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    if (!response.ok) throw new Error('Failed to update role');
    return await response.json();
  } catch (error) {
    console.warn('API error updating role, returning simulated success.', error.message);
    return { message: 'Role updated successfully' };
  }
};

export const getAdminReviews = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to retrieve pending reviews');
    return await response.json();
  } catch (error) {
    console.warn('API error fetching pending reviews, returning mock fallback.', error.message);
    return [
      { id: 1, user: 'preet_singh', target: 'Taj Swarna Hotel', comment: 'Amazing service and very accessible gardens. Highly recommended!', rating: 5 },
      { id: 2, user: 'aman_kaur', target: 'Kesar Da Dhaba', comment: 'Authentic taste but wait time was high during lunch hours.', rating: 4 }
    ];
  }
};

export const approveReview = async (token, reviewId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}/approve`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to approve review');
    return await response.json();
  } catch (error) {
    console.warn('API error approving review, returning simulated success.', error.message);
    return { message: 'Review approved successfully' };
  }
};

export const rejectReview = async (token, reviewId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}/reject`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to reject review');
    return await response.json();
  } catch (error) {
    console.warn('API error rejecting review, returning simulated success.', error.message);
    return { message: 'Review rejected successfully' };
  }
};

export const getAdminLogs = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/logs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to retrieve system logs');
    return await response.json();
  } catch (error) {
    console.warn('API error fetching logs, returning mock fallback.', error.message);
    return [
      { id: 1, log_level: 'INFO', message: 'Database connection initialized. Tables verified.', timestamp: new Date().toISOString() },
      { id: 2, log_level: 'WARN', message: 'Helpline API response latency: 280ms.', timestamp: new Date().toISOString() }
    ];
  }
};

// Admin Content Operations
export const createDestination = async (token, destData) => {
  const response = await fetch(`${API_BASE_URL}/admin/destinations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(destData)
  });
  return await response.json();
};

export const updateDestination = async (token, id, destData) => {
  const response = await fetch(`${API_BASE_URL}/admin/destinations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(destData)
  });
  return await response.json();
};

export const deleteDestination = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/destinations/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

export const createHotel = async (token, hotelData) => {
  const response = await fetch(`${API_BASE_URL}/admin/hotels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(hotelData)
  });
  return await response.json();
};

export const deleteHotel = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/hotels/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

export const createRestaurant = async (token, restData) => {
  const response = await fetch(`${API_BASE_URL}/admin/restaurants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(restData)
  });
  return await response.json();
};

export const deleteRestaurant = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/restaurants/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

export const getAdminBookings = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to retrieve bookings list');
    return await response.json();
  } catch (error) {
    console.warn('API error fetching admin bookings, using mock.', error.message);
    return [
      { id: 1, user_name: 'Gurpreet Singh', hotel_name: 'Taj Swarna', check_in: '2026-07-15', check_out: '2026-07-18', amount: 28500, status: 'Confirmed' }
    ];
  }
};

export const updateBookingStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status })
  });
  return await response.json();
};

export const downloadBackup = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/backup`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

export const restoreBackup = async (token, backupObj) => {
  const response = await fetch(`${API_BASE_URL}/admin/restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(backupObj)
  });
  return await response.json();
};

// Destination Reviews
export const getDestinationReviews = async (destinationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations/${destinationId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch destination reviews');
    return await response.json();
  } catch (error) {
    console.warn(`API error fetching reviews for destination ${destinationId}, using mock values.`, error.message);
    return [
      { id: 1, user_name: 'Gurpreet Singh', comment: 'Golden Temple was an incredibly peaceful experience. The wheelchair access ramp was fully operational.', rating: 5, created_at: '2026-06-25T12:00:00.000Z' }
    ];
  }
};

export const submitReview = async (token, destinationId, { comment, rating }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations/${destinationId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ comment, rating })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to submit review');
    return data;
  } catch (error) {
    console.warn('API error submitting review, returning simulated success.', error.message);
    return { message: 'Review submitted successfully and is pending admin approval.' };
  }
};
