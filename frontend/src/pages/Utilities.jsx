import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Volume2, ShieldAlert, Award, 
  MapPin, CheckCircle, Ticket, CloudSun, HelpCircle, Download 
} from 'lucide-react';

const Utilities = () => {
  const { user, addRewardPoints } = useAuth();
  const [activeTab, setActiveTab] = useState('phrasebook');

  // ==========================================
  // TAB 1: PHRASEBOOK TRANSLATOR & SPEECH
  // ==========================================
  const phrases = [
    { eng: 'Hello / Greetings', gur: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', rom: 'Sat Sri Akal', soundText: 'Sat Sri Akal' },
    { eng: 'Thank you', gur: 'ਧੰਨਵਾਦ', rom: 'Dhanwaad', soundText: 'Dhanwaad' },
    { eng: 'How are you?', gur: 'ਕੀ ਹਾਲ ਹੈ?', rom: 'Kee haal hai?', soundText: 'Kee haal hai?' },
    { eng: 'Where is the Golden Temple?', gur: 'ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਕਿੱਥੇ ਹੈ?', rom: 'Harmandir Sahib kitthe hai?', soundText: 'Harmandir Sahib kitthe hai?' },
    { eng: 'I want an Amritsari Kulcha', gur: 'ਮੈਨੂੰ ਅੰਮ੍ਰਿਤਸਰੀ ਕੁਲਚਾ ਚਾਹੀਦਾ ਹੈ', rom: 'Mainoo Amritsari Kulcha chaheeda hai', soundText: 'Mainoo Amritsari Kulcha chaheeda hai' },
    { eng: 'How much does this cost?', gur: 'ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?', rom: 'Ih kinne da hai?', soundText: 'Ih kinne da hai?' }
  ];

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) {
      alert('Speech Synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel(); // Cancel active speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find an Indian English voice if a Punjabi one is missing
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(v => v.lang.includes('hi-IN') || v.lang.includes('en-IN'));
    if (indVoice) utterance.voice = indVoice;
    
    utterance.rate = 0.85; // Speak slowly for clear learning
    window.speechSynthesis.speak(utterance);
  };

  // ==========================================
  // TAB 2: GAMIFIED LANGUAGE QUIZ
  // ==========================================
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizPointsAwarded, setQuizPointsAwarded] = useState(false);

  const quizQuestions = [
    {
      q: 'How do you say "Thank you" in Punjabi?',
      opts: ['Sat Sri Akal', 'Dhanwaad', 'Kee haal hai', 'Hanji'],
      ans: 'Dhanwaad'
    },
    {
      q: 'What is the literal translation of "Sewa"?',
      opts: ['Shopping', 'Selfless Community Service', 'Farming', 'Folk Dancing'],
      ans: 'Selfless Community Service'
    },
    {
      q: 'Which phrase is used to ask "Where is..."?',
      opts: ['Ih kinne da...', '...kitthe hai?', 'Kee haal...', 'Dhanwaad...'],
      ans: '...kitthe hai?'
    }
  ];

  const handleAnswer = (selectedOpt) => {
    if (selectedOpt === quizQuestions[currentQ].ans) {
      setScore(score + 1);
    }
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setQuizFinished(true);
    }
  };

  useEffect(() => {
    if (quizFinished && score === quizQuestions.length && !quizPointsAwarded) {
      addRewardPoints(20, 50); // 20 points, 50 XP
      setQuizPointsAwarded(true);
    }
  }, [quizFinished]);

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setQuizFinished(false);
    setQuizPointsAwarded(false);
  };

  // ==========================================
  // TAB 3: DIGITAL TRAVEL PASS GENERATOR
  // ==========================================
  const [passenger, setPassenger] = useState(user ? user.name : 'Tourist');
  const [travelDate, setTravelDate] = useState('2026-07-15');
  const [destinationHub, setDestinationHub] = useState('Amritsar');

  const downloadPass = () => {
    const svgElement = document.getElementById('travel-pass-svg');
    if (!svgElement) return;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;
    downloadLink.download = `Punjab_Travel_Pass_${passenger.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // ==========================================
  // TAB 4: WEATHER API INTEGRATION
  // ==========================================
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        // Fetch weather live for Amritsar (lat=31.62, lon=74.87)
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=31.6200&longitude=74.8765&current_weather=true');
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        console.warn('Weather API failed, simulating forecast data.', err.message);
        setWeather({ temp: 32, windspeed: 12, weathercode: 1 }); // Clear/Sunny simulation
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="utilities-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div className="section-header">
        <h1 className="section-title">Travel Companion Utilities</h1>
        <p className="section-subtitle">Access translation cards, challenge yourself with Punjabi quizzes, view live weather feeds, and download your travel pass.</p>
      </div>

      {/* Tabs Nav */}
      <div className="glass-panel" style={{ padding: '6px', display: 'flex', gap: '8px', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('phrasebook')} className={`nav-item ${activeTab === 'phrasebook' ? 'nav-item-active' : ''}`} style={{ flex: '1 1 auto', justifyContent: 'center' }}>
          <Volume2 size={16} />
          <span>Phrasebook</span>
        </button>
        <button onClick={() => setActiveTab('quiz')} className={`nav-item ${activeTab === 'quiz' ? 'nav-item-active' : ''}`} style={{ flex: '1 1 auto', justifyContent: 'center' }}>
          <HelpCircle size={16} />
          <span>Language Quiz</span>
        </button>
        <button onClick={() => setActiveTab('pass')} className={`nav-item ${activeTab === 'pass' ? 'nav-item-active' : ''}`} style={{ flex: '1 1 auto', justifyContent: 'center' }}>
          <Ticket size={16} />
          <span>Digital Pass</span>
        </button>
        <button onClick={() => setActiveTab('weather')} className={`nav-item ${activeTab === 'weather' ? 'nav-item-active' : ''}`} style={{ flex: '1 1 auto', justifyContent: 'center' }}>
          <CloudSun size={16} />
          <span>Live Weather</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
        
        {/* PANEL 1: PHRASEBOOK */}
        {activeTab === 'phrasebook' && (
          <div className="animate-fade-in-up">
            <h2 style={{ marginBottom: 'var(--space-3)' }}>Punjabi Phrasebook Companion</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Click any audio button to trigger real-time phonetic vocal speech synthesis in your browser.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {phrases.map((ph, idx) => (
                <div key={idx} style={{ padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{ph.eng}</span>
                    <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-phulkari-pink)', margin: '2px 0' }}>{ph.gur}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', fontStyle: 'italic' }}>Pronounced: "{ph.rom}"</p>
                  </div>
                  <button 
                    onClick={() => handleSpeak(ph.soundText)}
                    className="action-btn theme-btn"
                    title="Play pronunciation speech"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 2: LANGUAGE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in-up text-center" style={{ maxWidth: '500px', margin: '0 auto', padding: 'var(--space-3)' }}>
            <h2 style={{ marginBottom: '12px' }}>Punjabi Language Challenge</h2>
            {!quizFinished ? (
              <div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Question {currentQ + 1} of {quizQuestions.length}
                </p>
                <h3 style={{ marginBottom: '20px' }}>{quizQuestions[currentQ].q}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {quizQuestions[currentQ].opts.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer(opt)}
                      className="glass-panel" 
                      style={{ padding: '12px', border: '1px solid var(--border-color)', width: '100%', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <Award size={48} style={{ color: 'var(--color-mustard)', margin: '0 auto 12px auto' }} />
                <h3>Challenge Finished!</h3>
                <p style={{ fontSize: 'var(--text-lg)', margin: '8px 0' }}>You scored {score} / {quizQuestions.length}</p>
                {score === quizQuestions.length ? (
                  <div style={{ background: 'rgba(10,110,63,0.1)', color: 'var(--color-green)', padding: '10px', borderRadius: '8px', fontSize: 'var(--text-xs)', marginBottom: '16px' }}>
                    Congratulations! 20 Reward Points and 50 XP added to your dashboard profile.
                  </div>
                ) : (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '16px' }}>Try again to score 100% and earn loyalty reward points!</p>
                )}
                <button onClick={resetQuiz} className="login-nav-btn" style={{ padding: '8px 24px' }}>
                  Restart Challenge
                </button>
              </div>
            )}
          </div>
        )}

        {/* PANEL 3: TRAVEL PASS */}
        {activeTab === 'pass' && (
          <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'var(--space-5)', alignItems: 'center' }}>
            {/* Input Form */}
            <div>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Travel Pass Generator</h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '16px' }}>Generate a digital ticket/pass featuring a scan QR code and dates.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Passenger Name</label>
                  <input 
                    type="text" 
                    value={passenger}
                    onChange={(e) => setPassenger(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Travel Date</label>
                  <input 
                    type="date" 
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Destination Hub</label>
                  <select 
                    value={destinationHub} 
                    onChange={(e) => setDestinationHub(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Amritsar">Amritsar (Holy City)</option>
                    <option value="Chandigarh">Chandigarh (Garden City)</option>
                    <option value="Patiala">Patiala (Royal Forts)</option>
                  </select>
                </div>
                <button onClick={downloadPass} className="login-nav-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}>
                  <Download size={16} />
                  <span>Download SVG Ticket</span>
                </button>
              </div>
            </div>

            {/* SVG Ticket Render */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg 
                id="travel-pass-svg" 
                viewBox="0 0 320 200" 
                width="320" 
                height="200"
                style={{ 
                  borderRadius: '16px', 
                  boxShadow: 'var(--shadow-lg)', 
                  border: '1px solid var(--border-color)', 
                  background: 'linear-gradient(135deg, #FFB800, #C2185B)' 
                }}
              >
                {/* Background Card */}
                <rect x="0" y="0" width="320" height="200" rx="16" fill="url(#ticketGlow)" opacity="0.9"/>
                <defs>
                  <linearGradient id="ticketGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2C0F32" />
                    <stop offset="100%" stopColor="#C2185B" />
                  </linearGradient>
                </defs>

                {/* Dom element character symbol decoration */}
                <text x="20" y="45" fill="#FFB800" fontSize="24" fontWeight="800" fontFamily="serif">ੴ</text>
                <text x="50" y="40" fill="#FFFFFF" fontSize="14" fontWeight="700" fontFamily="sans-serif">PUNJAB TRAVEL PASS</text>
                <text x="50" y="52" fill="#FFB800" fontSize="8" letterSpacing="1">OFFICIAL BOARD PASS</text>

                {/* Ticket Details */}
                <text x="25" y="90" fill="#FFFFFF" fontSize="8" opacity="0.7">PASSENGER NAME</text>
                <text x="25" y="105" fill="#FFFFFF" fontSize="14" fontWeight="700">{passenger.toUpperCase()}</text>

                <text x="25" y="140" fill="#FFFFFF" fontSize="8" opacity="0.7">TRAVEL DATE</text>
                <text x="25" y="152" fill="#FFFFFF" fontSize="10" fontWeight="600">{travelDate}</text>

                <text x="140" y="140" fill="#FFFFFF" fontSize="8" opacity="0.7">DESTINATION</text>
                <text x="140" y="152" fill="#FFFFFF" fontSize="10" fontWeight="600">{destinationHub.toUpperCase()}</text>

                {/* Decorative cutouts */}
                <circle cx="0" cy="100" r="10" fill="var(--bg-secondary)" />
                <circle cx="320" cy="100" r="10" fill="var(--bg-secondary)" />

                {/* Mock QR Code vector representation */}
                <g transform="translate(240, 80)">
                  <rect x="0" y="0" width="50" height="50" fill="#FFFFFF" rx="4"/>
                  <rect x="5" y="5" width="15" height="15" fill="#12161A" />
                  <rect x="30" y="5" width="15" height="15" fill="#12161A" />
                  <rect x="5" y="30" width="15" height="15" fill="#12161A" />
                  <rect x="12" y="12" width="6" height="6" fill="#FFFFFF" />
                  <rect x="32" y="12" width="6" height="6" fill="#FFFFFF" />
                  <rect x="12" y="32" width="6" height="6" fill="#FFFFFF" />
                  <rect x="25" y="25" width="10" height="10" fill="#12161A" />
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* PANEL 4: WEATHER */}
        {activeTab === 'weather' && (
          <div className="animate-fade-in-up">
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Live Weather Forecast</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '16px' }}>Current meteorological feed query for Amritsar (Golden Temple district).</p>
            
            {loadingWeather ? (
              <p style={{ fontSize: 'var(--text-sm)' }}>Retrieving live weather indicators...</p>
            ) : weather ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-mustard)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                  ☀️
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-3xl)', color: 'var(--text-primary)' }}>{weather.temperature || weather.temp}°C</h3>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Wind Speed: {weather.windspeed} km/h &bull; Weather Code: {weather.weathercode} (Clear sky)
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-green)', marginTop: '4px', fontWeight: '600' }}>
                    Excellent conditions for outdoor sight walks and temple visits.
                  </p>
                </div>
              </div>
            ) : (
              <p>Failed to query weather indicators.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Utilities;
