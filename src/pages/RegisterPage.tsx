import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorCode, getErrorMessage, registerUser } from '../api';
import type { RegisterInput } from '../types';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterInput>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const validation: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length > 100) {
      validation.name = 'El nombre es obligatorio y admite máximo 100 caracteres.';
    }
    if (form.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      validation.email = 'Ingresa un correo válido de máximo 254 caracteres.';
    }
    if (!/^[\x20-\x7E]{8,72}$/.test(form.password)) {
      validation.password = 'Usa 8 a 72 caracteres ASCII imprimibles.';
    }
    setErrors(validation);
    setError('');
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      await registerUser({ ...form, name: form.name.trim(), email: form.email.trim() });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(getErrorCode(err) === 'EMAIL_EXISTS'
        ? 'El correo ya está registrado.'
        : getErrorMessage(err, 'No se pudo registrar el usuario.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto mt-12 max-w-md px-4">
      <form onSubmit={handleSubmit} noValidate className="card">
        <h1 className="text-2xl font-bold">Registro</h1>
        <div className="mt-5">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        {error && <p role="alert" className="error mt-3">{error}</p>}
        <button className="button-primary mt-5 w-full" type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        <p className="mt-4 text-center text-sm">¿Ya tienes cuenta? <Link to="/login" className="text-teal-700 underline">Inicia sesión</Link></p>
      </form>
    </main>
  );
}
