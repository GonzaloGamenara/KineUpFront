import { useState } from "react";
import "./App.css";
import Navbar from "/src/components/Navbar.jsx";
import QRSection from "/src/components/QRSection.jsx";
import Pacientes from "/src/components/Pacientes.jsx"; // ¡No olvides esta importación!

function App() {
  // Estado para controlar qué sección se ve
  const [solapaActiva, setSolapaActiva] = useState("qr");

  return (
    <div className="h-screen font-poppins flex flex-col overflow-hidden bg-slate-50">
      {/* Pasamos el estado y la función al Navbar */}
      <Navbar setSolapaActiva={setSolapaActiva} solapaActiva={solapaActiva} />

      <main className="grow overflow-y-auto min-h-0 bg-white">
        {/* Renderizado condicional */}
        {solapaActiva === "qr" && (
          <div className="animate-fade-in h-full">
            <QRSection />
          </div>
        )}

        {solapaActiva === "pacientes" && (
          <div className="animate-fade-in">
            <Pacientes />
          </div>
        )}

        {/* Puedes agregar más aquí fácilmente */}
        {solapaActiva === "rutinas" && (
          <div className="flex items-center justify-center h-full text-2xl text-gray-400">
            Sección de Rutinas en construcción...
          </div>
        )}

        {solapaActiva === "faq" && (
          <div className="flex items-center justify-center h-full text-2xl text-gray-400">
            Sección de FAQ en construcción...
          </div>
        )}

        {solapaActiva === "profile" && (
          <div className="flex items-center justify-center h-full text-2xl text-gray-400">
            Sección de Perfil en construcción...
          </div>
        )}
      </main>

      <footer className="min-h-15 shrink-0 bg-primary text-white text-center flex items-center justify-center rounded-t-xl animate-slide-up shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <p>© 2026 KineUp. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
