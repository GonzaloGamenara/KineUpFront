import { Outlet } from "react-router";
import { useState } from "react";
import { Menu } from "lucide-react";
import logo from "../../assets/logo_principal.svg";
import MobileDrawerNavigation from "./MobileDrawerNavigation.jsx";
import Sidebar from "./Sidebar.jsx";

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-dvh overflow-hidden bg-[#F5F8F6]">
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-center border-b border-slate-100 bg-white shadow-sm md:left-64">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 md:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        <img src={logo} alt="KineUp" className="h-20 w-auto" />
      </header>

      <Sidebar />
      <MobileDrawerNavigation
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main
        className="h-dvh overflow-y-auto px-5 pb-8 pt-24 md:ml-64 md:px-10 md:pb-8 lg:px-12"
      >
        <Outlet />
      </main>
    </div>
  );
}
