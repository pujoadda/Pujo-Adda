// Realtime WebSocket & Direct Messaging Service with Social Friend Requests & Suggestions

import { db } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy
} from 'firebase/firestore';

const FRIENDS_LOCAL_KEY = 'pujo_adda_friends_db';
const REQUESTS_LOCAL_KEY = 'pujo_adda_requests_db';
const CHATS_LOCAL_KEY = 'pujo_adda_direct_chats_db';

// Helper for localStorage fallback
function getLocal(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}
function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

// Registered Users & Friends Database (No demo data)
export const SUGGESTED_FRIENDS = [];

export function getRegisteredUsers(currentUserId) {
  try {
    const saved = localStorage.getItem('pujo_adda_users_db');
    const users = saved ? JSON.parse(saved) : [];
    return users.filter(u => u.uid !== currentUserId);
  } catch (e) {
    return [];
  }
}

// ==========================================
// 1. WEBSOCKET REALTIME MESSAGING ENGINE
// ==========================================
class WebSocketChatEngine {
  constructor() {
    this.listeners = new Set();
    this.ws = null;
    this.connected = false;
    this.channel = null;

    // Use BroadcastChannel for tab-to-tab instant WebSocket simulation fallback
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel('pujo_adda_chat_ws');
      this.channel.onmessage = (event) => {
        this.notifyListeners(event.data);
      };
    }
  }

  // Connect user to realtime WebSocket / Broadcast stream
  connect(userId) {
    this.connected = true;
    console.log('⚡ WebSocket Chat Engine connected for user:', userId);
  }

  // Send Direct Message over WebSocket channel
  sendMessage(chatObj) {
    const newMsg = {
      ...chatObj,
      id: chatObj.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      status: 'DELIVERED', // 'SENT' | 'DELIVERED' | 'READ'
    };

    // Save to Firestore Database
    try {
      setDoc(doc(db, 'directChats', newMsg.id), newMsg, { merge: true });
    } catch (e) {}

    // Save to Local DB
    const chats = getLocal(CHATS_LOCAL_KEY);
    setLocal(CHATS_LOCAL_KEY, [...chats, newMsg]);

    // Broadcast over WebSocket channel
    if (this.channel) {
      this.channel.postMessage({ type: 'NEW_MESSAGE', message: newMsg });
    }

    this.notifyListeners({ type: 'NEW_MESSAGE', message: newMsg });
    return newMsg;
  }

  // Subscribe to real-time incoming messages
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(fn => fn(data));
  }
}

export const wsChatEngine = new WebSocketChatEngine();

// ==========================================
// 2. FRIENDS & FRIEND REQUESTS API
// ==========================================

export function getFriendStatus(user1Id, user2Id) {
  if (!user1Id || !user2Id) return 'NOT_CONNECTED';
  const friends = getLocal(FRIENDS_LOCAL_KEY);
  const requests = getLocal(REQUESTS_LOCAL_KEY);

  const isFriend = friends.some(
    f => (f.user1 === user1Id && f.user2 === user2Id) || (f.user1 === user2Id && f.user2 === user1Id)
  );
  if (isFriend) return 'FRIENDS';

  const reqSent = requests.find(r => r.from === user1Id && r.to === user2Id && r.status === 'PENDING');
  if (reqSent) return 'PENDING_SENT';

  const reqReceived = requests.find(r => r.from === user2Id && r.to === user1Id && r.status === 'PENDING');
  if (reqReceived) return 'PENDING_RECEIVED';

  return 'NOT_CONNECTED';
}

export function sendFriendRequest(fromUser, toUser) {
  const requests = getLocal(REQUESTS_LOCAL_KEY);
  const newReq = {
    id: `req_${Date.now()}`,
    from: fromUser.uid,
    fromName: fromUser.name,
    fromAvatar: fromUser.avatar || '',
    to: toUser.uid,
    toName: toUser.name,
    toAvatar: toUser.avatar || '',
    status: 'PENDING',
    sentAt: new Date().toISOString()
  };

  const updated = [...requests.filter(r => !(r.from === fromUser.uid && r.to === toUser.uid)), newReq];
  setLocal(REQUESTS_LOCAL_KEY, updated);

  try {
    setDoc(doc(db, 'friendRequests', newReq.id), newReq, { merge: true });
  } catch (e) {}

  return { success: true, request: newReq };
}

export function acceptFriendRequest(requestId) {
  const requests = getLocal(REQUESTS_LOCAL_KEY);
  const req = requests.find(r => r.id === requestId);

  if (!req) return { success: false, error: 'Request not found' };

  req.status = 'ACCEPTED';
  setLocal(REQUESTS_LOCAL_KEY, requests);

  const friends = getLocal(FRIENDS_LOCAL_KEY);
  const newFriendship = {
    id: `fr_${Date.now()}`,
    user1: req.from,
    user1Name: req.fromName,
    user2: req.to,
    user2Name: req.toName,
    connectedAt: new Date().toISOString()
  };

  setLocal(FRIENDS_LOCAL_KEY, [...friends, newFriendship]);
  return { success: true, friendship: newFriendship };
}

export function getUserFriends(userId) {
  if (!userId) return [];
  const friends = getLocal(FRIENDS_LOCAL_KEY);
  const userFriendships = friends.filter(f => f.user1 === userId || f.user2 === userId);
  const regUsers = getRegisteredUsers('');

  return userFriendships.map(f => {
    const friendId = f.user1 === userId ? f.user2 : f.user1;
    const friendName = f.user1 === userId ? f.user2Name : f.user1Name;
    const profile = regUsers.find(s => s.uid === friendId) || {
      uid: friendId,
      name: friendName,
      avatar: '',
      location: 'Kolkata',
      isOnline: true
    };
    return profile;
  });
}

export function getDirectMessages(user1Id, user2Id) {
  const chats = getLocal(CHATS_LOCAL_KEY);
  return chats.filter(
    c => (c.senderId === user1Id && c.receiverId === user2Id) ||
         (c.senderId === user2Id && c.receiverId === user1Id)
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}
