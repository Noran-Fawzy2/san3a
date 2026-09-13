import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FaUsers,
  FaUserGear,
  FaUserClock,
  FaCircleCheck,
  FaListCheck,
  FaCheckDouble,
} from "react-icons/fa6";
import StatCard from "../../components/StatCard";
import Loading from "../../components/Loading";
import api from "../../services/api";

function Dashboard() {
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get("/admin/dashboard/stats");
      setStats(statsRes.data);

      const requestsRes = await api.get("/admin/service-requests?limit=5");
      setRecentRequests(requestsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={isAr ? "جاري تحميل الإحصائيات..." : "Loading statistics..."}
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{isAr ? "لوحة التحكم" : "Dashboard Overview"}</h2>
          <p>
            {isAr
              ? "مرحبًا بك! إليك ملخص الأداء لمنصة صنعة."
              : "Welcome! Here is the performance summary for the San3a platform."}
          </p>
        </div>
      </div>

      <div className="row">
        <StatCard
          title={isAr ? "إجمالي العملاء" : "Total Customers"}
          value={stats?.totalCustomers || 0}
          icon={<FaUsers />}
          className="blue"
        />
        <StatCard
          title={isAr ? "إجمالي الفنيين" : "Total Technicians"}
          value={stats?.totalTechnicians || 0}
          icon={<FaUserGear />}
          className="purple"
        />
        <StatCard
          title={isAr ? "طلبات فنيين معلقة" : "Pending Technicians"}
          value={stats?.pendingTechnicians || 0}
          icon={<FaUserClock />}
          className="orange"
        />
        <StatCard
          title={isAr ? "فنيين متاحين" : "Active Technicians"}
          value={stats?.activeTechnicians || 0}
          icon={<FaCircleCheck />}
          className="green"
        />
        <StatCard
          title={isAr ? "طلبات نشطة" : "Active Requests"}
          value={stats?.activeRequests || 0}
          icon={<FaListCheck />}
          className="pink"
        />
        <StatCard
          title={isAr ? "طلبات مكتملة" : "Completed Requests"}
          value={stats?.completedRequests || 0}
          icon={<FaCheckDouble />}
          className="teal"
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h5>{isAr ? "أحدث طلبات الصيانة" : "Recent Service Requests"}</h5>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>{isAr ? "العميل" : "Customer"}</th>
                <th>{isAr ? "المهنة" : "Craft"}</th>
                <th>{isAr ? "الموقع" : "Location"}</th>
                <th>{isAr ? "الحالة" : "Status"}</th>
                <th>{isAr ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    {isAr
                      ? "لا توجد طلبات صيانة حاليًا"
                      : "No service requests available"}
                  </td>
                </tr>
              ) : (
                recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.customer?.name}</td>
                    <td>{req.craft?.name}</td>
                    <td>{req.location}</td>
                    <td>
                      <span className={`status ${req.status?.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {new Date(req.createdAt).toLocaleDateString(
                        isAr ? "ar-EG" : "en-US"
                      )}
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

export default Dashboard;