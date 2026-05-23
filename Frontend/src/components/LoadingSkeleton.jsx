import "../css/loadingSkeleton.css";

function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="container movie-skeleton-list">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="movie-skeleton-card">
          <div className="sk movie-skeleton-poster" />
          <div className="sk movie-skeleton-title" />
          <div className="sk movie-skeleton-year" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;