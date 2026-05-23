function Pagination({
  currentPage,
  totalPage,
  totalItem,
  pageSize,
  onPageChange,
  nameList
}) {
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItem);

  return (
    <div className="dashboard-content__management-movie-pagination">
      <p className="dashboard-content__management-movie-pagination-info">
        Hiển thị{" "}
        <strong>
          {from} – {to}
        </strong>{" "}
        trong tổng <strong>{totalItem}</strong> {nameList}
      </p>

      <div className="dashboard-content__management-movie-pagination-pages">
        {/* Prev */}
        <button
          className="dashboard-content__management-movie-page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>

        {/* Page 1 */}
        <button
          className={`dashboard-content__management-movie-page-btn ${
            currentPage === 1
              ? "dashboard-content__management-movie-page-btn--active"
              : ""
          }`}
          onClick={() => onPageChange(1)}
        >
          1
        </button>

        {/* Ellipsis đầu */}
        {currentPage > 3 && (
          <button
            className="dashboard-content__management-movie-page-btn"
            disabled
          >
            ...
          </button>
        )}

        {/* Page - 1 */}
        {currentPage > 2 && currentPage < totalPage && (
          <button
            className="dashboard-content__management-movie-page-btn"
            onClick={() => onPageChange(currentPage - 1)}
          >
            {currentPage - 1}
          </button>
        )}

        {/* Trang hiện tại */}
        {currentPage !== 1 && currentPage !== totalPage && (
          <button className="dashboard-content__management-movie-page-btn dashboard-content__management-movie-page-btn--active">
            {currentPage}
          </button>
        )}

        {/* Page + 1 */}
        {currentPage < totalPage - 1 && (
          <button
            className="dashboard-content__management-movie-page-btn"
            onClick={() => onPageChange(currentPage + 1)}
          >
            {currentPage + 1}
          </button>
        )}

        {/* Ellipsis cuối */}
        {currentPage < totalPage - 2 && (
          <button
            className="dashboard-content__management-movie-page-btn"
            disabled
          >
            ...
          </button>
        )}

        {/* Trang cuối */}
        {totalPage > 1 && (
          <button
            className={`dashboard-content__management-movie-page-btn ${
              currentPage === totalPage
                ? "dashboard-content__management-movie-page-btn--active"
                : ""
            }`}
            onClick={() => onPageChange(totalPage)}
          >
            {totalPage}
          </button>
        )}

        {/* Next */}
        <button
          className="dashboard-content__management-movie-page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPage}
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default Pagination;
