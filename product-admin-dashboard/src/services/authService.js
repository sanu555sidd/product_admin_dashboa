import { api } from '@/lib/axios';

export async function login({ username, password }) {
  const { data } = await api.post(
    '/auth/login',
    { username, password, expiresInMins: 60 * 24 },
    { skipAuthRedirect: true } // a wrong password is a form error, not an expired session
  );
  return {
    token: data.accessToken ?? data.token,
    user: { id: data.id, username: data.username, firstName: data.firstName, image: data.image },
  };
}
