import { Link, useParams } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { useLocation } from '../hooks/useLocation';
import type { ReportCategory } from '../types';

const categoryNames: Record<ReportCategory, string> = {
  LIGHTING: 'Iluminación',
  FURNITURE: 'Mobiliario',
  CLEANING: 'Limpieza',
};

export function LocationDetailPage() {
  const { id } = useParams();
  const { location, loading, error, reload } = useLocation(Number(id));

  return (
    <main className="page">
      <Link to="/locations" className="text-sm text-teal-700 underline">← Volver a espacios</Link>
      {loading && <p className="mt-5" role="status">Cargando espacio...</p>}
      {error && <p role="alert" className="error mt-5">{error}</p>}

      {!loading && location && (
        <>
          <section className="card mt-5">
            <p className="text-sm font-semibold text-teal-700">{location.building} · Piso {location.floor}</p>
            <h1 className="mt-1 text-2xl font-bold">{location.name}</h1>
            <p className="mt-3">Reportes abiertos: <strong>{location.openReports}</strong></p>
            <p className={`mt-1 text-sm ${location.acceptsReports ? 'text-green-700' : 'text-red-700'}`}>
              {location.acceptsReports ? 'Acepta nuevos reportes' : 'Espacio cerrado'}
            </p>

            <h2 className="mt-6 text-lg font-semibold">Historial de reportes</h2>
            {location.reports.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Este espacio todavía no tiene reportes.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {location.reports.map(report => (
                  <li key={report.id} className="rounded-lg border border-slate-200 p-3">
                    <p className="font-semibold text-sm">#{report.id} · {categoryNames[report.category]}</p>
                    <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{report.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <ReportForm location={location} onUpdate={reload} />
        </>
      )}
    </main>
  );
}
