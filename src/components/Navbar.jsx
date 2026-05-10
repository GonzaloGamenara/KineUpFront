import React from "react";
import profileIcon from "/public/profile.svg";
import logoutIcon from "/public/logout.svg";

function Navbar({ setSolapaActiva, solapaActiva }) {
  const itemClass =
    "cursor-pointer transition-all duration-300 ease-in-out select-none";

  return (
    <nav className="shrink-0 h-25 text-2xl font-bold bg-primary text-white rounded-b-xl animate-slide-down shadow-lg">
      <ul className="flex justify-between px-20 items-center h-full">
        <div className="flex gap-4 items-center h-full">
          <li
            onClick={() => setSolapaActiva("qr")}
            className={`${itemClass} hover:px-2 hover:scale-120 ${solapaActiva === "qr" ? "scale-120 px-2" : "opacity-80 hover:opacity-100"}`}
          >
            QR
          </li>

          <span className="opacity-30 select-none">|</span>

          <li
            onClick={() => setSolapaActiva("pacientes")}
            className={`${itemClass} hover:px-4 hover:scale-120 ${solapaActiva === "pacientes" ? "scale-120 px-4" : "opacity-80 hover:opacity-100"}`}
          >
            Mis Pacientes
          </li>

          <span className="opacity-30 select-none">|</span>

          <li
            onClick={() => setSolapaActiva("rutinas")}
            className={`${itemClass} hover:px-4 hover:scale-120 ${solapaActiva === "rutinas" ? "scale-120 px-4" : "opacity-80 hover:opacity-100"}`}
          >
            Rutinas
          </li>

          <span className="opacity-30 select-none">|</span>

          <li
            onClick={() => setSolapaActiva("faq")}
            className={`${itemClass} hover:px-6 hover:scale-120 ${solapaActiva === "faq" ? "scale-120 px-6" : "opacity-80 hover:opacity-100"}`}
          >
            Preguntas Frecuentes
          </li>
        </div>

        <div className="flex gap-8 items-center h-full">

          <li className="hover:scale-110 transition-transform cursor-pointer">
            <button
              onClick={() => setSolapaActiva("profile")}
              className="flex items-center gap-3"
            >
              <img
                src={profileIcon}
                alt="Profile Icon"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl hidden md:block">Lic. R. Rodriguez</span>
            </button>
          </li>


          <li className="hover:scale-125 transition-transform cursor-pointer group">
            <a href="/login">
              <img
                src={logoutIcon}
                alt="Logout Icon"
                className="w-10 h-10 group-hover:brightness-125"
              />
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
