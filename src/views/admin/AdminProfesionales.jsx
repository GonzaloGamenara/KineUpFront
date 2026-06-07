import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Loader2,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { httpClient } from "../../api/httpClient.js";
import { useAuth } from "../../auth/AuthContext";
import { getAdminOrganizations } from "../../auth/organizationStorage.js";
import LogoutButton from "../../components/common/LogoutButton.jsx";

const initialForm = {
  nombre: "",
  apellido: "",
  email: "",
  usuario: "",
  password: "",
  fechaNacimiento: "",
  numeroMatricula: "",
};

const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const getProfesionalId = (profesional) =>
  getValue(profesional, "idProfesional", "IdProfesional");

const getProfesionalNombre = (profesional) => {
  const nombreCompleto = getValue(
    profesional,
    "nombreCompleto",
    "NombreCompleto"
  );
  const nombre = `${getValue(profesional, "nombre", "Nombre") ?? ""} ${
    getValue(profesional, "apellido", "Apellido") ?? ""
  }`.trim();

  return nombreCompleto || nombre || "Profesional";
};

export default function AdminProfesionales() {
  const { user } = useAuth();
  const organizaciones = getAdminOrganizations(user);
  const [profesionales, setProfesionales] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    cargarProfesionales();
  }, []);

  const cargarProfesionales = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await httpClient.get("/api/Admin/profesionales");
      const data = response?.data ?? response ?? [];

      setProfesionales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar profesionales:", err);
      setError(err?.message || "No se pudieron cargar los profesionales.");
    } finally {
      setLoading(false);
    }
  };

  const profesionalesFiltrados = useMemo(() => {
    return profesionales.filter((profesional) => {
      const texto = [
        getProfesionalNombre(profesional),
        getValue(profesional, "email", "Email"),
        getValue(profesional, "usuario", "Usuario"),
        getValue(profesional, "numeroMatricula", "NumeroMatricula"),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return texto.includes(search.toLowerCase());
    });
  }, [profesionales, search]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const crearProfesional = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await httpClient.post("/api/Admin/profesionales", {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        usuario: form.usuario.trim(),
        password: form.password,
        fechaNacimiento: form.fechaNacimiento,
        numeroMatricula: form.numeroMatricula.trim(),
      });

      setSuccess("Profesional creado correctamente.");
      setForm(initialForm);
      await cargarProfesionales();
    } catch (err) {
      console.error("Error al crear profesional:", err);
      setError(err?.message || "No se pudo crear el profesional.");
    } finally {
      setSaving(false);
    }
  };

  const desactivarProfesional = async (profesional) => {
    const idProfesional = getProfesionalId(profesional);
    const nombre = getProfesionalNombre(profesional);

    if (!idProfesional) return;

    const confirmado = window.confirm(
      `Vas a desactivar a ${nombre} de esta organizacion. Esta accion no elimina su usuario.`
    );

    if (!confirmado) return;

    setError("");
    setSuccess("");

    try {
      await httpClient.patch(
        `/api/Admin/profesionales/${idProfesional}/desactivar`
      );
      setSuccess("Profesional desactivado correctamente.");
      await cargarProfesionales();
    } catch (err) {
      console.error("Error al desactivar profesional:", err);
      setError(err?.message || "No se pudo desactivar el profesional.");
    }
  };

  return (
    <section className="min-h-dvh bg-[#F5F8F6] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="KineUp" className="h-12 w-auto" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Administracion
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                Profesionales
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {organizaciones.map((org) => org.nombre).join(", ") ||
                  "Organizacion"}
              </p>
            </div>
          </div>

          <LogoutButton />
        </header>

        {(error || success) && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              error
                ? "border border-red-100 bg-red-50 text-red-700"
                : "border border-emerald-100 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <div className="rounded-[2rem] bg-white p-4 shadow-sm">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar profesional"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Users size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Profesionales activos
                    </h2>
                    <p className="text-xs font-medium text-slate-500">
                      {profesionalesFiltrados.length} resultados
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-48 items-center justify-center">
                  <Loader2 className="animate-spin text-emerald-600" />
                </div>
              ) : profesionalesFiltrados.length < 1 ? (
                <div className="p-8 text-center">
                  <Briefcase
                    className="mx-auto mb-3 text-slate-300"
                    size={42}
                  />
                  <p className="text-sm font-semibold text-slate-500">
                    No hay profesionales para mostrar.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {profesionalesFiltrados.map((profesional) => (
                    <div
                      key={getProfesionalId(profesional)}
                      className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {getProfesionalNombre(profesional)}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {getValue(profesional, "email", "Email") ||
                            "Sin email"}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {getValue(
                            profesional,
                            "numeroMatricula",
                            "NumeroMatricula"
                          ) || "Sin matricula"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => desactivarProfesional(profesional)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 ring-1 ring-red-100"
                      >
                        <Trash2 size={15} />
                        Desactivar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={crearProfesional}
            className="rounded-[2rem] bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Plus size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Nuevo profesional
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  Se vincula a tu organizacion.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <FormInput
                label="Nombre"
                value={form.nombre}
                onChange={(value) => updateField("nombre", value)}
                required
              />
              <FormInput
                label="Apellido"
                value={form.apellido}
                onChange={(value) => updateField("apellido", value)}
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                required
              />
              <FormInput
                label="Usuario"
                value={form.usuario}
                onChange={(value) => updateField("usuario", value)}
                required
              />
              <FormInput
                label="Password temporal"
                type="password"
                value={form.password}
                onChange={(value) => updateField("password", value)}
                required
              />
              <FormInput
                label="Fecha de nacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(value) => updateField("fechaNacimiento", value)}
                required
              />
              <FormInput
                label="Matricula"
                value={form.numeroMatricula}
                onChange={(value) => updateField("numeroMatricula", value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 className="animate-spin" size={17} />}
              Crear profesional
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
      />
    </label>
  );
}
