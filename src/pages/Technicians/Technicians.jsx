import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import api from "../../services/api";
import Loading from "../../components/Loading";

function Technicians() {
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPendingTechnicians();
  }, []);

  const fetchPendingTechnicians = async () => {
    try {
      const response = await api.get("/admin/technicians/pending");
      setTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = technicians.filter(
    (tech) =>
      tech.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="status active">{isAr ? "مقبول" : "Approved"}</span>;
      case "REJECTED":
        return <span className="status completed">{isAr ? "مرفوض" : "Rejected"}</span>;
      default:
        return <span className="status pending">{isAr ? "قيد المراجعة" : "Pending"}</span>;
    }
  };

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={
          isAr
            ? "جاري جلب طلبات الفنيين..."
            : "Fetching technician requests..."
        }
      />
    );
  }

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{isAr ? "مراجعة الفنيين" : "Technician Verification"}</h2>
          <p className="text-muted">
            {isAr
              ? "مراجعة بيانات الطلبات المقدمة والتحقق من الهوية والاختبارات"
              : "Review submitted application data, verify identity, and test results"}
          </p>
        </div>
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
                <th>{isAr ? "الاسم" : "Name"}</th>
                <th>{isAr ? "المهنة" : "Craft"}</th>
                <th>{isAr ? "الهاتف" : "Phone"}</th>
                <th>{isAr ? "نتيجة الاختبار" : "Quiz Score"}</th>
                <th>{isAr ? "الحالة" : "Status"}</th>
                <th>{isAr ? "التاريخ" : "Date"}</th>
                <th>{isAr ? "الإجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    {isAr
                      ? "لا توجد طلبات فنيين معلقة حاليًا"
                      : "No pending technician applications found"}
                  </td>
                </tr>
              ) : (
                filtered.map((tech) => (
                  <tr key={tech.id}>
                    <td>
                      <strong>{tech.name}</strong>
                      <br />
                      <small className="text-muted">{tech.email}</small>
                    </td>
                    <td>{tech.craft?.name || tech.craft || "—"}</td>
                    <td>{tech.phone || "—"}</td>
                    <td>
                      <span className="badge bg-success">
                        {tech.score ?? tech.quizScore ?? "—"}
                      </span>
                    </td>
                    <td>{renderStatusBadge(tech.verificationStatus)}</td>
                    <td>
                      {tech.createdAt
                        ? new Date(tech.createdAt).toLocaleDateString(
                            isAr ? "ar-EG" : "en-US"
                          )
                        : "—"}
                    </td>
                    <td>
                      <Link
                        to={`/technicians/${tech.id}`}
                        className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
                      >
                        <FaEye /> {isAr ? "عرض والتفعيل" : "View & Activate"}
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

export default Technicians;