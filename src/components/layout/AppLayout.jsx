// src/layouts/AppLayout.jsx
import { Outlet } from "react-router";
import logo from "../../assets/logo.png";
import BottomNavigation from "./BottomNavigation.jsx";
import Sidebar from "./Sidebar.jsx";

export default function AppLayout() {
  return (
    <div className="h-dvh overflow-hidden bg-[#F5F8F6]">
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-center border-b border-slate-100 bg-white px-4 md:justify-start md:pl-72">
        <img src={logo} alt="KineUp" className="h-9" />
      </header>

      <Sidebar className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64" />

      <main className="h-full overflow-y-auto px-5 pb-24 pt-20 md:ml-64 md:px-8">
        <Outlet />
      </main>

      <BottomNavigation className="fixed bottom-0 left-0 right-0 z-40 md:hidden" />
    </div>
  );
}