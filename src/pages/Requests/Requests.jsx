import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { FaSearch, FaFilter } from "react-icons/fa";
import api from "../../services/api";
import Loading from "../../components/Loading";

function Requests() {
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/admin/service-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter((req) => {
    const customerName = req.customer?.name || req.customer || "";
    const reqId = req.id ? String(req.id) : "";

    const matchesSearch =
      reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={isAr ? "جاري جلب طلبات الصيانة..." : "Fetching service requests..."}
      />
    );
  }

  return (
    <div>
      <div className="page-header mb-4">
        <h2>{isAr ? "طلبات الصيانة" : "Service Requests"}</h2>
        <p className="text-muted">
          {isAr
            ? "متابعة كافة طلبات الصيانة والحالات الخاصة بها في النظام"
            : "Monitor all service requests and their current statuses in the system"}
        </p>
      </div>

      <div className="dashboard-section">
        <div className="row mb-3 g-2">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder={
                  isAr
                    ? "بحث برقم الطلب أو اسم العميل..."
                    : "Search by order ID or customer name..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaFilter />
              </span>
              <select
                className="form-select border-start-0"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">{isAr ? "جميع الحالات" : "All Statuses"}</option>
                <option value="PENDING">
                  {isAr ? "في الانتظار" : "Pending"}
                </option>
                <option value="ACTIVE">
                  {isAr ? "جاري التنفيذ" : "Active"}
                </option>
                <option value="COMPLETED">
                  {isAr ? "مكتملة" : "Completed"}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>{isAr ? "رقم الطلب" : "Order ID"}</th>
                <th>{isAr ? "العميل" : "Customer"}</th>
                <th>{isAr ? "الفني" : "Technician"}</th>
                <th>{isAr ? "المهنة" : "Craft"}</th>
                <th>{isAr ? "الموقع" : "Location"}</th>
                <th>{isAr ? "الحالة" : "Status"}</th>
                <th>{isAr ? "التكلفة" : "Price"}</th>
                <th>{isAr ? "الإجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    {isAr
                      ? "لا توجد طلبات صيانة مطابقة للبحث حاليًا"
                      : "No matching service requests found"}
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.id}</strong>
                    </td>
                    <td>{req.customer?.name || req.customer || "—"}</td>
                    <td>
                      {req.technician?.name ||
                        req.technician ||
                        (isAr ? "لم يتم التحديد" : "Unassigned")}
                    </td>
                    <td>{req.craft?.name || req.craft || "—"}</td>
                    <td>{req.location || "—"}</td>
                    <td>
                      <span
                        className={`status ${
                          req.status === "ACTIVE"
                            ? "active"
                            : req.status === "PENDING"
                            ? "pending"
                            : "completed"
                        }`}
                      >
                        {req.status === "ACTIVE"
                          ? isAr
                            ? "نشط"
                            : "Active"
                          : req.status === "PENDING"
                          ? isAr
                            ? "معلق"
                            : "Pending"
                          : isAr
                          ? "مكتمل"
                          : "Completed"}
                      </span>
                    </td>
                    <td>
                      {req.price
                        ? `${req.price} ${isAr ? "ج.م" : "EGP"}`
                        : "—"}
                    </td>
                    <td>
                      <Link
                        to={`/requests/${req.id}`}
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                      >
                        <FaEye /> {isAr ? "التفاصيل" : "Details"}
                      </Link>
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

export default Requests;