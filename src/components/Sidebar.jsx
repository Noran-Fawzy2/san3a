import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaUserGear,
  FaUsers,
  FaScrewdriverWrench,
  FaClipboardList,
  FaFileCircleCheck,
  FaHeadset,
  FaRightFromBracket,
} from "react-icons/fa6";

function Sidebar({ lang }) {
  const isAr = lang === "ar";

  return (
    <aside className="sidebar">
      <div className="logo">
        {isAr ? "صنعة" : "San3a"}
        <span>{isAr ? "لوحة الأدمن" : "Admin Panel"}</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end>
          <FaChartPie />
          <span>{isAr ? "لوحة التحكم" : "Dashboard"}</span>
        </NavLink>

        <NavLink to="/technicians">
          <FaUserGear />
          <span>{isAr ? "الفنيين" : "Technicians"}</span>
        </NavLink>

        <NavLink to="/customers">
          <FaUsers />
          <span>{isAr ? "العملاء" : "Customers"}</span>
        </NavLink>

        <NavLink to="/crafts">
          <FaScrewdriverWrench />
          <span>{isAr ? "المهن" : "Crafts"}</span>
        </NavLink>

        <NavLink to="/quizzes">
          <FaClipboardList />
          <span>{isAr ? "الاختبارات" : "Quizzes"}</span>
        </NavLink>

        <NavLink to="/requests">
          <FaFileCircleCheck />
          <span>{isAr ? "طلبات الصيانة" : "Service Requests"}</span>
        </NavLink>

        <NavLink to="/support">
          <FaHeadset />
          <span>{isAr ? "الدعم الفني" : "Support"}</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <button>
          <FaRightFromBracket />
          <span>{isAr ? "تسجيل الخروج" : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;