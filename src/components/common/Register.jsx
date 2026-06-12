import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AtSign,
  Calendar,
  Eye,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { httpClient } from "../../api/httpClient.js";
import { useAuth } from "../../auth/AuthContext";
import { getUserRoles } from "../../auth/organizationStorage.js";
import GoogleLoginButton from "./GoogleLogin.jsx";

const initialForm = {
  nombre: "",
  apellido: "",
  usuario: "",
  email: "",
  password: "",
  fechaNacimiento: "",
};

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = useMemo(() => {
    const requiredBase = Boolean(
      form.nombre.trim() &&
      form.apellido.trim() &&
      form.usuario.trim() &&
      form.email.trim() &&
      form.password.trim()
    );

    if (!requiredBase) return false;

    return Boolean(form.fechaNacimiento);
  }, [form]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!canSubmit) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      usuario: form.usuario.trim(),
      email: form.email.trim(),
      password: form.password,
      fechaNacimiento: form.fechaNacimiento,
    };

    setLoading(true);

    try {
      await httpClient.post("/api/User/registrar/paciente", payload);

      setSuccess("Cuenta creada correctamente. Ya podés iniciar sesión.");
      setForm(initialForm);
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      setError(err?.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (token) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await httpClient.post("/api/Auth/google/paciente", {
        Token: token,
      });

      if (!(data?.token ?? data?.Token)) {
        setError("No se pudo registrar con Google.");
        return;
      }

      const userData = await login(data);
      const roles = getUserRoles(userData);

      if (!roles.length) {
        setError("No se pudo registrar con Google.");
        return;
      }

      navigate("/paciente/home", { replace: true });
    } catch (err) {
      console.error("Error al registrar con Google:", err);
      setError("No se pudo registrar con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-emerald-200 px-4 py-4">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-5 shadow-xl shadow-emerald-900/10 md:max-w-xl md:p-6">
        <div className="mb-5 text-center">
          <img
            src={logo}
            alt="KineUp"
            width="93"
            height="64"
            loading="eager"
            decoding="async"
            className="mx-auto mb-3 h-16 w-auto"
          />

          <h1 className="text-xl font-bold text-slate-900">Crear cuenta</h1>

          <p className="mt-1 text-xs text-slate-500">
            Registro disponible para pacientes
          </p>
        </div>

        {error && (
          <div className="mb-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Nombre"
              placeholder="Juan"
              icon={User}
              value={form.nombre}
              onChange={(value) => updateField("nombre", value)}
              required
            />
            <Input
              label="Apellido"
              placeholder="Pérez"
              value={form.apellido}
              onChange={(value) => updateField("apellido", value)}
              required
            />
          </div>

          <Input
            label="Usuario"
            placeholder="juanperez123"
            icon={AtSign}
            value={form.usuario}
            onChange={(value) => updateField("usuario", value)}
            required
          />
          <Input
            label="Email"
            placeholder="correo@ejemplo.com"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(value) => updateField("email", value)}
            required
          />
          <Input
            label="Contraseña"
            placeholder="Tu contraseña segura"
            icon={Lock}
            rightIcon={Eye}
            type="password"
            value={form.password}
            onChange={(value) => updateField("password", value)}
            required
          />

          <Input
            label="Fecha de nacimiento"
            icon={Calendar}
            type="date"
            value={form.fechaNacimiento}
            onChange={(value) => updateField("fechaNacimiento", value)}
            required
          />

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={17} />}
            {loading ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          o bien
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleLoginButton onSuccess={handleGoogleRegister} />

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
  value,
  onChange,
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-emerald-500">
        {Icon && <Icon size={16} className="text-slate-400" />}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        {RightIcon && <RightIcon size={16} className="text-slate-400" />}
      </div>
    </label>
  );
}
