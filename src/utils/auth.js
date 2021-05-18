import Cookies from 'js-cookie'

const TokenKey = 'myToken'

export function getToken(key = TokenKey) {
  return Cookies.get(key)
}

export function setToken(token, key = TokenKey) {
  return Cookies.set(key, token)
}

export function removeToken(key = TokenKey) {
  return Cookies.remove(key)
}

export function setStorage(key, value) {
  sessionStorage.setItem(key, value)
}
export function getStorage(key) {
  return sessionStorage.getItem(key)
}
