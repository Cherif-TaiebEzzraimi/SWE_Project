const AUTH_FLAG_KEY = 'authFlag';
const USER_PROFILE_KEY = 'userProfile';

export type StoredUserProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
};

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

export const saveUserProfile = (user: unknown): void => {
  try {
    if (!user || typeof user !== 'object') return;
    const candidate = user as Partial<StoredUserProfile>;
    if (
      typeof candidate.id !== 'number' ||
      typeof candidate.email !== 'string' ||
      typeof candidate.first_name !== 'string' ||
      typeof candidate.last_name !== 'string'
    ) {
      return;
    }
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(candidate));
  } catch {
    
  }
};

export const getUserProfile = (): StoredUserProfile | null => {
  const raw = localStorage.getItem(USER_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUserProfile;
  } catch {
    return null;
  }
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
  localStorage.removeItem(USER_PROFILE_KEY);
  clearAuthFlag();
};

export const isAuthenticated = (): boolean => {
  // Backend auth = session cookie
  // Frontend auth = UI state
  return !!(getAuthFlag() && getRole() && getUserId());
};
