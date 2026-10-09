import React, { useState, useEffect } from 'react';
import { Bot, Key, Sparkles, ShieldAlert, Navigation, CheckCircle2, SlidersHorizontal, Info } from 'lucide-react';
import { processAiPujoQuery, getGeminiApiKey, saveGeminiApiKey } from '../services/aiService';

export default function AiDiscoveryPage({ userLocation, onGetDirections }) {
  const [queryInput, setQueryInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setApiKey(getGeminiApiKey());
  }, []);

  const handleSaveApiKey = (e) => {
    if (e) e.preventDefault();
    saveGeminiApiKey(apiKey);
    setSaveMessage('Google Gemini API Key saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const samplePrompts = [
    { label: '🗺️ Route Planning', text: 'I have 6 hours. Make me a North Kolkata Puja route starting from Shyambazar.' },
    { label: '👵 Elderly & Wheelchair', text: 'Which pandals have low walking and wheelchair access for senior citizens?' },
    { label: '🕯️ Rituals & Anjali', text: 'When is Sandhi Puja and what is Pushpanjali timing on Ashtami?' },
    { label: '🍛 Bhog & Street Food', text: 'Where can I get Bhog and famous Bengali street food near pandals?' },
    { label: '📸 Photogenic Pandals', text: 'Show me Instagram photogenic pandals in South Kolkata.' },
    { label: '🚨 Emergency Helpline', text: 'What is the emergency helpline number during Durga Puja in Kolkata?' },
    { label: '🇧🇳 Banglish Query', text: 'Bhai ajke raat e amar kacher kom bhir-er 5 ta bhalo pujo bolo, beshi hata jeno na hoy.' }
  ];

  const handleRunAi = async (e) => {
    if (e) e.preventDefault();
    if (!queryInput.trim()) return;
    setIsThinking(true);
    const res = await processAiPujoQuery(queryInput, userLocation);
    setAiResponse(res);
    setIsThinking(false);
  };

  const handleSelectSample = (promptText) => {
    setQueryInput(promptText);
  };

  return (
    <div className="ai-discovery-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🤖 AI PUJO DISCOVERY ASSISTANT</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
            Natural language AI trained on 80 intent categories & 765 Durga Puja Q&A topics. Grounded on 149 live Kolkata pandals.
          </p>
        </div>

        {/* Gemini API Key Toggle Button */}
        <button
          onClick={() => setShowKeySettings(!showKeySettings)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            border: apiKey ? '1px solid #10b981' : '1px solid var(--accent-gold)',
            background: apiKey ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: apiKey ? '#10b981' : 'var(--accent-gold)',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Key size={16} />
          <span>{apiKey ? '🟢 Gemini API Active' : '⚙️ Configure Gemini Key'}</span>
        </button>
      </div>

      {/* Google Gemini API Key Settings Panel */}
      {showKeySettings && (
        <div className="glass-panel animate-fade-in" style={{ padding: '20px', borderRadius: '20px', marginBottom: '24px', border: '1px solid var(--accent-gold)', background: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '8px' }}>
            <Key size={18} />
            <span>Google Gemini API Key Integration</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
            Enter your Google Gemini API Key below to enable live LLM responses. If no key is configured, the assistant automatically uses the high-performance local AI Smart Intent Engine.
          </p>

          <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="password"
              className="form-input"
              placeholder="Paste Google Gemini API Key (AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1, minWidth: '280px', fontSize: '0.9rem' }}
            />
            <button
              type="submit"
              className="pill-action-btn"
              style={{ padding: '0 20px', fontSize: '0.85rem' }}
            >
              Save Key
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={() => { setApiKey(''); saveGeminiApiKey(''); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear Key
              </button>
            )}
          </form>

          {saveMessage && (
            <div style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: '700', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> {saveMessage}
            </div>
          )}
        </div>
      )}

      {/* Main Query & Prompt Panel */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', marginBottom: '28px', border: '1px solid var(--border-glow)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
          <span>Try AI Discovery Prompts (English & Banglish supported):</span>
        </div>

        {/* Sample Prompt Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {samplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(item.text)}
              style={{
                padding: '6px 14px',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                background: 'var(--input-bg)',
                color: 'var(--accent-gold)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleRunAi} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask AI in English or Banglish: 'Bhai ajke raat e 5 ta bhalo pujo bolo...' "
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            style={{ fontSize: '0.95rem' }}
          />
          <button
            type="submit"
            disabled={isThinking}
            className="pill-action-btn"
            style={{ padding: '0 28px', flexShrink: 0 }}
          >
            {isThinking ? 'AI Thinking...' : 'Ask AI'}
          </button>
        </form>
      </div>

      {/* AI Response Output Box */}
      {aiResponse && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '24px', border: '1.5px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-gold)', fontWeight: '800', fontSize: '1.1rem' }}>
              <Bot size={24} />
              <span>AI Recommendations</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', background: aiResponse.isGeminiPowered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)', color: aiResponse.isGeminiPowered ? '#10b981' : '#38bdf8' }}>
              {aiResponse.isGeminiPowered ? '⚡ Powered by Google Gemini' : '🧠 Smart Intent Engine'}
            </span>
          </div>

          {/* Warning banner if API failed */}
          {aiResponse.warning && (
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} /> {aiResponse.warning}
            </div>
          )}

          <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.65, marginBottom: '20px', whiteSpace: 'pre-line' }}>
            {aiResponse.text}
          </p>

          {/* Recommendation Cards */}
          {aiResponse.recommendations && aiResponse.recommendations.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                📍 Recommended Verified Pandals:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {aiResponse.recommendations.map(p => (
                  <div key={p.id} style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }}
                      />
                    )}
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{p.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '4px', fontWeight: '600' }}>🎨 {p.theme}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>🚇 {p.nearestMetro}</div>
                    <div style={{ fontSize: '0.78rem', color: p.crowdLevel === 'Very High' ? '#ef4444' : p.crowdLevel === 'High' ? '#f59e0b' : '#10b981', marginTop: '4px', fontWeight: '700' }}>
                      👥 Crowd: {p.crowdLevel} ({p.crowdStatus})
                    </div>

                    <button
                      onClick={() => onGetDirections(p)}
                      className="pill-action-btn"
                      style={{ width: '100%', marginTop: '14px', padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <Navigation size={14} /> Open Route & Directions →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Route Steps Schedule */}
          {aiResponse.routeSteps && (
            <div style={{ marginTop: '20px', background: 'var(--input-bg)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '12px' }}>
                📍 AI Route Itinerary:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {aiResponse.routeSteps.map((step, idx) => (
                  <div key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '10px', background: 'var(--card-bg)' }}>
                    <strong>Stop {step.stop}: {step.name}</strong> ({step.duration}) — <em>{step.note}</em>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
