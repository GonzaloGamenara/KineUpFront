import { Outlet } from "react-router";
import Navbar from "../layout/Navbar.jsx";

export default function PacienteLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </>
  );
}