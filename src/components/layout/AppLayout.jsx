import { Outlet } from "react-router";
import logo from "../../assets/logo.png";
import BottomNavigation from "./BottomNavigation.jsx";
import Sidebar from "./Sidebar.jsx";

export default function AppLayout() {
  return (
    <div className="h-dvh overflow-hidden bg-[#F5F8F6]">
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-center bg-primary px-4 md:justify-start md:pl-72">
      </header>

      <Sidebar />

      <main className="h-dvh overflow-y-auto px-5 pb-24 pt-20 md:ml-64 md:px-8 md:pb-8">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
}