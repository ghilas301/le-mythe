import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocFromServer,
  getDocs,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export interface CloudLeaderboardEntry {
  id: string;
  deviceId: string;
  playerName: string;
  distance: number;
  altitude: number;
  time: number;
  pushes: number;
  season: string;
  gameMode: string;
  event?: string;
  timestamp: number;
}

// 1. Safe Firebase App Initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Named Database ID Support (as provisioned in firebase-applet-config)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// 3. Mandatory Connection Validator and Error Handler per Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous ?? true,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

let isConnected = false;
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    isConnected = true;
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using local fallback.');
      return false;
    }
    // Expected if test doc does not exist, but connection succeeds
    isConnected = true;
    return true;
  }
}
testFirebaseConnection().catch(() => {});

// 4. Anonymous Device Identifier (Persistent in localStorage)
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'device_server';
  let deviceId = localStorage.getItem('sisyphus_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    try {
      localStorage.setItem('sisyphus_device_id', deviceId);
    } catch {}
  }
  return deviceId;
}

// 5. Submit Run to Global Cloud Leaderboard
export async function submitRunToCloud(entry: Omit<CloudLeaderboardEntry, 'id'>): Promise<string | null> {
  const runId = `run_${entry.deviceId.substring(0, 8)}_${entry.timestamp}`;
  const docPath = `leaderboard/${runId}`;
  try {
    const docRef = doc(db, 'leaderboard', runId);
    const payload: CloudLeaderboardEntry = {
      ...entry,
      id: runId
    };
    await setDoc(docRef, payload);
    return runId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    console.warn('Could not sync run to Cloud Firebase (falling back to local IndexedDB):', error);
    return null;
  }
}

// 6. Fetch Global Top 100 Runs
export async function fetchGlobalLeaderboard(limitCount = 100): Promise<CloudLeaderboardEntry[]> {
  try {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('distance', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    const results: CloudLeaderboardEntry[] = [];
    snap.forEach((d) => {
      results.push(d.data() as CloudLeaderboardEntry);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'leaderboard');
    console.warn('Error fetching global leaderboard:', error);
    return [];
  }
}

// 7. Calculate Approximate Global Rank
export async function calculateGlobalRank(userMaxDistance: number): Promise<{ rank: number; total: number }> {
  try {
    const topRuns = await fetchGlobalLeaderboard(100);
    if (topRuns.length === 0) return { rank: 1, total: 1 };
    
    // Position within top runs
    const betterRuns = topRuns.filter((r) => r.distance > userMaxDistance);
    const rank = betterRuns.length + 1;
    return { rank, total: Math.max(topRuns.length, 120) };
  } catch {
    return { rank: 1, total: 1 };
  }
}

// 8. Fetch Trending / Recent Runs Today
export async function fetchTrendingRuns(limitCount = 20): Promise<CloudLeaderboardEntry[]> {
  try {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const q = query(
      collection(db, 'leaderboard'),
      where('timestamp', '>=', oneDayAgo),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    const results: CloudLeaderboardEntry[] = [];
    snap.forEach((d) => results.push(d.data() as CloudLeaderboardEntry));
    return results;
  } catch {
    return [];
  }
}
