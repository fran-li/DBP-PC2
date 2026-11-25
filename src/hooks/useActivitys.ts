import { useEffect, useState } from 'react';
import { getErrorMessage, getLocations } from '../api';
import type { EnrollmentResponse } from '../types';


export function useLocations(page: number) {
  const [data, setData] = useState<EnrollmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(null);
    setError('');

    getLocations(page)
      .then(result => { if (active) setData(result); })
      .catch(err => { if (active) setError(getErrorMessage(err, 'No se pudieron cargar las inscripciones.')); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [page]);

  return { data, loading, error };
}
