import React, { useState } from "react";
import logo_grande from "/logo_grande.png";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

function QRSection() {
  const navigate = useNavigate();
  const [qrVisible, setQrVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Guardamos el token que viene del backend en un estado para usarlo en el path
  const [tokenQr, setTokenQr] = useState("");

  // Construimos el path dinámico usando el token del estado
  const pathDestino = `http://localhost:5173/register-paciente/${tokenQr}`;

  const manejarGenerarQR = async () => {
    const token = localStorage.getItem("token");
    const url = "http://192.168.1.101:5000/api/Vinculation/generar-qr";

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const token_qr_profesional = data.token;

        localStorage.setItem("token_qr_profesional", token_qr_profesional);

        // 1. Guardamos el token en el estado para actualizar el QR
        setTokenQr(token_qr_profesional);
        // 2. Mostramos la sección del QR
        setQrVisible(true);
      } else {
        console.error("Error al generar el QR");
        alert("Sesión expirada o error de servidor");
      }
    } catch (err) {
      console.error("Error de red:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 py-12 bg-gradient-to-tr from-[#e8f5e9] via-[#f1f8f6] to-[#c8e6c9] animate-fade-in font-poppins">
      <div className="text-center space-y-2 z-10">
        <h1 className="font-bold text-5xl text-green-900 select-none tracking-tight drop-shadow-sm">
          Vinculación de Pacientes
        </h1>
        <p className="text-green-800/70 text-lg font-medium">
          Generá un código único para cada paciente nuevo
        </p>
      </div>

      <div className="relative z-10">
        <div className="absolute -inset-4 bg-white/30 rounded-[3rem] blur-2xl"></div>

        <div className="relative bg-white/90 backdrop-blur-lg p-10 rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col items-center min-w-[340px] min-h-[380px] justify-center transition-all duration-500">
          {!qrVisible ? (
            <button
              onClick={manejarGenerarQR}
              disabled={loading}
              className={`group flex flex-col items-center gap-5 hover:scale-105 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-900/20 group-hover:bg-green-700 transition-all duration-500">
                {loading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                  /* Icono temporal interno de QR mientras no está activo */
                  <QRCodeSVG
                    value="placeholder"
                    size={32}
                    fgColor="#ffffff"
                    bgColor="transparent"
                  />
                )}
              </div>
              <span className="text-sm font-bold text-green-900 uppercase tracking-[0.2em]">
                {loading ? "Generando..." : "Generar QR"}
              </span>
            </button>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
              {/* Contenedor donde se dibuja el QR real con los datos del Back */}
              <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100">
                <QRCodeSVG
                  value={pathDestino}
                  size={220} // Un tamaño ideal para que se pueda escanear bien
                  bgColor={"#ffffff"}
                  fgColor={"#14532d"} // Color green-900 de Tailwind para que combine con tu UI
                  level={"H"}
                  includeMargin={false}
                />
              </div>
              <div className="mt-8 flex items-center gap-3 px-5 py-2 bg-green-900/5 rounded-full border border-green-900/10">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-xs font-bold text-green-900/60 uppercase tracking-wider">
                  Código de sesión activo
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 z-10 w-full max-w-md">
        {qrVisible && (
          <button
            onClick={() => {
              setQrVisible(false);
              setTokenQr(""); // Limpiamos el token al cerrar sesión
            }}
            className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white py-3 px-8 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            Finalizar sesión
          </button>
        )}
      </div>

      <div className="mt-6 opacity-30">
        <img
          src={logo_grande}
          alt="KineUp"
          className="h-12 w-auto mix-blend-multiply"
        />
      </div>
    </div>
  );
}

export default QRSection;
