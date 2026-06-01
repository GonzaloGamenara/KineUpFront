import { ShieldAlert } from "lucide-react";

export default function AccesoDenegado() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
          <ShieldAlert size={40} strokeWidth={2.2} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Acceso denegado
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          No tenés permisos para acceder a esta sección.
        </p>

      </div>
    </section>
  );
}