import { FaBell } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa";

function Navbar({ lang, toggleLang }) {
  return (
    <header className="top-navbar">
      <div>
        <h5>{lang === "ar" ? "لوحة التحكم" : "Admin Dashboard"}</h5>
        <small>
          {lang === "ar" ? "إدارة منصة صنعة" : "Manage San3a platform"}
        </small>
      </div>

      <div className="admin-info">
        {}
        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          onClick={toggleLang}
        >
          <FaGlobe />
          <span>{lang === "ar" ? "English" : "عربي"}</span>
        </button>

        <button className="notification">
          <FaBell />
          <span>3</span>
        </button>

        <div className="admin-profile">
          <div className="avatar">A</div>
          <div>
            <strong>{lang === "ar" ? "الأدمن" : "Admin"}</strong>
            <small>{lang === "ar" ? "مدير النظام" : "Administrator"}</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;