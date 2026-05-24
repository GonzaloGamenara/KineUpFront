import { Outlet } from "react-router";
import logo from "../../assets/logo.png";
import BottomNavigation from "./BottomNavigation.jsx";
import Sidebar from "./Sidebar.jsx";
import { useRef, useState } from "react";

export default function AppLayout() {
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = (e) => {
  const currentY = e.currentTarget.scrollTop;

  setHideHeader(currentY > lastScrollY.current && currentY > 40);

  lastScrollY.current = currentY;
};

  return (
    <div className="h-dvh overflow-hidden bg-[#F5F8F6]">
      <header className={`fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-center bg-white transition-transform duration-300 md:translate-y-0 ${ hideHeader ? "-translate-y-full md:translate-y-0" : "translate-y-0"}`}>
        <img src={logo} alt="KineUp" className="h-25 w-fit mx-auto" />
      </header>

      <Sidebar />

      <main onScroll={handleScroll} className="h-dvh overflow-y-auto px-5 pb-24 pt-20 md:ml-64 md:px-8 md:pb-8">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
}