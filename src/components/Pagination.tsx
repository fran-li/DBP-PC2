interface Props {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({ page, totalPages, disabled, onPrevious, onNext }: Props) {
  const empty = totalPages === 0;

  return (
    <nav aria-label="Paginacion" className="mt-6 flex items-center justify-center gap-4">
      <button className="button-secondary" onClick={onPrevious} disabled={disabled || empty || page <= 1}>
        Anterior
      </button>
      <span className="text-sm text-slate-700">Página {empty ? 0 : page} de {totalPages}</span>
      <button className="button-secondary" onClick={onNext} disabled={disabled || empty || page >= totalPages}>
        Siguiente
      </button>
    </nav>
  );
}
