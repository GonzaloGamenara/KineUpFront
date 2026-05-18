import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { httpClient } from "../../api/httpClient.js";

const URL_BACK = import.meta.env.VITE_URL_BACK;
const PUERTO_BACK = import.meta.env.VITE_PUERTO_BACK;

export default function QRSection() {
  const [loading, setLoading] = useState(false);
  const [tokenQr, setTokenQr] = useState("");

  const qrUrl = `${URL_BACK}:${PUERTO_BACK}/api/Vinculation/confirmacion/${tokenQr}`;

  const generarQR = async () => {
    setLoading(true);

    try {
      const data = await httpClient.post("/api/Vinculation/generar-qr");

      setTokenQr(data.token);
    } catch (error) {
      console.error(error);
      alert("No se pudo generar el QR.");
    } finally {
      setLoading(false);
    }
  };

  const finalizarQR = () => {
    setTokenQr("");
  };

  return (
    <section className="block space-y-6 md:block md:mx-auto md:max-w-3xl">
      <header>
        <p className="text-sm font-medium text-emerald-700">
          Profesional
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Vincular paciente
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Generá un código QR para que el paciente pueda escanearlo y vincularse con vos.
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
          <button
            onClick={finalizarQR}
            className="mt-6 w-full rounded-2xl bg-red-50 py-4 text-sm font-bold text-red-600 active:scale-[0.98]"
          >
            Finalizar vinculación
          </button>
        )}
      </div>
    </section>
  );
}