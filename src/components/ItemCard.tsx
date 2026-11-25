import { Link } from 'react-router-dom';
import type { Item } from '../types';

interface Props {
  item: Item;
}

export function ItemCard({ item }: Props) {
  return (
    <article className="card">
      <h2 className="text-xl font-semibold">{location.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{location.building} · Piso {location.floor}</p>
      <p className="mt-2 text-sm">Reportes abiertos: <strong>{location.openReports}</strong></p>
      <p className={`mt-1 text-sm ${location.acceptsReports ? 'text-green-700' : 'text-red-700'}`}>
        {location.acceptsReports ? 'Acepta reportes' : 'Espacio cerrado'}
      </p>
      <Link to={`/locations/${location.id}`} className="mt-4 inline-block rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">
        Ver detalle
      </Link>
    </article>
  );
}
