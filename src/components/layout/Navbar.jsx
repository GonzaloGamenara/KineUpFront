import React from "react";
import logo from "/logo_grande.png";
import profileIcon from "/profile.svg";
import logoutIcon from "/logout.svg";

function Navbar({
  setSolapaActiva,
  solapaActiva,
  nombreKine = "R. Rodriguez",
}) {
  const itemClass =
    "cursor-pointer transition-all duration-300 ease-in-out select-none";
      
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-center border-b border-slate-100 bg-white px-4 md:justify-start md:pl-72">
      <img src={logo} alt="KineUp" className="h-20 w-fit mx-auto" />
      <ul className="flex justify-between px-10 items-center h-full">
        {/* Contenedor Izquierdo: Logo + Items */}
        <div className="flex gap-10 items-center h-full">
          {/* Logo KineUp */}
          <li
            onClick={() => setSolapaActiva("qr")}
            className="cursor-pointer hover:scale-105 transition-transform mr-4"
          >
            <img
              src={logo}
              alt="KineUp"
              className="h-12 w-auto brightness-0 invert"
            />
          </li>

          <li
            onClick={() => setSolapaActiva("qr")}
            className={`${itemClass} hover:px-2 hover:scale-120 ${solapaActiva === "qr" ? "scale-120 px-2 text-green-300" : "opacity-80 hover:opacity-100"}`}
          >
            QR
          </li>

          <span className="opacity-30 select-none">|</span>

          <li
            onClick={() => setSolapaActiva("pacientes")}
            className={`${itemClass} hover:px-4 hover:scale-120 ${solapaActiva === "pacientes" ? "scale-120 px-4 text-green-300" : "opacity-80 hover:opacity-100"}`}
          >
            Mis Pacientes
          </li>

          <span className="opacity-30 select-none">|</span>

          <li
            onClick={() => setSolapaActiva("rutinas")}
            className={`${itemClass} hover:px-4 hover:scale-120 ${solapaActiva === "rutinas" ? "scale-120 px-4 text-green-300" : "opacity-80 hover:opacity-100"}`}
          >
            Rutinas
          </li>

          <span className="opacity-30 select-none">|</span>

          <li
            onClick={() => setSolapaActiva("faq")}
            className={`${itemClass} hover:px-6 hover:scale-120 ${solapaActiva === "faq" ? "scale-120 px-6 text-green-300" : "opacity-80 hover:opacity-100"}`}
          >
            Preguntas Frecuentes
          </li>
        </div>

        {/* Contenedor Derecho: Perfil y Salir */}
        <div className="flex gap-8 items-center h-full">
          <li className="hover:scale-110 transition-transform cursor-pointer">
            <button
              onClick={() => setSolapaActiva("profile")}
              className="flex items-center gap-3"
            >
              <img
                src={profileIcon}
                alt="Profile Icon"
                className="w-10 h-10 rounded-full bg-white/10"
              />
              <span className="text-xl hidden md:block">Lic. {nombreKine}</span>
            </button>
          </li>

          <li className="hover:scale-125 transition-transform cursor-pointer group">
            <a href="/login">
              <img
                src={logoutIcon}
                alt="Logout Icon"
                className="w-10 h-10 invert group-hover:brightness-125"
              />
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
