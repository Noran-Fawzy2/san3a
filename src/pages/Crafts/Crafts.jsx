import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import api from "../../services/api";
import Loading from "../../components/Loading";

function Crafts() {
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCraft, setNewCraft] = useState({ name: "", description: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCrafts();
  }, []);

  const fetchCrafts = async () => {
    try {
      const res = await api.get("/crafts");
      setCrafts(res.data);
    } catch (error) {
      console.error("Error fetching crafts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCraft = async (e) => {
    e.preventDefault();
    if (!newCraft.name) return;

    try {
      const res = await api.post("/crafts", newCraft);
      setCrafts([...crafts, res.data]);
      setNewCraft({ name: "", description: "" });
      setShowModal(false);
    } catch (error) {
      alert(
        isAr
          ? "حدث خطأ أثناء إضافة المهنة"
          : "An error occurred while adding the craft"
      );
    }
  };

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={isAr ? "جاري جلب المهن..." : "Fetching crafts..."}
      />
    );
  }

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{isAr ? "المهن والتخصصات" : "Crafts & Specialties"}</h2>
          <p className="text-muted">
            {isAr
              ? "إدارة وتنشيط المهن والخدمات المتاحة على المنصة"
              : "Manage and activate crafts and services available on the platform"}
          </p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> {isAr ? "إضافة مهنة جديدة" : "Add New Craft"}
        </button>
      </div>

      <div className="row g-4">
        {crafts.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            {isAr
              ? 'لا توجد مهن مضافة بعد. اضغطي على "إضافة مهنة جديدة" للبدء.'
              : 'No crafts added yet. Click "Add New Craft" to start.'}
          </div>
        ) : (
          crafts.map((craft) => (
            <div className="col-md-4" key={craft.id}>
              <div className="dashboard-section h-100 d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold">{craft.name}</h5>
                  <p className="text-muted small">{craft.description}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <span className="badge bg-light text-dark border">
                    {craft.isActive
                      ? isAr
                        ? "نشطة"
                        : "Active"
                      : isAr
                      ? "غير نشطة"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleAddCraft}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isAr ? "إضافة مهنة جديدة" : "Add New Craft"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      {isAr ? "اسم المهنة" : "Craft Name"}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newCraft.name}
                      onChange={(e) =>
                        setNewCraft({ ...newCraft, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      {isAr ? "الوصف" : "Description"}
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newCraft.description}
                      onChange={(e) =>
                        setNewCraft({
                          ...newCraft,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isAr ? "حفظ المهنة" : "Save Craft"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Crafts;