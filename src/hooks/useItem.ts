import { useEffect, useState } from 'react';
import { getErrorMessage, getLocation } from '../api';
import type { LocationDetail } from '../types';

export function useLocation(id: number) {
  const [location, setLocation] = useState<LocationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!Number.isSafeInteger(id) || id < 1) {
      setLocation(null);
      setError('Identificador del espacio inválido.');
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setLocation(null);
    setError('');

    getLocation(id)
      .then(result => { if (active) setLocation(result); })
      .catch(err => { if (active) setError(getErrorMessage(err, 'No se pudo cargar el espacio.')); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  
  const reload = async () => {
    try {
      const result = await getLocation(id);
      setLocation(result);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar el espacio.'));
    }
  };

  return { location, loading, error, reload };
}
