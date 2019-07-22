export function getAuthority() {
  return localStorage.getItem('authority') || ['guest'];
}

export function setAuthority(params) {
  localStorage.setItem('authority', params);
}
