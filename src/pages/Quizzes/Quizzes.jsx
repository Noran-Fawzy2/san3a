import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  FaClipboardQuestion,
  FaPlus,
  FaCircleCheck,
  FaEye,
} from "react-icons/fa6";
import api from "../../services/api";
import Loading from "../../components/Loading";

function Quizzes() {
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get("/admin/quizzes");
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={isAr ? "جاري تحميل الاختبارات..." : "Loading quizzes..."}
      />
    );
  }

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{isAr ? "اختبارات التقييم" : "Assessment Quizzes"}</h2>
          <p className="text-muted">
            {isAr
              ? "إدارة الأسئلة واختبارات القبول الخاصة بكل مهنة للفنيين"
              : "Manage entry tests and qualification questions for technicians by craft"}
          </p>
        </div>

        <button className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus />
          {isAr ? "إنشاء كويز جديد" : "Create New Quiz"}
        </button>
      </div>

      <div className="dashboard-section">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>{isAr ? "اسم الاختبار / المهنة" : "Quiz / Craft Name"}</th>
                <th>{isAr ? "عدد الأسئلة" : "Total Questions"}</th>
                <th>{isAr ? "درجة النجاح" : "Passing Score"}</th>
                <th>{isAr ? "الحالة" : "Status"}</th>
                <th>{isAr ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>

            <tbody>
              {quizzes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    {isAr
                      ? "لا توجد اختبارات مضافة حاليًا"
                      : "No quizzes available at the moment"}
                  </td>
                </tr>
              ) : (
                quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FaClipboardQuestion className="text-primary fs-5" />
                        <strong>
                          {quiz.craft?.name || quiz.title || quiz.craft}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {quiz.totalQuestions}{" "}
                      {isAr ? "أسئلة" : "Questions"}
                    </td>

                    <td>
                      {quiz.passingScore}{" "}
                      {isAr ? "إجابات صحيحة" : "Correct Answers"}
                    </td>

                    <td>
                      <span className="status active">
                        <FaCircleCheck className={isAr ? "ms-1" : "me-1"} />
                        {quiz.status === "ACTIVE"
                          ? isAr
                            ? "نشط"
                            : "Active"
                          : isAr
                          ? "غير نشط"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/quizzes/${quiz.id}`}
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                      >
                        <FaEye />
                        {isAr ? "تعديل الأسئلة" : "Edit Questions"}
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

export default Quizzes;