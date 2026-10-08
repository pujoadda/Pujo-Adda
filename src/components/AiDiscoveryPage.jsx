import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { processAiPujoQuery } from '../services/aiService';

export default function AiDiscoveryPage({ userLocation, onGetDirections }) {
  const [queryInput, setQueryInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const samplePrompts = [
    "What Durga Puja pandals can I visit near me?",
    "I have 6 hours. Make me a North Kolkata Puja route.",
    "Show me less crowded festival areas.",
    "Which festival is happening in Kolkata this weekend?"
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
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🤖 AI PUJO DISCOVERY ASSISTANT</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Natural language AI festival discovery grounded strictly on real database records (No fake/hallucinated locations).
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', marginBottom: '28px', border: '1px solid var(--border-glow)' }}>
        {/* Sample Prompt Chips */}
        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Try natural language AI discovery prompts:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(p)}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--input-bg)',
                color: 'var(--accent-gold)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              💬 "{p}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleRunAi} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask AI: 'I have 6 hours in Kolkata, create a route...' "
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            style={{ fontSize: '0.95rem' }}
          />
          <button
            type="submit"
            disabled={isThinking}
            className="pill-action-btn"
            style={{ padding: '0 24px', flexShrink: 0 }}
          >
            {isThinking ? 'AI Thinking...' : 'Ask AI'}
          </button>
        </form>
      </div>

      {/* AI Response Output Box */}
      {aiResponse && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '24px', border: '1.5px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-gold)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '12px' }}>
            <Bot size={22} />
            <span>AI Discovery Recommendations</span>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '20px', whiteSpace: 'pre-line' }}>
            {aiResponse.text}
          </p>

          {/* Recommendations Cards */}
          {aiResponse.recommendations && aiResponse.recommendations.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {aiResponse.recommendations.map(p => (
                <div key={p.id} style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{p.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>🎨 {p.theme}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.nearestMetro}</div>
                  <button
                    onClick={() => onGetDirections(p)}
                    className="pill-action-btn"
                    style={{ width: '100%', marginTop: '12px', padding: '6px', fontSize: '0.78rem', justifyContent: 'center' }}
                  >
                    Route Here →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Route Steps if AI generated route */}
          {aiResponse.routeSteps && (
            <div style={{ marginTop: '16px', background: 'var(--input-bg)', padding: '16px', borderRadius: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '10px' }}>
                AI Generated Route Schedule:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {aiResponse.routeSteps.map((step, idx) => (
                  <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
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
