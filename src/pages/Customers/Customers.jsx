import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { FaUserSlash, FaUserCheck, FaEye } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import api from "../../services/api";
import Loading from "../../components/Loading";

function Customers() {
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/admin/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await api.patch(`/admin/customers/${id}/status`, { status: newStatus });
      
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      console.error("Error updating customer status:", error);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={isAr ? "جاري جلب قائمة العملاء..." : "Fetching customers list..."}
      />
    );
  }

  return (
    <div>
      <div className="page-header mb-4">
        <h2>{isAr ? "إدارة العملاء" : "Customer Management"}</h2>
        <p className="text-muted">
          {isAr
            ? "متابعة حسابات العملاء المسجلين والتحكم في صلاحيات الوصول"
            : "Monitor registered customer accounts and manage access permissions"}
        </p>
      </div>

      <div className="dashboard-section">
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder={
                  isAr ? "بحث بالاسم أو البريد..." : "Search by name or email..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>{isAr ? "العميل" : "Customer"}</th>
                <th>{isAr ? "الهاتف" : "Phone"}</th>
                <th>{isAr ? "المدينة" : "City"}</th>
                <th>{isAr ? "إجمالي الطلبات" : "Total Requests"}</th>
                <th>{isAr ? "الحالة" : "Status"}</th>
                <th>{isAr ? "تاريخ الانضمام" : "Joined Date"}</th>
                <th>{isAr ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    {isAr
                      ? "لا يوجد عملاء مسجلين حاليًا"
                      : "No registered customers found"}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                      <br />
                      <small className="text-muted">{c.email}</small>
                    </td>
                    <td>{c.phone || "—"}</td>
                    <td>{c.city || "—"}</td>
                    <td>{c.requestsCount || 0}</td>
                    <td>
                      <span
                        className={`status ${
                          c.status === "ACTIVE" ? "active" : "pending"
                        }`}
                      >
                        {c.status === "ACTIVE"
                          ? isAr
                            ? "نشط"
                            : "Active"
                          : isAr
                          ? "محظور"
                          : "Blocked"}
                      </span>
                    </td>
                    <td>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString(
                            isAr ? "ar-EG" : "en-US"
                          )
                        : "—"}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/customers/${c.id}`}
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                        >
                          <FaEye /> {isAr ? "عرض" : "View"}
                        </Link>
                        <button
                          className={`btn btn-sm ${
                            c.status === "ACTIVE"
                              ? "btn-outline-danger"
                              : "btn-outline-success"
                          }`}
                          onClick={() => toggleStatus(c.id, c.status)}
                        >
                          {c.status === "ACTIVE" ? <FaUserSlash /> : <FaUserCheck />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Customers;