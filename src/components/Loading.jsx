function Loading({ lang = "ar", text }) {
const defaultText = lang === "ar" ? "جاري التحميل..." : "Loading...";

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-primary mb-3"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">
          {lang === "ar" ? "جاري التحميل..." : "Loading..."}
        </span>
      </div>
      <p className="text-muted fw-semibold">{text || defaultText}</p>
    </div>
  );
}

export default Loading;