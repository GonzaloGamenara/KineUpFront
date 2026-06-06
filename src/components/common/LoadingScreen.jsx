export default function LoadingScreen({
  message = "Cargando...",
  minHeight = "min-h-[50vh]",
}) {
  return (
    <section
      className={`flex ${minHeight} flex-col items-center justify-center gap-4 text-center animate-fade-in`}
      role="status"
      aria-live="polite"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"
          aria-hidden="true"
        />
      </div>

      <div>
        <p className="text-sm font-bold text-slate-700">{message}</p>
      </div>
    </section>
  );
}
