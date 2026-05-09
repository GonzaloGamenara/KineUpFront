import React from "react";
import qr from "/public/qr_example.png";
import QRbutton from "/src/components/QRbutton.jsx";
import logo_grande from "/public/logo_grande.png";

function QRSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-20 py-10 animate-fade-in [animation-delay:250ms]">
      <h1 className="font-bold text-6xl text-primary select-none text-center">
        Tu Codigo QR
      </h1>

      <img
        src={qr}
        alt="QR Code"
        className="w-64 h-64 shadow-xl rounded-lg bg-white p-2 opacity-20"
      />

      <div className="flex flex-wrap justify-center gap-5">
        <QRbutton />
        <button className="bg-primary text-white py-4 px-8 rounded-lg hover:bg-primary-dark cursor-pointer font-bold text-2xl hover:scale-110 transition-transform active:scale-95 shadow-md">
          Imprimir
        </button>
        <button className="bg-primary text-white py-4 px-8 rounded-lg hover:bg-primary-dark cursor-pointer font-bold text-2xl hover:scale-110 transition-transform active:scale-95 shadow-md">
          Compartir
        </button>
      </div>
      <img
        src={logo_grande}
        alt="QR Code"
        className="w-50 h-20 rounded-lg p-2"
      />
    </div>
  );
}

export default QRSection;
