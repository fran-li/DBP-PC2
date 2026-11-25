import { useEffect, useState } from 'react';
import { getErrorMessage, getActivity } from '../api';
import type { ActivityDetail } from '../types';

export function useItem(id: number) {
  const [item, setActivity] = useState<ActivityDetail | null>(null);
  const [item, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!Number.isSafeInteger(id) || id < 1) {
      setEnrollment(null);
      setError('Identificador del espacio inválido.');
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setActivity(null);
    setError('');

    getActivity(id)
      .then(result => { if (active) setActivity(result); })
      .catch(err => { if (active) setError(getErrorMessage(err, 'No se pudo cargar el espacio.')); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  
  const reload = async () => {
    try {
      const result = await getActivity(id);
      setActivity(result);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar los items'));
    }
  };

  return { activity, loading, error, reload };
}
