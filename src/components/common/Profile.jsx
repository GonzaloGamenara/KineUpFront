import React from "react";
import { useAuth } from "../../auth/AuthContext";
import LogoutButton from "./LogoutButton";
import { Camera, Mail, User, AtSign, Save } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  const handleLog = () => {
    console.log(user);
    alert("Todavía no anda :)");
  };

  // Función auxiliar para obtener las iniciales de forma segura
  const getInitials = () => {
    const nombre = user?.nombre?.charAt(0) || "";
    const apellido = user?.apellido?.charAt(0) || "";
    return (nombre + apellido).toUpperCase() || "U";
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6 pb-10 animate-fade-in text-slate-800">
      
      {/* HEADER */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Mi Perfil
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Visualizá y actualizá tus datos personales.
        </p>
      </div>

      {/* TARJETA PRINCIPAL */}
      <div className="rounded-[2rem] bg-white p-6 sm:p-10 shadow-sm border border-slate-100 transition-all hover:shadow-md">
        
        {/* SECCIÓN AVATAR */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-slate-100">
          
          <div className="relative group cursor-pointer">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-inner transition-all group-hover:opacity-80">
              {getInitials()}
            </div>
            
            {/* Overlay hover para cambiar foto */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={28} className="text-white" />
            </div>
          </div>

          <div className="text-center sm:text-left mt-2 sm:mt-0 flex flex-col justify-center h-full sm:h-24">
            <h2 className="text-2xl font-bold text-slate-900">
              {user?.nombreCompleto || "Usuario"}
            </h2>
            <button className="mt-2 text-left text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-800 active:scale-95">
              Cambiar foto de perfil
            </button>
          </div>

        </div>

        {/* FORMULARIO DE DATOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Input: Nombre Completo */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">
              Nombre completo
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                defaultValue={user?.nombreCompleto}
                placeholder="Ingresá tu nombre"
                className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>
          </div>

          {/* Input: Correo electrónico */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                defaultValue={user?.email}
                placeholder="tu@email.com"
                className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>
          </div>

          {/* Input: Usuario */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-bold text-slate-700 ml-1">
              Nombre de usuario
            </label>
            <div className="relative">
              <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                defaultValue={user?.usuario}
                placeholder="Nombre de usuario"
                className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>
          </div>

        </div>

        {/* ACCIÓN: GUARDAR */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleLog}
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#007A3F] hover:bg-[#006432] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98]"
          >
            <Save size={18} className="transition-transform group-hover:scale-110" />
            Guardar cambios
          </button>
        </div>
      </div>

      {/* ACCIÓN: CERRAR SESIÓN */}
      <div className="mt-6">
        <LogoutButton 
          className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-white px-4 py-4 text-sm font-bold text-red-600 shadow-sm transition-all hover:border-red-600 hover:bg-red-600 hover:text-white active:scale-[0.99]" 
        />
      </div>

    </section>
  );
};

export default Profile;