import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

export default function LogoutButton({ className = "" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const baseStyles = "flex items-center cursor-pointer gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition";
  const defaultStyles = "text-slate-500 hover:bg-red-50 hover:text-red-500";

  return (
    <button
      onClick={handleLogout}
      className={className || `${baseStyles} ${defaultStyles}`}
    >
      <LogOut size={21} />
      Cerrar sesión
    </button>
  );
}