import { useState } from 'react';
import type { FormEvent } from 'react';
import { createReport, getErrorCode, getErrorMessage } from '../api';
import type { LocationDetail, ReportCategory } from '../types';

interface Props {
  location: LocationDetail;
  onUpdate: () => Promise<void>;
}

interface FormErrors {
  category?: string;
  description?: string;
}

export function ReportForm({ location, onUpdate }: Props) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSuccess('');

    const validation: FormErrors = {};
    if (!['LIGHTING', 'FURNITURE', 'CLEANING'].includes(category)) {
      validation.category = 'Selecciona una categoría.';
    }
    const trimmedDescription = description.trim();
    if (trimmedDescription.length < 10 || trimmedDescription.length > 200) {
      validation.description = 'La descripción debe tener entre 10 y 200 caracteres sin espacios externos.';
    }
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      await createReport(location.id, {
        category: category as ReportCategory,
        description: trimmedDescription,
      });
      setCategory('');
      setDescription('');
      setErrors({});
      setSuccess('Reporte enviado correctamente.');
      await onUpdate();
    } catch (err) {
      setError(getErrorCode(err) === 'LOCATION_CLOSED'
        ? 'El espacio está cerrado y no admite reportes.'
        : getErrorMessage(err, 'No se pudo enviar el reporte.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="card mt-6">
      <h2 className="text-lg font-semibold">Reportar un problema</h2>
      <p className="mt-1 text-sm text-slate-500">Describe lo que ocurre en este espacio.</p>
      {!location.acceptsReports && (
        <p className="mt-3 text-sm font-medium text-amber-700">
          Este espacio figura como cerrado. El servidor rechazará nuevos reportes.
        </p>
      )}

      <div className="mt-5">
        <label htmlFor="category">Categoría</label>
        <select id="category" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Selecciona una categoría</option>
          <option value="LIGHTING">Iluminación</option>
          <option value="FURNITURE">Mobiliario</option>
          <option value="CLEANING">Limpieza</option>
        </select>
        {errors.category && <p className="error">{errors.category}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="description">Descripción del problema</label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4}
          placeholder="Describe el problema (10 a 200 caracteres)" />
        <p className="mt-1 text-xs text-slate-500">{description.trim().length}/200 caracteres (sin espacios externos)</p>
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      {error && <p role="alert" className="error mt-4">{error}</p>}
      {success && <p role="status" className="mt-4 text-sm font-medium text-green-700">{success}</p>}
      <button type="submit" className="button-primary mt-5" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar reporte'}
      </button>
    </form>
  );
}
