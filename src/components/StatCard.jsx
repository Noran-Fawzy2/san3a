function StatCard({ title, value, icon, className }) {
  return (
    <div className="col-xl-4 col-md-6 mb-4">
      <div className="stat-card">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>

        <div className={`stat-icon ${className}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;