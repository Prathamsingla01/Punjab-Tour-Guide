import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Volume2, VolumeX, Sliders } from 'lucide-react';

const FolkBeatsPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [activeInstruments, setActiveInstruments] = useState({ dhol: true, tumbi: false, algoza: false });
  
  const audioCtxRef = useRef(null);
  const schedulerTimerRef = useRef(null);
  const current16thNoteRef = useRef(0);
  const nextNoteTimeRef = useRef(0.0);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize Web Audio Context
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
  };

  // Synthesize Dhol (Bass Drum)
  const playDhol = (time) => {
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(analyserRef.current);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.2);
    
    gain.gain.setValueAtTime(1.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);
    
    osc.start(time);
    osc.stop(time + 0.23);
  };

  // Synthesize Tumbi (High Twang String)
  const playTumbi = (time, noteFrequency = 293.66) => { // D4 note default
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(analyserRef.current);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(noteFrequency, time);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, time);
    filter.frequency.exponentialRampToValueAtTime(50, time + 0.1);
    
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
    
    osc.start(time);
    osc.stop(time + 0.13);
  };

  // Synthesize Algoza (Double Flute)
  const playAlgoza = (time, freq1 = 587.33, freq2 = 590) => { // D5 + detuned D5
    const ctx = audioCtxRef.current;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(analyserRef.current);
    
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    osc1.frequency.setValueAtTime(freq1, time);
    osc2.frequency.setValueAtTime(freq2, time);
    
    // Smooth vibrato/fade
    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
    
    osc1.start(time);
    osc2.start(time);
    
    osc1.stop(time + 0.26);
    osc2.stop(time + 0.26);
  };

  // Scheduler / Sequencer
  const scheduleNote = (noteNumber, time) => {
    // 16-step grid loop
    // Dhol beat: trigger on 1, 5, 9, 13 (quarter notes) + syncopations on 7, 11
    if (activeInstruments.dhol) {
      if ([0, 4, 8, 12].includes(noteNumber)) playDhol(time);
      if ([6, 10].includes(noteNumber)) playDhol(time - 0.02); // Syncopation slap
    }

    // Tumbi beat: trigger arpeggios on eighth notes
    if (activeInstruments.tumbi) {
      const scale = [293.66, 329.63, 349.23, 392.00]; // D, E, F, G (traditional scale)
      if (noteNumber % 2 === 0) {
        const note = scale[(noteNumber / 2) % scale.length];
        playTumbi(time, note);
      }
    }

    // Algoza double flute trills
    if (activeInstruments.algoza) {
      if (noteNumber % 4 === 0) {
        playAlgoza(time);
      }
    }
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpm;
    const secondsPer16th = 0.25 * secondsPerBeat;
    
    nextNoteTimeRef.current += secondsPer16th;
    current16thNoteRef.current = (current16thNoteRef.current + 1) % 16;
  };

  const scheduler = () => {
    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + 0.1) {
      scheduleNote(current16thNoteRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    schedulerTimerRef.current = setTimeout(scheduler, 25.0);
  };

  // Toggle playback
  const handlePlayToggle = () => {
    initAudio();
    if (isPlaying) {
      clearTimeout(schedulerTimerRef.current);
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameRef.current);
    } else {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      current16thNoteRef.current = 0;
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      scheduler();
      setIsPlaying(true);
      drawVisualizer();
    }
  };

  // HTML5 Visualizer Draw function
  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'var(--color-mustard)';
      ctx.beginPath();
      
      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    
    draw();
  };

  // Cleanup timers
  useEffect(() => {
    return () => {
      clearTimeout(schedulerTimerRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="glass-panel" style={{ padding: 'var(--space-4)', position: 'relative', overflow: 'hidden' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-mustard)', marginBottom: 'var(--space-3)' }}>
        <Volume2 size={18} />
        <span>Folk Beats Synthesizer</span>
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-4)', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Click play and toggle instrumental channels to synthesize traditional rhythms.
          </p>

          {/* Instruments switches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
              <input 
                type="checkbox" 
                checked={activeInstruments.dhol} 
                onChange={(e) => setActiveInstruments({ ...activeInstruments, dhol: e.target.checked })}
              />
              <span>🥁 Dhol Bass Drum</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
              <input 
                type="checkbox" 
                checked={activeInstruments.tumbi} 
                onChange={(e) => setActiveInstruments({ ...activeInstruments, tumbi: e.target.checked })}
              />
              <span>🎸 Tumbi String Pluck</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
              <input 
                type="checkbox" 
                checked={activeInstruments.algoza} 
                onChange={(e) => setActiveInstruments({ ...activeInstruments, algoza: e.target.checked })}
              />
              <span>🪈 Algoza Double Flute</span>
            </label>
          </div>

          {/* BPM Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sliders size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: '10px', width: '50px' }}>{bpm} BPM</span>
            <input 
              type="range" 
              min="70" 
              max="130" 
              value={bpm} 
              onChange={(e) => setBpm(parseInt(e.target.value))}
              style={{ flex: '1', cursor: 'pointer' }}
            />
          </div>

          {/* Play Control */}
          <button 
            onClick={handlePlayToggle} 
            className="login-nav-btn"
            style={{ width: '100%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isPlaying ? <Square size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Mute Beats' : 'Play Live Beats'}</span>
          </button>
        </div>

        {/* Visualizer canvas */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          <canvas ref={canvasRef} width="160" height="140" style={{ width: '100%', height: '100%' }} />
          {!isPlaying && (
            <span style={{ position: 'absolute', fontSize: '10px', color: 'var(--text-secondary)' }}>Muted</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolkBeatsPlayer;
