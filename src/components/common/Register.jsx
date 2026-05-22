// src/views/auth/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Briefcase,
  Mail,
  Lock,
  AtSign,
  Calendar,
  Eye,
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function Register() {
  const [type, setType] = useState("Paciente");
  const isPatient = type === "Paciente";

  return (
    <section className="flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-emerald-200 px-4 py-3">
      <div className="w-full max-w-md rounded-[1.75rem] bg-white/95 p-4 shadow-xl md:max-w-xl md:p-5">
        <div className="mb-4 text-center">
          <img src={logo} alt="KineUp" className="mx-auto mb-3 h-7" />

          <h1 className="text-xl font-bold text-slate-900">
            Crear cuenta
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Elegí cómo querés registrarte
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setType("Paciente")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
              isPatient ? "bg-emerald-600 text-white shadow" : "text-slate-500"
            }`}
          >
            <User size={16} />
            Paciente
          </button>

          <button
            type="button"
            onClick={() => setType("Profesional")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
              !isPatient ? "bg-emerald-600 text-white shadow" : "text-slate-500"
            }`}
          >
            <Briefcase size={16} />
            Profesional
          </button>
        </div>

        <form className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Nombre" placeholder="Juan" icon={User} />
            <Input label="Apellido" placeholder="Pérez" />
          </div>

          <Input label="Usuario" placeholder="juanperez123" icon={AtSign} />
          <Input label="E-mail" placeholder="correo@ejemplo.com" icon={Mail} />
          <Input
            label="Contraseña"
            placeholder="Tu contraseña segura"
            icon={Lock}
            rightIcon={Eye}
            type="password"
          />

          {isPatient ? (
            <Input
              label="Fecha de nacimiento"
              placeholder="dd/mm/aaaa"
              icon={Calendar}
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Matrícula" placeholder="MP 123456" />
              <Input label="Especialidad" placeholder="Kinesiología" />
            </div>
          )}

          <button className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 active:scale-[0.98]">
            Crear mi cuenta
          </button>
        </form>

        {isPatient && (
          <>
            <div className="my-3 flex items-center gap-3 text-[11px] text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              O BIEN
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 shadow-sm">
              Registrarme con Google
            </button>
          </>
        )}

        <p className="mt-3 text-center text-xs text-slate-500">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-bold text-emerald-700 underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </section>
  );
}

function Input({
  label,
  placeholder,
  icon: Icon,
  rightIcon: RightIcon,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        {Icon && <Icon size={16} className="text-slate-400" />}

        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        {RightIcon && <RightIcon size={16} className="text-slate-400" />}
      </div>
    </label>
  );
}