import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { FaCheck, FaXmark, FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import api from "../../services/api";
import Loading from "../../components/Loading";

function TechnicianDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [techData, setTechData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchTechnicianDetails();
  }, [id]);

  const fetchTechnicianDetails = async () => {
    try {
      const response = await api.get(`/admin/technicians/${id}`);
      setTechData(response.data);
    } catch (error) {
      console.error("Error fetching technician details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await api.patch(`/admin/technicians/${id}/approve`);
      alert(
        isAr
          ? "تمت الموافقة على الفني بنجاح!"
          : "Technician approved successfully!"
      );
      navigate("/technicians");
    } catch (error) {
      console.error("Error approving technician:", error);
      alert(
        isAr
          ? "حدث خطأ أثناء الموافقة على الفني"
          : "An error occurred while approving the technician"
      );
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert(
        isAr
          ? "يرجى كتابة سبب الرفض."
          : "Please provide a reason for rejection."
      );
      return;
    }

    try {
      await api.patch(`/admin/technicians/${id}/reject`, {
        reason: rejectReason,
      });
      alert(
        isAr
          ? `تم رفض الطلب. السبب: ${rejectReason}`
          : `Request rejected. Reason: ${rejectReason}`
      );
      setShowRejectModal(false);
      navigate("/technicians");
    } catch (error) {
      console.error("Error rejecting technician:", error);
      alert(
        isAr
          ? "حدث خطأ أثناء رفض الطلب"
          : "An error occurred while rejecting the technician"
      );
    }
  };

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={
          isAr
            ? "جاري تحميل تفاصيل الفني..."
            : "Loading technician details..."
        }
      />
    );
  }

  if (!techData) {
    return (
      <div>
        <button
          onClick={() => navigate("/technicians")}
          className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
        >
          {isAr ? <FaArrowRight /> : <FaArrowLeft />}
          <span>{isAr ? "العودة للفنيين" : "Back to Technicians"}</span>
        </button>
        <div className="dashboard-section text-center py-5 text-muted">
          {isAr ? "لم يتم العثور على بيانات الفني." : "Technician data not found."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/technicians")}
        className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
      >
        {isAr ? <FaArrowRight /> : <FaArrowLeft />}
        <span>{isAr ? "العودة للفنيين" : "Back to Technicians"}</span>
      </button>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2>
          {isAr ? "تفاصيل الفني:" : "Technician Details:"} {techData.name}
        </h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={handleApprove}
          >
            <FaCheck /> {isAr ? "موافقة وتفعيل" : "Approve"}
          </button>
          <button
            className="btn btn-danger d-flex align-items-center gap-2"
            onClick={() => setShowRejectModal(true)}
          >
            <FaXmark /> {isAr ? "رفض الطلب" : "Reject"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* البيانات الشخصية */}
        <div className="col-md-6">
          <div className="dashboard-section h-100">
            <h5 className="mb-3">
              {isAr ? "البيانات الشخصية" : "Personal Information"}
            </h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item bg-transparent">
                <strong>{isAr ? "الاسم:" : "Name:"}</strong> {techData.name}
              </li>
              <li className="list-group-item bg-transparent">
                <strong>{isAr ? "البريد الإلكتروني:" : "Email:"}</strong>{" "}
                {techData.email}
              </li>
              <li className="list-group-item bg-transparent">
                <strong>{isAr ? "الهاتف:" : "Phone:"}</strong> {techData.phone}
              </li>
              <li className="list-group-item bg-transparent">
                <strong>{isAr ? "المهنة:" : "Craft:"}</strong>{" "}
                {techData.craft?.name || techData.craft}
              </li>
              <li className="list-group-item bg-transparent">
                <strong>{isAr ? "الرقم القومي:" : "National ID:"}</strong>{" "}
                {techData.nationalId}
              </li>
            </ul>
          </div>
        </div>

        {}
        <div className="col-md-6">
          <div className="dashboard-section h-100">
            <h5 className="mb-3">
              {isAr ? "نتائج اختبار التقييم" : "Quiz Assessment Results"}
            </h5>
            {techData.quiz ? (
              <>
                <div className="p-3 bg-light rounded mb-3">
                  <h4>
                    {isAr ? "النتيجة:" : "Score:"} {techData.quiz.score} /{" "}
                    {techData.quiz.total}{" "}
                    {techData.quiz.passed ? (
                      <span className={`badge bg-success ${isAr ? "me-2" : "ms-2"}`}>
                        {isAr ? "ناجح" : "Passed"}
                      </span>
                    ) : (
                      <span className={`badge bg-danger ${isAr ? "me-2" : "ms-2"}`}>
                        {isAr ? "راسب" : "Failed"}
                      </span>
                    )}
                  </h4>
                </div>
                <h6>{isAr ? "تفاصيل الإجابات:" : "Answer Breakdown:"}</h6>
                {techData.quiz.answers?.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-2 my-2 border-start border-4 ${
                      ans.isCorrect
                        ? "border-success bg-light"
                        : "border-danger bg-light"
                    }`}
                  >
                    <p className="mb-1">
                      <strong>
                        {isAr ? "س:" : "Q:"} {ans.question}
                      </strong>
                    </p>
                    <small className="d-block">
                      {isAr ? "الإجابة المختارة:" : "Selected:"} {ans.selected}
                    </small>
                    {!ans.isCorrect && (
                      <small className="text-danger d-block">
                        {isAr ? "الإجابة الصحيحة:" : "Correct:"} {ans.correct}
                      </small>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p className="text-muted py-3">
                {isAr
                  ? "لم يقم الفني بتقديم الاختبار بعد."
                  : "Technician has not taken the quiz yet."}
              </p>
            )}
          </div>
        </div>

        {/* مستندات بطاقة الرقم القومي */}
        <div className="col-12">
          <div className="dashboard-section">
            <h5 className="mb-3">
              {isAr ? "مستندات الهوية (البطاقة الشخصية)" : "National ID Documents"}
            </h5>
            <div className="row g-3">
              <div className="col-md-6 text-center">
                <h6>{isAr ? "وجه البطاقة" : "Front Image"}</h6>
                {techData.idFront ? (
                  <img
                    src={techData.idFront}
                    alt="ID Front"
                    className="img-fluid rounded border shadow-sm"
                  />
                ) : (
                  <div className="p-4 bg-light text-muted border rounded">
                    {isAr ? "لا توجد صورة متوفرة" : "No image available"}
                  </div>
                )}
              </div>
              <div className="col-md-6 text-center">
                <h6>{isAr ? "ظهر البطاقة" : "Back Image"}</h6>
                {techData.idBack ? (
                  <img
                    src={techData.idBack}
                    alt="ID Back"
                    className="img-fluid rounded border shadow-sm"
                  />
                ) : (
                  <div className="p-4 bg-light text-muted border rounded">
                    {isAr ? "لا توجد صورة متوفرة" : "No image available"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مودال سبب الرفض */}
      {showRejectModal && (
        <div
          className="modal d-block tab-index-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isAr ? "سبب رفض الطلب" : "Rejection Reason"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder={
                    isAr
                      ? "ادخلي سبب الرفض لإرساله إلى الفني..."
                      : "Enter the reason for rejection to send to the technician..."
                  }
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleRejectSubmit}
                >
                  {isAr ? "تأكيد الرفض" : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicianDetails;