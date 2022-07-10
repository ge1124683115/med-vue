const _key = '0132456789abcdef'
const _iv = 'fedcba9876543210'

const TokenKey = 'Access-Token'
const UserKey = 'Access-User'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

function setUser(user) {
  return localStorage.setItem(UserKey, user)
}

function getUser() {
  return localStorage.getItem(UserKey)
}

function removeUser() {
  localStorage.removeItem(UserKey)
}

function clearAuth() {
  removeUser()
  removeToken();
}

export {
  _key,
  _iv,
  setUser,
  getUser,
  clearAuth,
}
