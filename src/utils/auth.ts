export type Role = 'admin' | 'user';

export interface AuthInfo {
  email: string;
  name: string;
  userId: string;
  role: Role;
  credit: number
}

const AUTH_KEY = 'authInfo';

/**
 * localStorage theke user info niye ashe.
 * - Na thakle ba data vul hole  -> null
 * - Thakle                      -> AuthInfo object (credit: 1 shoho)
 */
export const getAuthInfo = (): AuthInfo | null => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    // Data thik ache kina check (vul ba nosto data hole null)
    if (
      data &&
      typeof data.email === 'string' &&
      typeof data.name === 'string' &&
      typeof data.userId === 'string' &&
      (data.role === 'admin' || data.role === 'user')
    ) {
      return { ...data, credit: 1 } as AuthInfo;
    }

    return null;
  } catch {
    // JSON parse error ba localStorage access error
    return null;
  }
};