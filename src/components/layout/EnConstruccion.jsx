import { Hammer } from "lucide-react";

export default function EnConstruccion() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
          <Hammer size={30} />
        </div>

        <h1 className="text-xl font-bold text-slate-900">Pantalla en construcción</h1>

        <p className="mt-2 text-sm text-slate-500">
          Esta sección todavía no está disponible :D
        </p>
      </div>
    </section>
  );
}