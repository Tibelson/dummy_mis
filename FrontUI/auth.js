/* Shared Auth helpers */

export const auth = {
  get token() { return localStorage.getItem('token'); },
  set token(value) { value ? localStorage.setItem('token', value) : localStorage.removeItem('token'); },

  get user() { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; },
  set user(value) { value ? localStorage.setItem('user', JSON.stringify(value)) : localStorage.removeItem('user'); },

  get role() { return localStorage.getItem('userRole'); },
  set role(value) { value ? localStorage.setItem('userRole', value) : localStorage.removeItem('userRole'); },

  logout() { this.token = null; this.user = null; this.role = null; },
};

export function requireRole(role, redirect = 'index.html') {
  const current = localStorage.getItem('userRole');
  if (!current || (role && current !== role)) {
    window.location.href = redirect;
  }
} 