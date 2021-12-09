export function setItem(key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export function getItem(key) {
  const value = window.sessionStorage.getItem(key)
  if (value) return JSON.parse(value)
}

export function removeItem(key) {
  window.sessionStorage.removeItem(key)
}

export function clearStorage() {
  window.sessionStorage.clear()
}
