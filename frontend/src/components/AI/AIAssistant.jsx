import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Bot, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Sat Sri Akal! I am your Punjab Travel Assistant. Ask me about cities, local foods, cultural customs, or safety advice!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Initialize Speech Recognition
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
        handleSend(transcript);
      };
      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const scrollChat = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChat();
  }, [messages, isTyping]);

  const handleSend = (textVal) => {
    const text = textVal || query;
    if (!text.trim()) return;

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setQuery('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let reply = "I'm here to help! Could you specify if you are asking about Amritsar, local foods, or cultural rules?";
      const lower = text.toLowerCase();

      if (lower.includes('hello') || lower.includes('hi') || lower.includes('greet')) {
        reply = "Sat Sri Akal! That is the traditional respectful greeting in Punjab. You can also say 'Hanji' for 'Yes'.";
      } else if (lower.includes('where') || lower.includes('place') || lower.includes('recommend') || lower.includes('visit')) {
        reply = "I highly recommend visiting Amritsar for the spiritual Golden Temple, Chandigarh for the modern Rock Garden, and Patiala for royal forts like Qila Mubarak!";
      } else if (lower.includes('food') || lower.includes('eat') || lower.includes('dhaba') || lower.includes('veg')) {
        reply = "You must try Amritsari Kulcha, Sarson da Saag & Makki di Roti, and creamy sweet Lassi! Famous spots include Kesar Da Dhaba in Amritsar.";
      } else if (lower.includes('custom') || lower.includes('rule') || lower.includes('dress') || lower.includes('wear')) {
        reply = "When visiting religious shrines like the Golden Temple, please dress modestly, remove your shoes, and keep your head covered at all times (scarves are provided free at the entrance).";
      } else if (lower.includes('sos') || lower.includes('emergency') || lower.includes('police') || lower.includes('hospital')) {
        reply = "For any safety concerns, call the Punjab Tourist Police SOS line at 1800-180-2111 immediately. Stays and cities display hospital coordinates on their mapper cards.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="login-nav-btn"
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: 'var(--shadow-xl)',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="glass-panel animate-fade-in-up" style={{ 
          width: '320px', 
          height: '420px', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)'
        }}>
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, var(--color-mustard), var(--color-phulkari-pink))', 
            color: '#FFFFFF', 
            padding: '12px var(--space-3)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={18} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF' }}>Punjab Travel Guide AI</span>
                <span style={{ fontSize: '9px', opacity: 0.8, color: '#FFFFFF' }}>Online Concierge</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: '#FFFFFF', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages Log */}
          <div style={{ flex: '1', overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                  background: msg.sender === 'bot' ? 'var(--bg-primary)' : 'linear-gradient(135deg, var(--color-mustard), var(--color-phulkari-pink))',
                  color: msg.sender === 'bot' ? 'var(--text-primary)' : '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  fontSize: '11px',
                  boxShadow: 'var(--shadow-sm)',
                  border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span className="pulse-dot" style={{ display: 'inline-block', width: '6px', height: '6px', marginRight: '4px' }} />
                <span>Typing local advice...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Panel */}
          <div style={{ borderTop: '1px solid var(--border-color)', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-primary)' }}>
            <button 
              onClick={toggleVoiceInput} 
              className={`voice-search-btn ${isListening ? 'listening' : ''}`}
              style={{ width: '32px', height: '32px' }}
              title="Voice Input Query"
            >
              {isListening ? <MicOff size={16} color="var(--color-phulkari-pink)" /> : <Mic size={16} />}
            </button>
            <input 
              type="text" 
              placeholder="Ask about clothing, food..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: '1', background: 'var(--bg-secondary)', borderRadius: '16px', padding: '6px 12px', fontSize: '11px', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            />
            <button 
              onClick={() => handleSend()}
              className="flex-center" 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--color-mustard), var(--color-phulkari-pink))', 
                color: '#FFFFFF' 
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
