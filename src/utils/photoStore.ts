/** Armazena fotos dos viajantes no IndexedDB do navegador (somente neste aparelho). */
export interface OwnPhoto {
  id: string
  /** cidade ou data do caderno à qual a foto pertence */
  scope: string
  caption: string
  dataUrl: string
  createdAt: string
}

const DB = 'en26-fotos'
const STORE = 'fotos'

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB indisponível neste navegador.'))
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => {
      const s = req.result.createObjectStore(STORE, { keyPath: 'id' })
      s.createIndex('scope', 'scope')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const r = fn(t.objectStore(STORE))
        r.onsuccess = () => resolve(r.result)
        r.onerror = () => reject(r.error)
      }),
  )
}

export const photoStore = {
  list: (scope?: string) =>
    tx<OwnPhoto[]>('readonly', (s) => (scope ? s.index('scope').getAll(scope) : s.getAll())).then((l) =>
      l.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    ),
  put: (p: OwnPhoto) => tx('readwrite', (s) => s.put(p)),
  remove: (id: string) => tx('readwrite', (s) => s.delete(id)),
}
