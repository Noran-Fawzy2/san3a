import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPaperPlane, FaClock } from "react-icons/fa6";
import api from "../../services/api";
import Loading from "../../components/Loading";

function Support() {
  const { lang } = useOutletContext();
  const isAr = lang === "ar";

  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/admin/support/tickets");
      setTickets(response.data);
      if (response.data.length > 0) {
        setActiveTicket(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    try {
      const response = await api.post(
        `/admin/support/tickets/${activeTicket.id}/reply`,
        { message: replyText }
      );

      const newMsg = response.data || { sender: "Admin", text: replyText };

      const updatedTicket = {
        ...activeTicket,
        messages: [...(activeTicket.messages || []), newMsg],
      };

      setActiveTicket(updatedTicket);
      setTickets(
        tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      setReplyText("");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  if (loading) {
    return (
      <Loading
        lang={lang}
        text={
          isAr
            ? "جاري تحميل تذاكر الدعم الفني..."
            : "Loading support tickets..."
        }
      />
    );
  }

  return (
    <div>
      <div className="page-header mb-4">
        <h2>{isAr ? "الدعم الفني والشكاوى" : "Support & Tickets"}</h2>
        <p className="text-muted">
          {isAr
            ? "متابعة تذاكر الشكاوى والاستفسارات من العملاء والفنيين والرد عليها"
            : "Manage and respond to support tickets and inquiries from customers and technicians"}
        </p>
      </div>

      <div className="row g-4">
        {/* قائمة التذاكر */}
        <div className="col-md-5">
          <div className="dashboard-section p-3">
            <h5 className="mb-3">{isAr ? "قائمة التذاكر" : "Tickets List"}</h5>
            <div className="list-group list-group-flush">
              {tickets.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  {isAr ? "لا توجد تذاكر دعم حاليًا" : "No support tickets found"}
                </div>
              ) : (
                tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`list-group-item list-group-item-action border rounded mb-2 p-3 ${
                      activeTicket?.id === t.id ? "border-primary bg-light" : ""
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold">{t.id}</span>
                      <span
                        className={`badge ${
                          t.status === "OPEN"
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {t.status === "OPEN"
                          ? isAr
                            ? "مفتوحة"
                            : "Open"
                          : isAr
                          ? "مغلقة"
                          : "Resolved"}
                      </span>
                    </div>
                    <h6 className="mb-1 text-truncate">{t.subject}</h6>
                    <small className="text-muted d-block">
                      {t.user?.name || t.user}
                    </small>
                    <small className="text-muted">
                      <FaClock className={isAr ? "ms-1" : "me-1"} />
                      {t.created
                        ? t.created
                        : new Date(t.createdAt).toLocaleDateString(
                            isAr ? "ar-EG" : "en-US"
                          )}
                    </small>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* عرض المحادثة والرد */}
        <div className="col-md-7">
          <div className="dashboard-section h-100 d-flex flex-column justify-content-between">
            {activeTicket ? (
              <>
                <div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div>
                      <h5 className="m-0">{activeTicket.subject}</h5>
                      <small className="text-muted">
                        {isAr ? "صاحب التذكرة:" : "Ticket Owner:"}{" "}
                        {activeTicket.user?.name || activeTicket.user}
                      </small>
                    </div>
                    <span className="badge bg-danger">
                      {activeTicket.priority === "HIGH"
                        ? isAr
                          ? "عالية"
                          : "High"
                        : activeTicket.priority === "MEDIUM"
                        ? isAr
                          ? "متوسطة"
                          : "Medium"
                        : isAr
                        ? "منخفضة"
                        : "Low"}
                    </span>
                  </div>

                  {/* الشات */}
                  <div
                    className="chat-thread mb-3"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    {activeTicket.messages?.map((msg, idx) => {
                      const isAdmin =
                        msg.sender === "Admin" || msg.isAdminReply;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded mb-2 ${
                            isAdmin
                              ? "bg-primary text-white ms-auto"
                              : "bg-light border me-auto"
                          }`}
                          style={{ maxWidth: "80%" }}
                        >
                          <strong>
                            {isAdmin
                              ? isAr
                                ? "الأدمن"
                                : "Admin"
                              : msg.sender}
                          </strong>
                          <p className="mb-0 mt-1">{msg.text || msg.message}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* إدخال الرد */}
                <form onSubmit={handleSendReply} className="border-top pt-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={
                        isAr ? "اكتبي الرد هنا..." : "Type your reply here..."
                      }
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary d-flex align-items-center gap-2"
                    >
                      <FaPaperPlane />
                      <span>{isAr ? "إرسال الرد" : "Send Reply"}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-5 text-muted my-auto">
                {isAr
                  ? "اختر تذكرة من القائمة لمشاهدة التفاصيل"
                  : "Select a ticket from the list to view details"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;