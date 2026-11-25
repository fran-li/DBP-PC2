import axios from 'axios';
import type {
  ApiErrorBody, CreateReportInput, LocationDetail, LocationsResponse,
  LoginInput, LoginResponse, MaintenanceReport, RegisterInput,
} from './types';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});


api.interceptors.request.use(config => {
  const url = config.url || '';
  if (url.startsWith('/auth/')) {
    config.headers.delete('Authorization');
    return config;
  }
  const token = localStorage.getItem('token');
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});


api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url || '';
      if (!url.startsWith('/auth/')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('session-expired'));
      }
    }
    return Promise.reject(error);
  },
);

export const registerUser = (data: RegisterInput) =>
  api.post('/auth/register', data).then(response => response.data);

export const loginUser = (data: LoginInput) =>
  api.post<LoginResponse>('/auth/login', data).then(response => response.data);

export const getLocations = (page: number) =>
  api.get<LocationsResponse>('/locations', { params: { page, size: 5 } })
    .then(response => response.data);

export const getLocation = (id: number) =>
  api.get<LocationDetail>(`/locations/${id}`).then(response => response.data);

export const createReport = (id: number, data: CreateReportInput) =>
  api.post<MaintenanceReport>(`/locations/${id}/reports`, data)
    .then(response => response.data);

export function getErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError<ApiErrorBody>(error)) return error.response?.data?.code;
  return undefined;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) return 'No se pudo conectar con el backend en localhost:3003.';
    return error.response.data?.message || fallback;
  }
  return fallback;
}
