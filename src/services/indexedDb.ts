/**
 * IndexedDB Local Storage & Analytics Engine — Le Mythe de Sisyphe
 * Robust offline persistence for runs, analytics, category bests, and sparkline trends.
 */

export interface LocalRunRecord {
  id: string;
  distance: number;
  altitude: number;
  time: number;
  pushes: number;
  season: string;
  gameMode: string;
  event?: string;
  isNewRecord: boolean;
  timestamp: number;
  dateStr: string;
}

export interface LocalStatsSummary {
  totalRuns: number;
  maxDistance: number;
  averageDistance: number;
  trend7dPercent: number; // e.g. +14.2% vs previous 7 days
  bestSpeedRun: LocalRunRecord | null; // highest meters/sec
  bestEnduranceRun: LocalRunRecord | null; // longest survival time
  last20Runs: LocalRunRecord[];
  top10Runs: LocalRunRecord[];
}

const DB_NAME = 'sisyphus_local_db';
const DB_VERSION = 1;
const STORE_RUNS = 'runs';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_RUNS)) {
        const store = db.createObjectStore(STORE_RUNS, { keyPath: 'id' });
        store.createIndex('distance', 'distance', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLocalRun(run: Omit<LocalRunRecord, 'id' | 'dateStr'>): Promise<LocalRunRecord> {
  const fullRecord: LocalRunRecord = {
    ...run,
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    dateStr: new Date(run.timestamp).toLocaleDateString()
  };

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_RUNS, 'readwrite');
      const store = tx.objectStore(STORE_RUNS);
      store.add(fullRecord);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn('Could not save run to IndexedDB, fallback to localStorage cache:', error);
    try {
      const existing = JSON.parse(localStorage.getItem('sisyphus_fallback_runs') || '[]');
      existing.unshift(fullRecord);
      localStorage.setItem('sisyphus_fallback_runs', JSON.stringify(existing.slice(0, 50)));
    } catch {}
  }

  return fullRecord;
}

export async function getAllLocalRuns(): Promise<LocalRunRecord[]> {
  try {
    const db = await openDatabase();
    return await new Promise<LocalRunRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_RUNS, 'readonly');
      const store = tx.objectStore(STORE_RUNS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      return JSON.parse(localStorage.getItem('sisyphus_fallback_runs') || '[]');
    } catch {
      return [];
    }
  }
}

export async function getLocalStatsSummary(): Promise<LocalStatsSummary> {
  const all = await getAllLocalRuns();

  if (all.length === 0) {
    return {
      totalRuns: 0,
      maxDistance: 0,
      averageDistance: 0,
      trend7dPercent: 0,
      bestSpeedRun: null,
      bestEnduranceRun: null,
      last20Runs: [],
      top10Runs: []
    };
  }

  // Sort by timestamp desc for recent sessions
  const sortedRecent = [...all].sort((a, b) => b.timestamp - a.timestamp);
  const last20 = sortedRecent.slice(0, 20);

  // Top 10 by distance desc
  const sortedDistance = [...all].sort((a, b) => b.distance - a.distance);
  const top10 = sortedDistance.slice(0, 10);

  const maxDist = sortedDistance[0]?.distance || 0;
  const avgDist = all.reduce((sum, r) => sum + r.distance, 0) / all.length;

  // Best Speed Run (min 15m distance, highest meters/sec)
  let bestSpeed: LocalRunRecord | null = null;
  let maxPace = 0;
  for (const r of all) {
    if (r.distance >= 15 && r.time > 0) {
      const pace = r.distance / r.time;
      if (pace > maxPace) {
        maxPace = pace;
        bestSpeed = r;
      }
    }
  }

  // Best Endurance Run (longest survival time)
  const bestEndurance = [...all].sort((a, b) => b.time - a.time)[0] || null;

  // 7-Day Trend: compare runs in last 7 days vs previous 7 days
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const recent7dRuns = all.filter((r) => r.timestamp >= now - sevenDaysMs);
  const previous7dRuns = all.filter((r) => r.timestamp >= now - sevenDaysMs * 2 && r.timestamp < now - sevenDaysMs);

  const avgRecent = recent7dRuns.length > 0 ? recent7dRuns.reduce((s, r) => s + r.distance, 0) / recent7dRuns.length : 0;
  const avgPrev = previous7dRuns.length > 0 ? previous7dRuns.reduce((s, r) => s + r.distance, 0) / previous7dRuns.length : 0;

  let trend = 0;
  if (avgPrev > 0) {
    trend = Math.round(((avgRecent - avgPrev) / avgPrev) * 100);
  } else if (avgRecent > 0) {
    trend = 100;
  }

  return {
    totalRuns: all.length,
    maxDistance: maxDist,
    averageDistance: avgDist,
    trend7dPercent: trend,
    bestSpeedRun: bestSpeed || top10[0] || null,
    bestEnduranceRun: bestEndurance,
    last20Runs: last20,
    top10Runs: top10
  };
}

export async function getLocalRunsByEvent(eventTag: string): Promise<LocalRunRecord[]> {
  const all = await getAllLocalRuns();
  return all
    .filter((r) => r.event === eventTag)
    .sort((a, b) => b.distance - a.distance);
}
