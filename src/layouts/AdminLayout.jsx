import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout() {
  const [lang, setLang] = useState("ar");

  const toggleLang = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="admin-layout">
      <Sidebar lang={lang} />

      <div className="main-content">
        <Navbar lang={lang} toggleLang={toggleLang} />

        <main className="page-content">
          <Outlet context={{ lang }} />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;