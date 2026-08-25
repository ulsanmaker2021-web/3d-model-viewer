import { ModelItem } from '../types';

const DB_NAME = '3D_GLB_Gallery_DB';
const DB_VERSION = 1;
const STORE_NAME = 'models';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveModelToDB(model: ModelItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Save with blob, without transient Object URL
    const itemToStore = {
      ...model,
      url: '', // Object URL should be generated on load
    };

    const request = store.put(itemToStore);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCustomModelsFromDB(): Promise<ModelItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as ModelItem[];
        // Recreate object URLs for blobs
        const processed = items.map((item) => {
          if (item.blob) {
            return {
              ...item,
              url: URL.createObjectURL(item.blob),
            };
          }
          return item;
        });
        resolve(processed);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to load models from IndexedDB:', err);
    return [];
  }
}

export async function deleteModelFromDB(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function updateModelInDB(id: string, updates: Partial<ModelItem>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const current = getReq.result;
      if (!current) {
        resolve();
        return;
      }
      const updated = { ...current, ...updates, url: '' };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };

    getReq.onerror = () => reject(getReq.error);
  });
}
