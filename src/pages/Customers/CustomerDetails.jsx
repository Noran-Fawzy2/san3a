import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  return (
    <div>
      <button
        onClick={() => navigate("/customers")}
        className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
      >
        {isAr ? <FaArrowRight /> : <FaArrowLeft />}
        <span>{isAr ? "العودة للعملاء" : "Back to Customers"}</span>
      </button>

      <div className="dashboard-section">
        <h4>
          {isAr ? "تفاصيل العميل:" : "Customer Details:"} {id}
        </h4>
        <p className="text-muted">
          {isAr
            ? "عرض سجل الطلبات والتفاصيل الشخصية الخاصة بالعميل."
            : "View request history and personal details of the customer."}
        </p>
      </div>
    </div>
  );
}

export default CustomerDetails;