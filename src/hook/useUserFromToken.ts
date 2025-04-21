import { useEffect, useState } from 'react';

interface DecodedToken {
  userId?: string;
  name?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown; // allow additional properties
}

export const useUserFromToken = (token: string | null) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodeToken = (token: string): DecodedToken | null => {
      try {
        const [, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        return decoded;
      } catch (err) {
        console.error('Invalid token:', err);
        return null;
      }
    };

    if (token) {
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [token]);

  return { user, loading };
};
