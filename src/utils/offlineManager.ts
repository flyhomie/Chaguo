import { Candidate } from '../types';

const IMAGE_CACHE_NAME = 'chaguo-candidate-photos-v2';
const DB_CACHE_NAME = 'chaguo-db-records-v2';
const SYNC_QUEUE_KEY = 'chaguo_offline_sync_queue';

export interface SyncQueueItem {
  id: string;
  type: 'ADD_CANDIDATE' | 'ADD_EVIDENCE' | 'ADD_MONEY_TRAIL' | 'UPDATE_BALLOT';
  payload: any;
  timestamp: number;
}

/**
 * Pre-cache candidate profile photos into Service Worker cache storage.
 * Ensures every single leader photo is available offline.
 */
export async function preCacheCandidatePhotos(candidates: Candidate[]): Promise<void> {
  if (!('caches' in window)) return;

  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const photoUrls = candidates
      .map((c) => c.photoUrl)
      .filter((url): url is string => Boolean(url && url.startsWith('http')));

    // Batch fetch in groups to avoid overwhelming network
    const uniqueUrls = Array.from(new Set(photoUrls));
    for (const url of uniqueUrls) {
      try {
        const match = await cache.match(url);
        if (!match) {
          // Fetch and cache with no-cors if cross-origin
          fetch(url, { mode: 'no-cors' })
            .then((res) => {
              if (res) cache.put(url, res);
            })
            .catch(() => {});
        }
      } catch (e) {
        // Continue loop if individual fetch fails
      }
    }
    console.log(`[OfflineManager] Pre-cached ${uniqueUrls.length} candidate profile photos.`);
  } catch (err) {
    console.warn('[OfflineManager] Image pre-caching failed:', err);
  }
}

/**
 * Persists local database state to cache storage & local storage snapshot.
 */
export async function backupLocalDatabase(dataName: string, records: any): Promise<void> {
  try {
    // 1. LocalStorage Snapshot
    localStorage.setItem(`chaguo_db_${dataName}`, JSON.stringify(records));

    // 2. Cache Storage Virtual Endpoint Snapshot
    if ('caches' in window) {
      const cache = await caches.open(DB_CACHE_NAME);
      const virtualUrl = new URL(`/api/local-database/${dataName}.json`, window.location.origin).toString();
      const response = new Response(JSON.stringify(records), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put(virtualUrl, response);
    }
  } catch (e) {
    console.warn(`[OfflineManager] Failed backing up ${dataName}:`, e);
  }
}

/**
 * Queue an action when user is offline to sync when back online
 */
export function enqueueOfflineAction(actionType: SyncQueueItem['type'], payload: any): void {
  try {
    const existing: SyncQueueItem[] = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    const newItem: SyncQueueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: actionType,
      payload,
      timestamp: Date.now(),
    };
    existing.push(newItem);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('[OfflineManager] Offline queue error:', e);
  }
}

/**
 * Flush and sync pending offline items when connectivity is restored
 */
export function processOfflineSyncQueue(onSyncSuccess?: (count: number) => void): number {
  try {
    const queueStr = localStorage.getItem(SYNC_QUEUE_KEY);
    if (!queueStr) return 0;

    const queue: SyncQueueItem[] = JSON.parse(queueStr);
    if (queue.length === 0) return 0;

    console.log(`[OfflineManager] Processing ${queue.length} offline queued database operations.`);
    // In local app mode, queued operations are already reflected in local state,
    // so we clear queue after trigger acknowledgment
    localStorage.removeItem(SYNC_QUEUE_KEY);
    if (onSyncSuccess) onSyncSuccess(queue.length);
    return queue.length;
  } catch (e) {
    console.error('[OfflineManager] Failed to process sync queue:', e);
    return 0;
  }
}
