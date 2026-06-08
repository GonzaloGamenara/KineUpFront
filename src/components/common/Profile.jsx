import React from "react";
import { useAuth } from "../../auth/AuthContext";
import LogoutButton from "./LogoutButton";

const Profile = () => {
  const { user } = useAuth();

  return (
    <section className="text-slate-800 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Mi Perfil
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Consulta tus datos personales.
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
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Usuario
            </label>
            <input
              defaultValue={user?.usuario}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 outline-none"
            />
          </div>
        </div>

      </div>

      <div className="mt-6">
        <LogoutButton className="w-full flex items-center cursor-pointer justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 bg-white border border-red-200 hover:border-red-300 transition" />
      </div>
    </section>
  );
};

export default Profile;
