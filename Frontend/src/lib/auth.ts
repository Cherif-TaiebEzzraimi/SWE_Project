const AUTH_FLAG_KEY = 'authFlag';

export const saveAuthFlag = (isAuthenticated: boolean): void => {
  localStorage.setItem(AUTH_FLAG_KEY, isAuthenticated ? 'true' : 'false');
};

export const getAuthFlag = (): boolean => {
  return localStorage.getItem(AUTH_FLAG_KEY) === 'true';
};

export const clearAuthFlag = (): void => {
  localStorage.removeItem(AUTH_FLAG_KEY);
};

export const saveRole = (role: string): void => {
  localStorage.setItem('role', role);
};

export const getRole = (): string | null => {
  return localStorage.getItem('role');
};

export const saveUserId = (userId: number): void => {
  localStorage.setItem('userId', userId.toString());
};

export const getUserId = (): number | null => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId, 10) : null;
};

export const saveIsCompany = (isCompany: boolean): void => {
  localStorage.setItem('isCompany', isCompany.toString());
};

export const getIsCompany = (): boolean => {
  return localStorage.getItem('isCompany') === 'true';
};

export const clearAuth = (): void => {
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('isCompany');
  clearAuthFlag();
};

export const isAuthenticated = (): boolean => {
  // Backend auth = session cookie
  // Frontend auth = UI state
  return !!(getAuthFlag() && getRole() && getUserId());
};
