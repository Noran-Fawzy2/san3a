import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  return (
    <div>
      <button
        onClick={() => navigate("/quizzes")}
        className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
      >
        {isAr ? <FaArrowRight /> : <FaArrowLeft />}
        <span>{isAr ? "العودة للاختبارات" : "Back to Quizzes"}</span>
      </button>

      <div className="dashboard-section">
        <h4>
          {isAr ? "تفاصيل أسئلة الاختبار:" : "Quiz Questions Details:"} {id || "q1"}
        </h4>
        <p className="text-muted">
          {isAr
            ? "إضافة وتعديل الأسئلة والاختيارات وتحديد الإجابات الصحيحة."
            : "Add and edit questions, options, and set correct answers."}
        </p>
      </div>
    </div>
  );
}

export default QuizDetails;