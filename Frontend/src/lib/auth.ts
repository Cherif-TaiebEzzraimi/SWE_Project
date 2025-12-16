export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
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

// Save if client is a company (true) or individual (false)
export const saveIsCompany = (isCompany: boolean): void => {
  localStorage.setItem('isCompany', isCompany.toString());
};

export const getIsCompany = (): boolean => {
  return localStorage.getItem('isCompany') === 'true';
};

export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('isCompany');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};