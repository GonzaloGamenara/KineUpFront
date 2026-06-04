import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { httpClient } from "../../api/httpClient.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { handleApiError } from "../../api/handleError.js";

const URL_FRONT = import.meta.env.VITE_URL_FRONT;
const PUERTO_FRONT = import.meta.env.VITE_PUERTO_FRONT;

export default function QRSection() {
  const [loading, setLoading] = useState(true);
  const [tokenQr, setTokenQr] = useState("");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const qrUrl = `${URL_FRONT}:${PUERTO_FRONT}/paciente/vincular/${tokenQr}`;

  const generarQR = async () => {
    try {
      setLoading(true);

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

  useEffect(() => {
    generarQR();
  }, []);

  const finalizarQR = () => {
    setTokenQr("");
    setMostrarConfirmacion(false);
    navigate("/profesional/pacientes");
  };

  const handleShare = () => {
    // pendiente
  };

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
          Compartí este código QR con tu paciente para que pueda vincularse a tu cuenta.
        </p>
      </header>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex min-h-[280px] items-center justify-center rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
          {loading ? (
            <div className="text-center">
              <div className="mx-auto mb-4 h-20 w-20 rounded-3xl bg-emerald-100 animate-pulse" />

              <p className="text-sm font-medium text-slate-600">
                Generando código QR...
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
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">
                No se pudo generar el código QR.
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

        {tokenQr && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setMostrarConfirmacion(true)}
              className="w-full rounded-2xl bg-red-50 py-4 text-sm font-bold text-red-600 hover:bg-red-100 transition-all"
            >
              Finalizar vinculación
            </button>

            <button
              onClick={handleShare}
              className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              Enviar por email
            </button>
          </div>
        )}
      </div>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">
              Finalizar vinculación
            </h2>

            <p className="mt-3 text-slate-600">
              ¿Estás seguro de que querés finalizar este código QR?
            </p>

            <p className="mt-2 text-sm text-slate-500">
              El paciente ya no podrá utilizar este código para vincularse.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700"
              >
                Cancelar
              </button>

              <button
                onClick={finalizarQR}
                className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}