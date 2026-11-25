import { useState } from 'react';
import axios from 'axios';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getErrorCode, getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import type { LoginInput } from '../types';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginInput>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    if (!form.email.trim() || !form.password) {
      setError('Ingresa el correo y la contraseña.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ ...form, email: form.email.trim() });
      if (!result?.token) {
        throw new Error('La respuesta del login no contiene el campo token.');
      }
      login(result.token);
      navigate('/locations', { replace: true });
    } catch (err) {
      
      if (axios.isAxiosError(err)) {
        console.error('Login:', {
          url: err.config?.url,
          status: err.response?.status,
          code: getErrorCode(err),
          message: err.response?.data?.message,
          networkError: err.message,
        });
        const message = getErrorCode(err) === 'UNAUTHORIZED'
          ? 'Correo o contraseña incorrectos.'
          : getErrorMessage(err, 'Error al iniciar sesión.');
        setError(err.response?.status ? `${message} (HTTP ${err.response.status})` : message);
      } else {
        console.error('Error inesperado en login:', err);
        setError(err instanceof Error ? err.message : 'Error inesperado al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto mt-12 max-w-md px-4">
      <form onSubmit={handleSubmit} noValidate className="card">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <div className="mt-5">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="mt-4">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        {error && <p role="alert" className="error mt-3">{error}</p>}
        <button type="submit" className="button-primary mt-5 w-full" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        <p className="mt-4 text-center text-sm">¿No tienes cuenta? <Link to="/register" className="text-teal-700 underline">Regístrate</Link></p>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">Prueba: ana@example.test / Practica123</p>
    </main>
  );
}
