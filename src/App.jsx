import { useState } from "react";
import Navbar from "./components/layout/Navbar.jsx";
import QRSection from "./features/professional/QRSection.jsx";
import Pacientes from "./features/professional/Pacientes.jsx";

function App() {
  const [solapaActiva, setSolapaActiva] = useState("qr");

  return (
    <div className="h-screen font-poppins flex flex-col overflow-hidden bg-slate-50">
      <Navbar setSolapaActiva={setSolapaActiva} solapaActiva={solapaActiva} />

      <main className="grow overflow-y-auto min-h-0 bg-white">
        {solapaActiva === "qr" && (
          <div className="animate-fade-in h-full">
            <QRSection />
          </div>
        )}

        {/* ARREGLO DE PACIENTES: 
            Añadimos un contenedor con padding para que la lista no pegue contra los bordes 
        */}
        {solapaActiva === "pacientes" && (
          <div className="animate-fade-in p-6 md:p-10">
            <Pacientes />
          </div>
        )}

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
