import react from "react";
import { useState } from "react";

function QRbutton() {
  const [loading, setLoading] = useState(false);

  const handleSendCallBack = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/callback", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Pidiendo generacion de QR",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert("Callback enviado");
      } else {
        console.error("Error al enviar callback", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar callback", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`bg-primary text-white py-4 px-8 rounded-lg hover:bg-primary-dark cursor-pointer font-bold text-2xl justify-center items-center hover:scale-110 transition-transform active:scale-106 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={handleSendCallBack}
      disabled={loading}
    >
      {loading ? "Generando..." : "Generar QR"}
    </button>
  );
}

export default QRbutton;
