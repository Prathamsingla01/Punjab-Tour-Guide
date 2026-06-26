import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, MicOff, History, Compass, MapPin, Landmark, Utensils } from 'lucide-react';

const Hero = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem('ptg-recent-searches')) || [];
  });
  
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Popular search items
  const popularPlaces = [
    { name: 'Golden Temple', type: 'attraction', city: 'Amritsar' },
    { name: 'Rock Garden', type: 'attraction', city: 'Chandigarh' },
    { name: 'Qila Mubarak', type: 'attraction', city: 'Patiala' },
    { name: 'Sada Pind', type: 'culture', city: 'Amritsar' }
  ];

  // Static list for autocomplete suggestions
  const database = [
    { name: 'Golden Temple (Harmandir Sahib)', city: 'Amritsar', category: 'Spiritual' },
    { name: 'Wagah Border Ceremony', city: 'Amritsar', category: 'Patriotic' },
    { name: 'Rock Garden of Chandigarh', city: 'Chandigarh', category: 'Art & Nature' },
    { name: 'Sukhna Lake', city: 'Chandigarh', category: 'Nature' },
    { name: 'Qila Mubarak Fort', city: 'Patiala', category: 'History' },
    { name: 'Sheesh Mahal', city: 'Patiala', category: 'Heritage' },
    { name: 'Pushpa Gujral Science City', city: 'Kapurthala', category: 'Education' },
    { name: 'Jagatjit Palace', city: 'Kapurthala', category: 'Architecture' },
    { name: 'Takht Sri Damdama Sahib', city: 'Bathinda', category: 'Spiritual' },
    { name: 'Bathinda Fort (Qila Mubarak)', city: 'Bathinda', category: 'History' },
    { name: 'Virasat-e-Khalsa Museum', city: 'Anandpur Sahib', category: 'History' },
    { name: 'Takht Sri Keshgarh Sahib', city: 'Anandpur Sahib', category: 'Spiritual' }
  ];

  // Handle Autocomplete Suggestions
  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = database.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.city.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Handle Outside Clicks to close suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Web Speech API Voice Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearchSubmit(transcript);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice Recognition is not supported in this browser. Try Chrome or Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSearchSubmit = (searchVal) => {
    const term = searchVal || query;
    if (!term.trim()) return;

    // Cache query in recent searches
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('ptg-recent-searches', JSON.stringify(updated));

    // Redirect to Explore page with search query
    navigate(`/destinations?search=${encodeURIComponent(term)}`);
  };

  return (
    <header className="hero-section">
      {/* Dynamic Cloud & Bird SVGs */}
      <div className="sky-particles">
        {/* Cloud SVGs */}
        <svg className="cloud-particle" style={{ top: '15%', left: '10%' }} width="120" height="40" viewBox="0 0 120 40">
          <path d="M20,30 Q30,10 50,20 Q65,5 85,20 Q105,10 110,30 Z" fill="#FFFFFF" />
        </svg>
        <svg className="cloud-particle" style={{ top: '30%', right: '15%', animationDelay: '2s' }} width="150" height="50" viewBox="0 0 150 50">
          <path d="M25,35 Q35,12 60,24 Q78,5 105,24 Q130,12 137,35 Z" fill="#FFFFFF" />
        </svg>

        {/* Flying Birds */}
        <div className="bird-particle" style={{ animationDelay: '0s', top: '25%' }}>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
            <path d="M0 6Q6 0 12 6Q18 0 24 6Q18 12 12 6Q6 12 0 6Z" fill="currentColor" style={{ color: 'var(--text-secondary)' }} />
          </svg>
        </div>
        <div className="bird-particle" style={{ animationDelay: '5s', top: '15%' }}>
          <svg width="18" height="9" viewBox="0 0 24 12" fill="none">
            <path d="M0 6Q6 0 12 6Q18 0 24 6Q18 12 12 6Q6 12 0 6Z" fill="currentColor" style={{ color: 'var(--text-secondary)' }} />
          </svg>
        </div>
      </div>

      <div className="hero-overlay" />

      <div className="hero-content animate-fade-in-up">
        <span className="hero-title-gurmukhi">ਜੀ ਆਇਆਂ ਨੂੰ</span>
        <h1 className="hero-title-english">
          Explore the Vibrant Soul of <span style={{ color: 'var(--color-mustard)' }}>Punjab</span>
        </h1>
        <p className="hero-subtitle">
          Discover majestic shrines, royal palaces, rich culinary masterpieces, and authentic hospitality.
        </p>

        {/* Search Bar Wrapper */}
        <div ref={searchContainerRef} className="hero-search-wrapper glass-panel">
          <div className="hero-search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search Golden Temple, Chandigarh, Butter Chicken..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
            <button 
              className={`voice-search-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceSearch}
              title="Voice Search"
            >
              {isListening ? <MicOff size={20} color="var(--color-phulkari-pink)" /> : <Mic size={20} />}
            </button>
            <button onClick={() => handleSearchSubmit()} className="search-submit-btn">
              Explore
            </button>
          </div>

          {/* Autocomplete & History Dropdown */}
          {showSuggestions && (
            <div className="search-dropdown-menu">
              {/* Voice Listening Mode Status */}
              {isListening && (
                <div className="voice-listening-indicator">
                  <span className="pulse-dot" />
                  <span>Listening for search query...</span>
                </div>
              )}

              {/* Autocomplete Suggestions */}
              {suggestions.length > 0 && (
                <div className="dropdown-section">
                  <span className="dropdown-section-title">Matching Destinations</span>
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(item.name);
                        setShowSuggestions(false);
                        navigate(`/destinations?search=${encodeURIComponent(item.name)}`);
                      }}
                      className="dropdown-item"
                    >
                      <MapPin size={14} className="dropdown-item-icon" />
                      <div>
                        <span className="item-name">{item.name}</span>
                        <span className="item-sub">{item.city} &bull; {item.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="dropdown-section">
                  <span className="dropdown-section-title">Recent Searches</span>
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(term);
                        setShowSuggestions(false);
                        handleSearchSubmit(term);
                      }}
                      className="dropdown-item"
                    >
                      <History size={14} className="dropdown-item-icon" />
                      <span className="item-name">{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div className="dropdown-section">
                <span className="dropdown-section-title">Trending Places</span>
                <div className="trending-tags-grid">
                  {popularPlaces.map((place, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(place.name);
                        setShowSuggestions(false);
                        navigate(`/destinations?search=${encodeURIComponent(place.name)}`);
                      }}
                      className="trending-tag"
                    >
                      {place.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Hero;
