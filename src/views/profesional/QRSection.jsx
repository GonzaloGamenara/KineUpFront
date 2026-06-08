import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { httpClient } from "../../api/httpClient.js";
import { useAuth } from "../../auth/AuthContext";
import { handleApiError } from "../../api/handleError.js";

const URL_FRONT = import.meta.env.VITE_URL_FRONT;
const PUERTO_FRONT = import.meta.env.VITE_PUERTO_FRONT;

export default function QRSection() {
  const [loading, setLoading] = useState(true);
  const [tokenQr, setTokenQr] = useState("");
  const [error, setError] = useState("");
  const { logout, activeOrganization } = useAuth();
  const navigate = useNavigate();

  const qrUrl = `${URL_FRONT}:${PUERTO_FRONT}/paciente/vincular/${tokenQr}`;

  useEffect(() => {
    const cargarQR = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await httpClient.post("/api/Vinculation/generar-qr");
        setTokenQr(data?.token ?? data?.Token ?? "");
      } catch (err) {
        console.error(err);

        const handled = handleApiError(err, logout, navigate);

        if (handled) return;

        setError("No se pudo cargar el QR.");
      } finally {
        setLoading(false);
      }
    };

    cargarQR();
  }, [logout, navigate]);

  return (
    <section className="space-y-5 animate-fade-in">
      <header className="mb-6 space-y-4">
        <button
          type="button"
          onClick={() => navigate("/profesional/pacientes")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <div>
          <span className="text-emerald-700 font-semibold text-sm">
            Profesional
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Vincular Paciente
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            El paciente puede escanear este codigo para vincularse a tu cuenta.
          </p>
          {activeOrganization && (
            <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {activeOrganization.nombre}
            </p>
          )}
        </div>
      </header>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex min-h-[280px] items-center justify-center rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
          {loading ? (
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
              <p className="text-sm font-medium text-slate-600">
                Cargando QR...
              </p>
            </div>
          ) : tokenQr ? (
            <QRCodeSVG
              value={qrUrl}
              size={220}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="H"
              includeMargin
            />
          ) : error ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-red-600">{error}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Volve a ingresar a esta pantalla para intentarlo nuevamente.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100">
                <span className="text-3xl">QR</span>
              </div>

              <p className="text-sm font-medium text-slate-600">
                No hay un QR disponible.
              </p>
            </div>
          )}
        </div>

        {!loading && tokenQr && (
          <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Codigo activo por 24 horas
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
