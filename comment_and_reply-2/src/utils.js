import jwtDecode from 'jwt-decode';

export const isValidToken = () => {
  try {
    const now = Date.now().valueOf() / 1000;
    const token = localStorage.getItem('token');
    if (!token) throw new Error('token not found');
    const decoded = jwtDecode(token);
    if (!decoded.exp) throw new Error('exp not found');
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      throw new Error(`token expired: ${JSON.stringify(decoded)}`);
    }
    return true;
  } catch (err) {
    return false;
  }
};

export const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };
};
