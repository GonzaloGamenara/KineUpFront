import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function NotFound() {
    const { user } = useAuth();

    const homeUrl =
        user?.roles?.includes("Profesional") //caso a mirar si tengo ambos roles.
            ? "/profesional/home"
            : "/paciente/home";

    return (
        <section className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">

                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                    <SearchX size={40} strokeWidth={2.2} />
                </div>

                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Error 404
                </p>

                <h1 className="mt-2 text-2xl font-bold text-slate-900">
                    Esta pantalla no existe
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    La ruta que intentaste abrir no fue encontrada.
                </p>

                <Link
                    to={homeUrl}
                    className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
                >
                    Volver al inicio
                </Link>

            </div>
        </section>
    );
}