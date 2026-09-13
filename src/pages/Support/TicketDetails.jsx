import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import api from "../../services/api";
import Loading from "../../components/Loading";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const response = await api.get(`/admin/support/tickets/${id}`);
      setTicket(response.data);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={
          isAr
            ? "جاري تحميل تفاصيل التذكرة..."
            : "Loading ticket details..."
        }
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/support")}
        className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
      >
        {isAr ? <FaArrowRight /> : <FaArrowLeft />}
        <span>{isAr ? "العودة للدعم الفني" : "Back to Support"}</span>
      </button>

      <div className="dashboard-section">
        <h4 className="mb-2">
          {isAr ? "تفاصيل التذكرة:" : "Ticket Details:"} {ticket?.id || id}
        </h4>
        <p className="text-muted mb-4">
          {isAr
            ? "يمكنك إدارة وتحديث حالة هذه التذكرة مباشرة من قسم الدعم."
            : "You can manage and update the status of this ticket directly from the support section."}
        </p>

        {ticket ? (
          <div className="row g-3">
            <div className="col-md-6">
              <strong>{isAr ? "الموضوع:" : "Subject:"}</strong> {ticket.subject}
            </div>
            <div className="col-md-6">
              <strong>{isAr ? "المستخدم:" : "User:"}</strong>{" "}
              {ticket.user?.name || ticket.user || "—"}
            </div>
            <div className="col-md-6">
              <strong>{isAr ? "الحالة:" : "Status:"}</strong>{" "}
              <span
                className={`badge ${
                  ticket.status === "OPEN"
                    ? "bg-warning text-dark"
                    : "bg-success"
                }`}
              >
                {ticket.status === "OPEN"
                  ? isAr
                    ? "مفتوحة"
                    : "Open"
                  : isAr
                  ? "مغلقة"
                  : "Resolved"}
              </span>
            </div>
            <div className="col-md-6">
              <strong>{isAr ? "الأولوية:" : "Priority:"}</strong>{" "}
              <span className="badge bg-danger">
                {ticket.priority === "HIGH"
                  ? isAr
                    ? "عالية"
                    : "High"
                  : ticket.priority === "MEDIUM"
                  ? isAr
                    ? "متوسطة"
                    : "Medium"
                  : isAr
                  ? "منخفضة"
                  : "Low"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted border-top mt-3">
            {isAr
              ? "لم يتم العثور على بيانات هذه التذكرة."
              : "Ticket details not found."}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetails;