import { useState } from 'react';
import { LocationCard } from '../components/LocationCard';
import { Pagination } from '../components/Pagination';
import { useLocations } from '../hooks/useLocations';

export function LocationsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useLocations(page);

  return (
    <main className="page">
      <h1 className="mb-2 text-2xl font-bold">Espacios del campus</h1>
      <p className="mb-6 text-slate-600">Selecciona un aula para consultar y registrar incidencias.</p>

      {loading && <p role="status">Cargando espacios...</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {!loading && !error && data?.items.length === 0 && <p>No hay espacios para mostrar.</p>}

      {!loading && !error && data && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.items.map(location => <LocationCard key={location.id} location={location} />)}
        </div>
      )}

      <Pagination
        page={data && !loading ? data.page : page}
        totalPages={!loading && !error ? (data?.totalPages ?? 0) : 0}
        disabled={loading || Boolean(error)}
        onPrevious={() => setPage(previous => Math.max(1, previous - 1))}
        onNext={() => setPage(previous => previous + 1)}
      />
    </main>
  );
}
