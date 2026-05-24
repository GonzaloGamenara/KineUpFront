import React from "react";
import { useAuth } from "../../auth/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const handleLog = () => {
    console.log(user);
    alert("Todavia no anda :)");
  };

  return (
    <section className="text-slate-800 animate-fade-in">
      <div className="mb-6">
        <span className="text-emerald-700 font-semibold text-sm">
          Configuración
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Mi Perfil
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Visualizá y actualizá tus datos personales y de contacto.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-slate-100">
          <div className="bg-emerald-100 text-emerald-800 rounded-full w-24 h-24 flex items-center justify-center font-bold text-3xl shadow-inner">
            {user?.nombre?.charAt(0)}
            {user?.apellido?.charAt(0)}
          </div>

          <div className="text-center sm:text-left mt-2 sm:mt-0">
            <h2 className="text-xl font-bold text-slate-900">
              {user?.nombre} {user?.apellido}
            </h2>
            <button className="mt-3 text-emerald-600 text-sm font-semibold hover:text-emerald-800 transition-colors">
              Cambiar foto de perfil
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              defaultValue={user?.nombreCompleto}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Usuario
            </label>
            <input
              defaultValue={user?.usuario}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleLog}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
