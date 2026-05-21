import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { httpClient } from "../../api/httpClient";
import { useAuth } from "../../auth/AuthContext";

export default function Vincular() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loadingAuth } = useAuth();
  const [estado, setEstado] = useState("loading");

  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`, { replace: true });
    }

    const confirmar = async () => {
      try {
        await httpClient.post(`/api/Vinculation/confirmacion/${token}`);
        setEstado("success");

        setTimeout(() => {
          navigate("/paciente/home", { replace: true });
        }, 1800);
      } catch {
        setEstado("error");
      }
    };

    confirmar();
  }, [token, navigate, user, loadingAuth]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
        {estado === "loading" && (
          <>
            <Loader2 className="mx-auto mb-5 animate-spin text-emerald-600" size={48} />
            <h1 className="text-xl font-bold text-slate-900">Confirmando vinculación</h1>
            <p className="mt-2 text-sm text-slate-500">Estamos vinculando tu cuenta con el profesional.</p>
          </>
        )}

        {estado === "success" && (
          <>
            <CheckCircle className="mx-auto mb-5 text-emerald-600" size={52} />
            <h1 className="text-xl font-bold text-slate-900">Vinculación correcta</h1>
            <p className="mt-2 text-sm text-slate-500">Te estamos redirigiendo al inicio.</p>
          </>
        )}

        {estado === "error" && (
          <>
            <XCircle className="mx-auto mb-5 text-red-500" size={52} />
            <h1 className="text-xl font-bold text-slate-900">No se pudo vincular</h1>
            <p className="mt-2 text-sm text-slate-500">El QR puede estar vencido o ya utilizado.</p>
          </>
        )}
      </div>
    </section>
  );
}