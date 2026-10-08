import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  ShieldAlert,
  Lock,
  Radio,
  Camera,
  Heart,
  Plus,
  Send,
  X,
  AlertCircle,
  UserPlus,
  Sparkles,
  MapPin,
  CheckCheck,
  Image,
  Smile
} from 'lucide-react';
import { INITIAL_PARTNER_PROFILES, INITIAL_LOOKBOOK_POSTS } from '../data/socialData';
import { createSquadRoom, joinSquadRoom } from '../services/firebaseService';
import {
  getRegisteredUsers,
  getFriendStatus,
  sendFriendRequest,
  getUserFriends,
  getDirectMessages,
  wsChatEngine
} from '../services/socialService';

export default function AddaSocialPage({ user, onOpenAuth }) {
  const [subTab, setSubTab] = useState('chat'); // 'chat' | 'friends' | 'squad' | 'lookbook'

  // Selected Chat User for Direct 1-on-1 Messenger
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [inputChatText, setInputChatText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Registered members / user friends
  const registeredMembers = React.useMemo(() => {
    return getRegisteredUsers(user?.uid || '');
  }, [user]);

  const userFriendsList = React.useMemo(() => {
    return user ? getUserFriends(user.uid) : [];
  }, [user]);

  // Friend Request States
  const [requestState, setRequestState] = useState({});

  // Pujo Squad (4-digit code room)
  const [squadCodeInput, setSquadCodeInput] = useState('');
  const [activeSquad, setActiveSquad] = useState(null);
  const [squadError, setSquadError] = useState('');

  // Auto select first member or friend if activeChatUser is null
  useEffect(() => {
    if (!activeChatUser) {
      if (userFriendsList.length > 0) {
        setActiveChatUser(userFriendsList[0]);
      } else if (registeredMembers.length > 0) {
        setActiveChatUser(registeredMembers[0]);
      }
    }
  }, [userFriendsList, registeredMembers]);

  // Connect WebSocket realtime listener
  useEffect(() => {
    const currentUserId = user ? user.uid : 'guest_uid';
    wsChatEngine.connect(currentUserId);

    // Initial messages load
    if (activeChatUser && user) {
      const existingMsgs = getDirectMessages(currentUserId, activeChatUser.uid);
      setChatMessages(existingMsgs);
    } else {
      setChatMessages([]);
    }

    // Subscribe to WebSocket live stream
    const unsubscribe = wsChatEngine.subscribe((event) => {
      if (event.type === 'NEW_MESSAGE') {
        const msg = event.message;
        if (
          (msg.senderId === activeChatUser?.uid && msg.receiverId === currentUserId) ||
          (msg.senderId === currentUserId && msg.receiverId === activeChatUser?.uid)
        ) {
          setChatMessages(prev => [...prev.filter(m => m.id !== msg.id), msg]);
        }
      }
    });

    return () => unsubscribe();
  }, [user, activeChatUser]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputChatText.trim()) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    const newMsg = wsChatEngine.sendMessage({
      senderId: user.uid,
      senderName: user.name,
      receiverId: activeChatUser.uid,
      receiverName: activeChatUser.name,
      text: inputChatText.trim()
    });

    setChatMessages(prev => [...prev, newMsg]);
    setInputChatText('');
  };

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

  const handleCreateSquad = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    const res = await createSquadRoom({
      creatorId: user.uid,
      creatorName: user.name,
      name: `${user.name}'s Pujo Squad`
    });
    if (res.success) {
      setActiveSquad(res.squad);
    }
  };

  const handleJoinSquad = async (e) => {
    e.preventDefault();
    setSquadError('');
    if (!user) {
      onOpenAuth();
      return;
    }
    const res = await joinSquadRoom(squadCodeInput.trim(), user);
    if (res.success) {
      setActiveSquad(res.squad);
    } else {
      setSquadError(res.error || 'Failed to join squad.');
    }
  };

  return (
    <div className="adda-social-container animate-fade-in" style={{ padding: '0 20px 40px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '900'
            }}>
              💬 DIRECT CHAT & PUJO FRIENDS
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Realtime WebSocket Messaging, Friend Requests & Suggested Pujo Connections across Bengal.
          </p>
        </div>

        {/* User Login Badge */}
        {!user && (
          <button
            onClick={onOpenAuth}
            style={{
              padding: '10px 18px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              color: '#000',
              fontWeight: '900',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Login / Register to Chat
          </button>
        )}
      </div>

      {/* Social Safety Disclaimer */}
      <div style={{
        padding: '10px 16px',
        borderRadius: '16px',
        background: 'rgba(56, 189, 248, 0.12)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        color: '#38bdf8',
        fontSize: '0.8rem',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <ShieldCheck size={18} style={{ flexShrink: 0 }} />
        <span>
          <strong>Social Privacy Notice:</strong> Connect with verified festival enthusiasts. Meet in public places. Pujo Adda never shares your private phone number or exact GPS coordinates.
        </span>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'chat', label: '💬 Direct Chat Messenger', icon: MessageSquare },
          { id: 'friends', label: '✨ Suggested Pujo Friends', icon: Users },
          { id: 'squad', label: '🛡️ Pujo Radar Squad', icon: ShieldCheck },
          { id: 'lookbook', label: '👗 Festival Lookbook', icon: Camera }
        ].map(tab => {
          const TIcon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '18px',
                border: isActive ? '1px solid #e11d48' : '1px solid var(--border-color)',
                background: isActive ? 'linear-gradient(135deg, #e11d48, #be123c)' : 'var(--input-bg)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 15px rgba(225, 29, 72, 0.3)' : 'none'
              }}
            >
              <TIcon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. DIRECT MESSENGER CHAT TAB */}
      {/* ========================================================================= */}
      {subTab === 'chat' && (
        <div className="glass-panel" style={{
          height: '620px',
          maxHeight: '80vh',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-main)'
        }}>
          {/* Left Conversations Sidebar */}
          <div style={{
            borderRight: '1px solid var(--border-color)',
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                Direct Messages
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: '800', background: 'rgba(34,197,94,0.15)', padding: '2px 8px', borderRadius: '10px' }}>
                ● WebSocket Active
              </span>
            </div>

            {/* Registered Users Chat List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {registeredMembers.length === 0 ? (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No active members registered yet.
                </div>
              ) : (
                registeredMembers.map(friend => {
                  const isSelected = activeChatUser?.uid === friend.uid;
                  return (
                    <div
                      key={friend.uid}
                      onClick={() => setActiveChatUser(friend)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        background: isSelected ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                        border: isSelected ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '4px'
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <img src={friend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} alt={friend.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                        {friend.isOnline && (
                          <span style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', border: '2px solid var(--bg-card)' }} />
                        )}
                      </div>

                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {friend.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {friend.location || 'Kolkata'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Main Conversation Window */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-card)' }}>
            {/* Conversation Header */}
            {activeChatUser && (
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={activeChatUser.avatar} alt={activeChatUser.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {activeChatUser.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: activeChatUser.isOnline ? '#4ade80' : 'var(--text-muted)', fontWeight: '700' }}>
                      {activeChatUser.isOnline ? '● Online Now' : 'Active 15m ago'} • {activeChatUser.location}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleAddFriend(activeChatUser)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--accent-gold)',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <UserPlus size={14} /> Add Friend
                  </button>
                </div>
              </div>
            )}

            {/* Messages Feed */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatMessages.map((msg, index) => {
                const isMe = user && (msg.senderId === user.uid || msg.senderName === user.name || msg.sender === 'You' || msg.sender === user.name);

                return (
                  <div
                    key={msg.id || index}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        background: isMe ? 'linear-gradient(135deg, #e11d48, #be123c)' : 'var(--input-bg)',
                        color: '#fff',
                        fontSize: '0.88rem',
                        lineHeight: '1.4',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: isMe ? 'none' : '1px solid var(--border-color)'
                      }}
                    >
                      {msg.text}
                    </div>

                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : msg.time || 'Just now'}</span>
                      {isMe && <CheckCheck size={12} color="#4ade80" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)' }}>
              <input
                type="text"
                className="form-input"
                placeholder={user ? `Message ${activeChatUser.name}...` : 'Login to start chatting...'}
                value={inputChatText}
                onChange={(e) => setInputChatText(e.target.value)}
                style={{ flex: 1, fontSize: '0.88rem', padding: '12px 16px', borderRadius: '24px' }}
              />

              <button
                type="submit"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)'
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUGGESTED PUJO FRIENDS TAB */}
      {/* ========================================================================= */}
      {subTab === 'friends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            REGISTERED PUJO MEMBERS & FRIENDS
          </div>

          {registeredMembers.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '24px' }}>
              <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                No Member Suggestions Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                When other users register on Pujo Adda, they will appear here so you can send friend requests and chat!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {registeredMembers.map(friend => {
                const status = requestState[friend.uid] || getFriendStatus(user?.uid, friend.uid);
                return (
                  <div key={friend.uid} className="glass-panel" style={{ padding: '20px', borderRadius: '22px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                      <img src={friend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} alt={friend.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }} />
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                          {friend.name}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                          <MapPin size={12} /> {friend.location || 'Kolkata'}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px' }}>
                      "{friend.bio || 'Festival enthusiast exploring Kolkata!'}"
                    </p>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {status === 'FRIENDS' ? (
                        <button
                          onClick={() => { setActiveChatUser(friend); setSubTab('chat'); }}
                          style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'linear-gradient(135deg, #e11d48, #f59e0b)', border: 'none', color: '#fff', fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                          Message
                        </button>
                      ) : status === 'PENDING_SENT' ? (
                        <button disabled style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)', color: 'var(--accent-gold)', fontWeight: '800', fontSize: '0.82rem' }}>
                          Request Sent ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddFriend(friend)}
                          style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', color: '#fff', fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                          + Add Friend
                        </button>
                      )}

                      <button
                        onClick={() => { setActiveChatUser(friend); setSubTab('chat'); }}
                        style={{ padding: '10px 14px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
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
      )}

      {/* ========================================================================= */}
      {/* 3. PUJO RADAR SQUAD TAB */}
      {/* ========================================================================= */}
      {subTab === 'squad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '12px' }}>
              🛡️ 4-DIGIT PUJO RADAR SQUAD ROOM
            </h2>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Create a temporary 4-digit code room for your pandal hopping group. Expires automatically in 6 hours.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={handleCreateSquad}
                style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #e11d48, #f59e0b)', border: 'none', color: '#fff', fontWeight: '900', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                + Create Squad Room
              </button>

              <form onSubmit={handleJoinSquad} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter 4-Digit Code"
                  value={squadCodeInput}
                  onChange={(e) => setSquadCodeInput(e.target.value)}
                  maxLength={4}
                  style={{ width: '160px', textTransform: 'uppercase', textAlign: 'center', fontSize: '0.9rem', fontWeight: '800' }}
                />
                <button
                  type="submit"
                  style={{ padding: '12px 18px', borderRadius: '14px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '800', fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Join Room
                </button>
              </form>
            </div>

            {squadError && <div style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '10px' }}>{squadError}</div>}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LOOKBOOK ADDA TAB */}
      {/* ========================================================================= */}
      {subTab === 'lookbook' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {INITIAL_LOOKBOOK_POSTS.map(post => (
              <div key={post.id} className="glass-panel" style={{ borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{post.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>By {post.user} • {post.locationTag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
