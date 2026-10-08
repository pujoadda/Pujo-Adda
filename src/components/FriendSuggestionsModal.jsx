import React, { useState, useMemo } from 'react';
import { X, UserPlus, UserCheck, MessageSquare, Sparkles, ShieldCheck, MapPin, Heart, Check, Compass, Users } from 'lucide-react';
import { getRegisteredUsers, getFriendStatus, sendFriendRequest } from '../services/socialService';

export default function FriendSuggestionsModal({ user, onClose, onOpenChatWithUser, onOpenAuth }) {
  const [requestState, setRequestState] = useState({});

  const suggestions = useMemo(() => {
    return getRegisteredUsers(user?.uid || '');
  }, [user]);

  const handleAddFriend = (targetUser) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    const res = sendFriendRequest(user, targetUser);
    if (res.success) {
      setRequestState(prev => ({ ...prev, [targetUser.uid]: 'PENDING_SENT' }));
    }
  };

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 2050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '780px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          borderRadius: '24px',
          border: '1px solid rgba(225, 29, 72, 0.4)',
          background: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(225, 29, 72, 0.2)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.25), rgba(245, 158, 11, 0.25))',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #e11d48, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>SUGGESTED PUJO FRIENDS & CONNECTIONS</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Discover registered festival lovers near your locality. Add friends & chat in real time!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
            PEOPLE YOU MAY KNOW IN WEST BENGAL
          </div>

          {suggestions.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                No Member Suggestions Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                As new users register on Pujo Adda, they will appear here so you can connect and share festival plans!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {suggestions.map((friend) => {
                const currentStatus = requestState[friend.uid] || getFriendStatus(user?.uid, friend.uid);
                const isPending = currentStatus === 'PENDING_SENT';
                const isFriend = currentStatus === 'FRIENDS';

              return (
                <div
                  key={friend.uid}
                  style={{
                    background: 'var(--input-bg)',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }}
                        />
                        {friend.isOnline && (
                          <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#22c55e', border: '2px solid var(--bg-card)' }} />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                          {friend.name}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} /> {friend.location}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {friend.mutualFriendsCount} mutual festival friends
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0 0 14px 0' }}>
                      "{friend.bio}"
                    </p>

                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '700', marginBottom: '14px' }}>
                      🎨 Interest: {friend.interest}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    {isFriend ? (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenChatWithUser(friend);
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
                          border: 'none',
                          color: '#fff',
                          fontWeight: '800',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <MessageSquare size={16} /> Direct Message
                      </button>
                    ) : isPending ? (
                      <button
                        disabled
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--accent-gold)',
                          fontWeight: '800',
                          fontSize: '0.82rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <UserCheck size={16} /> Request Sent
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(friend)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          border: 'none',
                          color: '#fff',
                          fontWeight: '800',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                        }}
                      >
                        <UserPlus size={16} /> Add Friend
                      </button>
                    )}

                    <button
                      onClick={() => onOpenChatWithUser(friend)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
