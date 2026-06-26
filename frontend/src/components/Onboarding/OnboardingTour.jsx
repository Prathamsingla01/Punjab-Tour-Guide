import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, X, ArrowRight, Check } from 'lucide-react';

const OnboardingTour = () => {
  const [step, setStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('ptg-onboard-seen');
    if (!seen) {
      setShowTour(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('ptg-onboard-seen', 'true');
    setShowTour(false);
  };

  if (!showTour) return null;

  const tourSteps = [
    {
      title: 'Sat Sri Akal! Welcome to Punjab',
      desc: 'Let us take you on an interactive onboarding tour of your portfolio-grade Smart Travel Companion.',
      icon: Sparkles
    },
    {
      title: '1. Custom Itinerary Planner',
      desc: 'Input your travel days, budget constraints, accessibility parameters (kids or seniors), and get custom-generated structured daily schedules and recommended hotels.',
      icon: HelpCircle
    },
    {
      title: '2. Folk Beats Synthesizer',
      desc: 'Listen to the Web Audio API traditional beat loops. You can select instruments like Dhol, Tumbi, or Algoza and adjust the BPM slider dynamically.',
      icon: HelpCircle
    },
    {
      title: '3. Digital Phrasebook & Pass',
      desc: 'Trigger speech synthesis to learn Punjabi words like "Dhanwaad", test your skills with a score-rewarding language quiz, and download your travel pass.',
      icon: HelpCircle
    },
    {
      title: '4. Local AI Chatbot Concierge',
      desc: 'Click the message bubble icon at the bottom-right corner to open our smart chatbot, supporting voice speech recognition to answer all travel queries instantly.',
      icon: HelpCircle
    }
  ];

  const CurrentIcon = tourSteps[step].icon;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(18, 22, 26, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200000,
      padding: '16px'
    }}>
      {/* Tour Card */}
      <div 
        className="glass-panel animate-fade-in-up"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: 'var(--space-5)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          borderRadius: '20px'
        }}
      >
        <button 
          onClick={handleComplete}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
          title="Skip Tour"
        >
          <X size={18} />
        </button>

        {/* Card Content */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.1), rgba(194, 24, 91, 0.1))',
            color: 'var(--color-mustard)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-3) auto'
          }}>
            <CurrentIcon size={28} />
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
            {tourSteps[step].title}
          </h2>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginTop: '12px', 
            lineHeight: '1.6' 
          }}>
            {tourSteps[step].desc}
          </p>
        </div>

        {/* Progress Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
          {tourSteps.map((_, idx) => (
            <div 
              key={idx}
              style={{
                width: idx === step ? '20px' : '6px',
                height: '6px',
                borderRadius: 'var(--radius-full)',
                background: idx === step ? 'var(--color-mustard)' : 'var(--border-color)',
                transition: 'all var(--transition-fast)'
              }}
            />
          ))}
        </div>

        {/* Action button */}
        <button 
          onClick={handleNext}
          className="login-nav-btn"
          style={{ 
            width: '100%', 
            padding: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px' 
          }}
        >
          <span>{step === 4 ? 'Let\'s Explore' : 'Next Step'}</span>
          {step === 4 ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
};

export default OnboardingTour;
