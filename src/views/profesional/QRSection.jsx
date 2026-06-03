import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { httpClient } from "../../api/httpClient.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { handleApiError } from "../../api/handleError.js";

const URL_FRONT = import.meta.env.VITE_URL_FRONT;
const PUERTO_FRONT = import.meta.env.VITE_PUERTO_FRONT;

export default function QRSection() {
  const [loading, setLoading] = useState(false);
  const [tokenQr, setTokenQr] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const qrUrl = `${URL_FRONT}:${PUERTO_FRONT}/paciente/vincular/${tokenQr}`;

  const generarQR = async () => {
    setLoading(true);

    try {
      const data = await httpClient.post("/api/Vinculation/generar-qr");

      setTokenQr(data.token);
    } catch (err) {
      console.error(err);

      const handled = handleApiError(err, logout, navigate);

      if (handled) return;

      alert("No se pudo generar el QR.");
    } finally {
      setLoading(false);
    }
  };

  const finalizarQR = () => {
    setTokenQr("");
  };

  {
    /* FUNCION PARA MANEJAR EL CALLBACK DEL SHARE POR EMAIL */
  }
  const handleShare = () => {};

  return (
    <section className="space-y-5 animate-fade-in">
      <header className="mb-6">
        <span className="text-emerald-700 font-semibold text-sm">
          Profesional
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Vincular Paciente
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Generá un código QR para que tu paciente pueda vincularse a tu cuenta.
        </p>
      </header>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex min-h-[280px] items-center justify-center rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
          {tokenQr ? (
            <QRCodeSVG
              value={qrUrl}
              size={220}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="H"
              includeMargin
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100">
                <span className="text-3xl">QR</span>
              </div>

              <p className="text-sm font-medium text-slate-600">
                Todavía no generaste un QR
              </p>
            </div>
          )}
        </div>

        {tokenQr && (
          <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Código activo
            </p>
          </div>
        )}

        {!tokenQr ? (
          <button
            onClick={generarQR}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-sm active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Generando..." : "Generar QR"}
          </button>
        ) : (
          <div className="flex gap-5">
            <button
              onClick={finalizarQR}
              className="mt-6 w-full rounded-2xl bg-red-50 py-4 text-sm font-bold text-red-600 active:scale-[0.98]"
            >
              Finalizar vinculación
            </button>
            <button
              onClick={handleShare}
              className="mt-6 w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-sm active:scale-[0.98] disabled:opacity-60"
            >
              Enviar por email
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
