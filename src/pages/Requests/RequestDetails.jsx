import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import api from "../../services/api";
import Loading from "../../components/Loading";

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const response = await api.get(`/admin/service-requests/${id}`);
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
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
            ? "جاري تحميل تفاصيل الطلب..."
            : "Loading request details..."
        }
      />
    );
  }

  if (!request) {
    return (
      <div>
        <button
          onClick={() => navigate("/requests")}
          className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
        >
          {isAr ? <FaArrowRight /> : <FaArrowLeft />}
          <span>{isAr ? "العودة للطلبات" : "Back to Requests"}</span>
        </button>
        <div className="dashboard-section text-center py-5 text-muted">
          {isAr ? "عفوًا، لم يتم العثور على تفاصيل هذا الطلب." : "Request details not found."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/requests")}
        className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
      >
        {isAr ? <FaArrowRight /> : <FaArrowLeft />}
        <span>{isAr ? "العودة للطلبات" : "Back to Requests"}</span>
      </button>

      <div className="dashboard-section">
        <h4 className="mb-4">
          {isAr ? "تفاصيل الطلب:" : "Request Details:"} {request.id || id}
        </h4>

        <div className="row g-4">
          <div className="col-md-6">
            <h6 className="text-muted">
              {isAr ? "بيانات العميل" : "Customer Information"}
            </h6>
            <p className="mb-1">
              <strong>{isAr ? "الاسم:" : "Name:"}</strong>{" "}
              {request.customer?.name || request.customer || "—"}
            </p>
            <p className="mb-1">
              <strong>{isAr ? "الهاتف:" : "Phone:"}</strong>{" "}
              {request.customer?.phone || request.customerPhone || "—"}
            </p>
            <p className="mb-1">
              <strong>{isAr ? "العنوان:" : "Location:"}</strong>{" "}
              {request.location || "—"}
            </p>
          </div>

          <div className="col-md-6">
            <h6 className="text-muted">
              {isAr ? "بيانات الفني والخدمة" : "Technician & Service Details"}
            </h6>
            <p className="mb-1">
              <strong>{isAr ? "الفني:" : "Technician:"}</strong>{" "}
              {request.technician?.name || request.technician || "—"}
            </p>
            <p className="mb-1">
              <strong>{isAr ? "المهنة:" : "Craft:"}</strong>{" "}
              {request.craft?.name || request.craft || "—"}
            </p>
            <p className="mb-1">
              <strong>{isAr ? "الحالة:" : "Status:"}</strong>{" "}
              <span
                className={`status ${
                  request.status?.toLowerCase() || "pending"
                }`}
              >
                {request.status === "ACTIVE"
                  ? isAr ? "نشط" : "Active"
                  : request.status === "COMPLETED"
                  ? isAr ? "مكتمل" : "Completed"
                  : isAr ? "معلق" : "Pending"}
              </span>
            </p>
          </div>

          <div className="col-12 border-top pt-3">
            <h6 className="text-muted">
              {isAr ? "وصف المشكلة" : "Problem Description"}
            </h6>
            <p className="p-3 bg-light rounded">
              {request.description ||
                (isAr ? "لا يوجد وصف مدون." : "No description provided.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;