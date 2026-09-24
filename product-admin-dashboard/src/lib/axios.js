import axios from 'axios';
import { clearSession, getToken } from '@/lib/auth';

// Single Axios setup used by every service. Nothing else in the app imports axios
// to make requests, so auth headers and error handling live in exactly one place.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 1) Attach the login token to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2) Handle errors in one place: turn any failure into an Error with a readable
//    message and a `status`, and send the user to /login when the token is rejected.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cancelled requests (AbortController) are expected, not failures. Pass through untouched.
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status ?? null;

    if (status === 401 && !error.config?.skipAuthRedirect && typeof window !== 'undefined') {
      clearSession();
      window.location.assign('/login');
    }
    return Promise.reject(toApiError(error, status));
  }
);

function toApiError(error, status) {
  let message;
  if (error.response) {
    message =
      error.response.data?.message || (status === 404 ? 'Not found.' : `Request failed (${status}).`);
  } else if (error.code === 'ECONNABORTED') {
    message = 'The request timed out. Please try again.';
  } else {
    message = 'Network error. Check your connection and try again.';
  }
  const apiError = new Error(message);
  apiError.status = status;
  return apiError;
}

export const isCancel = axios.isCancel;
