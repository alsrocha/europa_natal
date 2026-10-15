import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'en26:'
const EVENT = 'en26-storage'

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (err) {
    console.warn('Não foi possível salvar no LocalStorage', err)
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
}

export function removeStorage(key: string) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignora */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
}

/** Estado persistido no LocalStorage e sincronizado entre componentes e abas. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initial))

  useEffect(() => {
    const onChange = (e: Event) => {
      const k = e instanceof StorageEvent ? e.key?.replace(PREFIX, '') : (e as CustomEvent<string>).detail
      if (k === key) setValue(readStorage(key, initial))
    }
    window.addEventListener(EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(readStorage(key, initial)) : next
      setValue(resolved)
      writeStorage(key, resolved)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  )

  return [value, set] as const
}
