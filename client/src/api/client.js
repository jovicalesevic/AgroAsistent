/** Bazni URL API-ja (prazan u dev-u kad Vite proxy prosleđuje /api). */
export const API_BASE = import.meta.env.VITE_API_URL || ''

/**
 * Puna URL putanja ka API-ju (npr. apiUrl('/api/parcels/123')).
 */
export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${p}`
}

/**
 * Zaglavlja za zaštićene Clerk rute.
 */
export async function getAuthHeaders(getToken) {
  const token = await getToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}
