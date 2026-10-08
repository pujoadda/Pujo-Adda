// Cloud Firestore & Data Persistence Service Layer
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

const MEMORIES_LOCAL_KEY = 'pujo_adda_memories_db';
const PASSPORT_LOCAL_KEY = 'pujo_adda_passport_db';
const SQUADS_LOCAL_KEY = 'pujo_adda_squads_db';
const CHATS_LOCAL_KEY = 'pujo_adda_chats_db';
const REPORTS_LOCAL_KEY = 'pujo_adda_reports_db';

// Helpers for localStorage fallback
function getLocalArray(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : [];
  } catch (e) {
    return [];
  }
}
function saveLocalArray(key, arr) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// ==========================================
// 1. FESTIVAL MEMORIES & RECAP SYSTEM
// ==========================================
export async function saveFestivalMemory(memoryObj) {
  const newMem = {
    ...memoryObj,
    id: memoryObj.id || `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    visibility: memoryObj.visibility || 'PRIVATE', // DEFAULT PRIVATE as per section 49
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'memories', newMem.id), newMem, { merge: true });
    console.log('✅ Memory saved to Firestore:', newMem.id);
  } catch (err) {
    console.warn('Firestore fallback for memory save:', err.message);
  }

  // Always save to local cache
  const local = getLocalArray(MEMORIES_LOCAL_KEY);
  const updated = [newMem, ...local.filter(m => m.id !== newMem.id)];
  saveLocalArray(MEMORIES_LOCAL_KEY, updated);

  return { success: true, memory: newMem };
}

export async function getUserMemories(userId) {
  let list = [];
  try {
    const q = query(collection(db, 'memories'), where('userId', '==', userId));
    const snap = await getDocs(q);
    snap.forEach(d => list.push(d.data()));
  } catch (err) {
    console.warn('Firestore fallback for user memories:', err.message);
  }

  const local = getLocalArray(MEMORIES_LOCAL_KEY).filter(m => m.userId === userId || !m.userId);
  const combinedMap = new Map();
  [...list, ...local].forEach(item => combinedMap.set(item.id, item));
  return Array.from(combinedMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ==========================================
// 2. PUJO PASSPORT & GEOFENCED CHECK-IN STAMPS
// ==========================================
export async function addPassportStamp(stampObj) {
  const newStamp = {
    ...stampObj,
    id: `stamp_${stampObj.pandalId}_${Date.now()}`,
    unlockedAt: new Date().toISOString(),
    year: stampObj.year || 2026
  };

  try {
    await setDoc(doc(db, 'passportStamps', newStamp.id), newStamp, { merge: true });
  } catch (err) {
    console.warn('Firestore fallback for stamp:', err.message);
  }

  const local = getLocalArray(PASSPORT_LOCAL_KEY);
  if (!local.some(s => s.pandalId === stampObj.pandalId && s.year === newStamp.year)) {
    saveLocalArray(PASSPORT_LOCAL_KEY, [newStamp, ...local]);
  }

  return { success: true, stamp: newStamp };
}

export async function getUserPassportStamps(userId) {
  let list = [];
  try {
    const q = query(collection(db, 'passportStamps'), where('userId', '==', userId));
    const snap = await getDocs(q);
    snap.forEach(d => list.push(d.data()));
  } catch (err) {
    console.warn('Firestore fallback for passport:', err.message);
  }

  const local = getLocalArray(PASSPORT_LOCAL_KEY);
  const combinedMap = new Map();
  [...list, ...local].forEach(item => combinedMap.set(item.id, item));
  return Array.from(combinedMap.values());
}

// ==========================================
// 3. PUJO SQUAD RADAR ROOM SYSTEM
// ==========================================
export async function createSquadRoom(squadData) {
  const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code as per Section 187
  const newSquad = {
    id: `squad_${Date.now()}`,
    code: code,
    name: squadData.name || 'Pujo Hopping Squad',
    creatorId: squadData.creatorId,
    creatorName: squadData.creatorName,
    festival: squadData.festival || 'Durga Puja 2026',
    meetingPoint: squadData.meetingPoint || 'Shyambazar Metro Gate 1',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6h expiration
    members: [
      {
        uid: squadData.creatorId,
        name: squadData.creatorName,
        lat: squadData.lat || 22.5626,
        lng: squadData.lng || 88.3630,
        distMeters: 0,
        status: 'Active'
      }
    ]
  };

  try {
    await setDoc(doc(db, 'squadRooms', newSquad.code), newSquad, { merge: true });
  } catch (err) {
    console.warn('Firestore fallback for squad:', err.message);
  }

  const local = getLocalArray(SQUADS_LOCAL_KEY);
  saveLocalArray(SQUADS_LOCAL_KEY, [newSquad, ...local]);

  return { success: true, squad: newSquad };
}

export async function joinSquadRoom(code, userObj) {
  let squad = null;
  try {
    const ref = doc(db, 'squadRooms', code);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      squad = snap.data();
    }
  } catch (err) {
    console.warn('Firestore fallback for squad join:', err.message);
  }

  if (!squad) {
    const local = getLocalArray(SQUADS_LOCAL_KEY);
    squad = local.find(s => s.code === code);
  }

  if (!squad) {
    return { success: false, error: 'Invalid 4-digit Squad Code or Room Expired.' };
  }

  // Add user to members if not present
  if (!squad.members.some(m => m.uid === userObj.uid)) {
    const newMember = {
      uid: userObj.uid,
      name: userObj.name,
      lat: userObj.lat || 22.5700,
      lng: userObj.lng || 88.3600,
      distMeters: Math.floor(40 + Math.random() * 120),
      status: 'Active'
    };
    squad.members.push(newMember);

    try {
      await setDoc(doc(db, 'squadRooms', code), squad, { merge: true });
    } catch (e) {}

    const local = getLocalArray(SQUADS_LOCAL_KEY);
    const updated = local.map(s => (s.code === code ? squad : s));
    saveLocalArray(SQUADS_LOCAL_KEY, updated);
  }

  return { success: true, squad };
}

// ==========================================
// 4. USER REPORTING & MODERATION SYSTEM
// ==========================================
export async function submitUserReport(reportObj) {
  const newReport = {
    ...reportObj,
    id: `rep_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'PENDING_REVIEW'
  };

  try {
    await setDoc(doc(db, 'reports', newReport.id), newReport, { merge: true });
  } catch (err) {}

  const local = getLocalArray(REPORTS_LOCAL_KEY);
  saveLocalArray(REPORTS_LOCAL_KEY, [newReport, ...local]);

  return { success: true, report: newReport };
}
