import React, { useState } from 'react';
import { Mail, Phone, ShieldAlert, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'General Inquiry & Feedback',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        category: 'General Inquiry & Feedback',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="animate-fade-in" style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 20px 80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '40px'
    }}>
      {/* Top Header Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 18px',
        borderRadius: '30px',
        background: 'rgba(56, 189, 248, 0.12)',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        color: 'var(--accent-cyan)',
        fontSize: '0.85rem',
        fontWeight: '700'
      }}>
        <MessageSquare size={15} /> 24/7 Helpline & Inquiry Portal
      </div>

      {/* Hero Title & Subtitle */}
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '900',
          color: 'var(--text-primary)',
          letterSpacing: '-0.8px',
          marginBottom: '10px'
        }}>
          Contact Pujo Adda Team
        </h1>
        <p className="bengali-title" style={{
          fontSize: '1.25rem',
          color: 'var(--accent-gold)',
          fontWeight: '700',
          lineHeight: 1.5
        }}>
          যোগাযোগ করুন — ক্লাব নিবন্ধকরণ, সহায়তা ও প্রতিক্রিয়া
        </p>
      </div>

      {/* Grid Layout: Left Contact Form & Right Stacked Info Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '28px',
        width: '100%'
      }}>
        {/* Left Side: Send Us a Message Form Card */}
        <div className="glass-card under-shadow-glow" style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Send Us a Message
          </h2>

          {submitted ? (
            <div style={{
              padding: '24px',
              borderRadius: '16px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#4ade80',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px'
            }}>
              <CheckCircle size={36} />
              <h4 style={{ margin: 0, fontWeight: '800' }}>Message Sent Successfully!</h4>
              <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>
                Thank you for reaching out to Pujo Adda team. We will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anirban Das"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98300 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Inquiry Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="General Inquiry & Feedback">General Inquiry & Feedback</option>
                  <option value="Club / Pandal Registration">Club / Pandal Registration</option>
                  <option value="Sponsorship & Media">Sponsorship & Media</option>
                  <option value="Emergency & Crowd Support">Emergency & Crowd Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your message, pandal detail, or feedback here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="pill-action-btn"
                style={{
                  padding: '14px',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  marginTop: '6px',
                  background: 'linear-gradient(135deg, var(--accent-gold), #d97706)',
                  color: '#000',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)'
                }}
              >
                <Send size={16} /> Submit Message
              </button>
            </form>
          )}
        </div>

        {/* Right Side: 4 Stacked Helpline & Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1: Email */}
          <div className="glass-card under-shadow-glow" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(225, 29, 72, 0.2)', border: '1px solid rgba(225, 29, 72, 0.4)', color: 'var(--accent-crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Email Support</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: '700', margin: '0 0 2px 0' }}>support@pujoadda2026.com</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Response time: &lt; 24 hours</p>
            </div>
          </div>

          {/* Card 2: Metro Helpline */}
          <div className="glass-card under-shadow-glow" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Metro Rail & Puja Helpline</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: '700', margin: '0 0 2px 0' }}>139 (Kolkata Metro Night Service)</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>24-Hour Special Night Train Info</p>
            </div>
          </div>

          {/* Card 3: Police Emergency */}
          <div className="glass-card under-shadow-glow" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Kolkata Police Emergency</h4>
              <p style={{ fontSize: '0.9rem', color: '#f87171', fontWeight: '700', margin: '0 0 2px 0' }}>100 / 1090 (Women Helpline)</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Emergency Medical & Crowd Control</p>
            </div>
          </div>

          {/* Card 4: Information Desks (Highlighted in screenshot 2 with amber glow border) */}
          <div className="glass-card under-shadow-glow" style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            borderColor: 'rgba(245, 158, 11, 0.7)',
            boxShadow: '0 12px 30px -5px rgba(245, 158, 11, 0.35)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Information Desks</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 2px 0', fontWeight: '600' }}>
                North Hub: Sovabazar | South Hub: Rashbehari
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Physical Guide Kiosks during Puja</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
