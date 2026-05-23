import { useEffect, useState } from "react";
import "../../css/myBooking.css";
import { bookingService } from "../../services/bookingService";
import Loading from "../../components/Loading";

import Header from "../../components/Header"
import Footer from "../../components/Footer"

// ── Pagination ──
function MyBookingPagination({
  currentPage,
  totalPage,
  totalItem,
  pageSize,
  onPageChange,
  nameList,
}) {
  const from = totalItem === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItem);

  const pages = [];
  if (totalPage <= 7) {
    for (let i = 1; i <= totalPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPage - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPage - 2) pages.push("...");
    pages.push(totalPage);
  }

  if (totalPage <= 1) return null;

  return (
    <div className="mb-pagination">
      <p className="mb-pagination__info">
        Hiển thị{" "}
        <strong>
          {from}–{to}
        </strong>{" "}
        trong <strong>{totalItem}</strong> {nameList}
      </p>
      <div className="mb-pagination__pages">
        <button
          className="st-page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dot-${idx}`} className="st-page-dots">
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`st-page-btn${
                currentPage === p ? " st-page-btn--active" : ""
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          className="st-page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPage}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

// ── Helpers ──
function getDate(str) {
  if (!str) return "";
  const [y, m, d] = str.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}
function getDayOfWeek(str) {
  if (!str) return "";
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[new Date(str).getDay()];
}
function getTime(str) {
  if (!str) return "";
  const parts = str.split("T")[1].split(":");
  return `${parts[0]}:${parts[1]}`;
}
function formatPrice(price) {
  return price?.toLocaleString("vi-VN") + " đ";
}
function getCountdown(startTimeStr) {
  const diff = new Date(startTimeStr) - new Date();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const parts = [];
  if (days > 0) parts.push(`${days}n`);
  if (hours > 0) parts.push(`${hours}g`);
  parts.push(`${mins}p`);
  return parts.join(" ");
}
function isUpcoming(startTimeStr) {
  return new Date(startTimeStr) > new Date();
}

// ── Ticket Modal ──
function TicketModal({ item, onClose }) {
  const upcoming = isUpcoming(item.showTime.startTime);

  return (
    <div className="mb-modal-overlay" onClick={onClose}>
      <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mb-modal__header">
          <div className="mb-modal__header-left">
            <i className="fas fa-ticket-alt mb-modal__header-icon"></i>
            <div>
              <div className="mb-modal__header-title">Chi Tiết Vé</div>
              <div className="mb-modal__header-id">
                #{item.bookingID.toString().slice(0, 8).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="mb-modal__header-right">
            {upcoming ? (
              <span className="mb-status mb-status--upcoming">
                <i className="fas fa-circle me-1"></i>Sắp chiếu
              </span>
            ) : (
              <span className="mb-status mb-status--watched">
                <i className="fas fa-check-circle me-1"></i>Đã xem
              </span>
            )}
            <button className="mb-modal__close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="mb-modal__body">
          {/* Movie Info */}
          <div className="mb-modal__movie-section">
            <img
              src={item.showTime.movie.posterUrl}
              className="mb-modal__poster"
              alt={item.showTime.movie.title}
            />
            <div className="mb-modal__movie-info">
              <div className="mb-modal__movie-title">
                {item.showTime.movie.title}
              </div>
              <div className="mb-modal__info-grid">
                <div className="mb-modal__info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <div className="mb-modal__info-label">Rạp chiếu</div>
                    <div className="mb-modal__info-value">
                      {item.showTime.room.cinema.name}
                    </div>
                    {item.showTime.room.cinema.address && (
                      <div className="mb-modal__info-address">
                        {item.showTime.room.cinema.address}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-modal__info-item">
                  <i className="fas fa-door-open"></i>
                  <div>
                    <div className="mb-modal__info-label">Phòng</div>
                    <div className="mb-modal__info-value">
                      {item.showTime.room.name}
                    </div>
                  </div>
                </div>
                <div className="mb-modal__info-item">
                  <i className="fas fa-calendar-alt"></i>
                  <div>
                    <div className="mb-modal__info-label">Ngày chiếu</div>
                    <div className="mb-modal__info-value">
                      {getDayOfWeek(item.showTime.startTime)},{" "}
                      {getDate(item.showTime.startTime)}
                    </div>
                  </div>
                </div>
                <div className="mb-modal__info-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <div className="mb-modal__info-label">Giờ chiếu</div>
                    <div className="mb-modal__info-value mb-modal__info-value--gold">
                      {getTime(item.showTime.startTime)} –{" "}
                      {getTime(item.showTime.endTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider dashed */}
          <div className="mb-modal__divider">
            <div className="mb-modal__divider-circle mb-modal__divider-circle--left"></div>
            <div className="mb-modal__divider-line"></div>
            <div className="mb-modal__divider-circle mb-modal__divider-circle--right"></div>
          </div>

          {/* Seats Section */}
          <div className="mb-modal__section">
            <div className="mb-modal__section-title">
              <i className="fas fa-chair me-2"></i>Thông Tin Ghế Ngồi
            </div>
            <div className="mb-modal__seats-grid">
              {item.bookingSeats.map((s) => (
                <div key={s.bookingSeatID} className="mb-modal__seat-card">
                  <div className="mb-modal__seat-number">
                    {s.seat.seatNumber}
                  </div>
                  <div className="mb-modal__seat-type">
                    {s.seat.seatType.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="mb-modal__section">
            <div className="mb-modal__section-title">
              <i className="fas fa-credit-card me-2"></i>Thông Tin Thanh Toán
            </div>
            <div className="mb-modal__payment-grid">
              <div className="mb-modal__payment-row">
                <span className="mb-modal__payment-label">Mã thanh toán</span>
                <span className="mb-modal__payment-value">
                  #
                  {item.payment?.paymentID
                    ?.toString()
                    .slice(0, 8)
                    .toUpperCase() || "—"}
                </span>
              </div>
              <div className="mb-modal__payment-row">
                <span className="mb-modal__payment-label">Phương thức</span>
                <span className="mb-modal__payment-value">
                  <span className="mb-modal__payment-badge">
                    <i className="fas fa-wallet me-1"></i>STRIPE
                  </span>
                </span>
              </div>
              <div className="mb-modal__payment-row">
                <span className="mb-modal__payment-label">Số ghế</span>
                <span className="mb-modal__payment-value">
                  {item.bookingSeats.length} ghế
                </span>
              </div>
              <div className="mb-modal__payment-row mb-modal__payment-row--total">
                <span className="mb-modal__payment-label">Tổng thanh toán</span>
                <span className="mb-modal__payment-total">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──
function MyBooking() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [listBooking, setListBooking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [overviewInfo, setOverviewInfo] = useState({
    totalItem: 0,
    totalPage: 1,
  });
  const [filterDate, setFilterDate] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [inputSearch, setInputSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const userID = JSON.parse(localStorage.getItem("user")).userId;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterDate]);
  useEffect(() => {
    fetchBooking();
  }, [currentPage, activeTab, filterDate, refresh]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const filter = {
        userID,
        date: filterDate || undefined,
        keyword: inputSearch || undefined,
      };
      const [list, info] = await Promise.all([
        bookingService.getListBooking(currentPage, pageSize, filter),
        bookingService.getPaginationInfo(pageSize, filter),
      ]);
      const filtered = list.filter((item) =>
        activeTab === "upcoming"
          ? isUpcoming(item.showTime.startTime)
          : !isUpcoming(item.showTime.startTime)
      );
      setListBooking(filtered);
      setOverviewInfo(info);
      setLoading(false);
    } catch (err) {
      alert(err.response?.data?.message || "Tải danh sách vé thất bại");
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilterDate("");
    setCurrentPage(1);
    setInputSearch("");
    setRefresh((r) => r + 1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setRefresh((r) => r + 1);
  };

  const renderCard = (item) => {
    const upcoming = isUpcoming(item.showTime.startTime);
    const countdown = upcoming ? getCountdown(item.showTime.startTime) : null;

    return (
      <div
        key={item.bookingID}
        className={`mb-card${!upcoming ? " mb-card--watched" : ""}`}
      >
        {/* Poster */}
        <div
          className={`mb-card__poster${
            !upcoming ? " mb-card__poster--dimmed" : ""
          }`}
        >
          <img
            src={item.showTime.movie.posterUrl}
            alt={item.showTime.movie.title}
          />
        </div>

        {/* Body */}
        <div className="mb-card__body">
          <div
            className={`mb-card__movie-title${
              !upcoming ? " mb-card__movie-title--muted" : ""
            }`}
          >
            {item.showTime.movie.title}
          </div>

          {/* Desktop meta rows - ẩn trên mobile */}
          <div className="mb-card__meta-row mb-card__meta-row--desktop">
            <span className="mb-card__meta-item">
              <i className="fas fa-map-marker-alt" style={{ color: "#ef4444" }}></i>
              {item.showTime.room.cinema.name}
            </span>
            <span className="mb-card__meta-item">
              <i className="fas fa-door-open"></i>
              {item.showTime.room.name}
            </span>
          </div>

          <div className="mb-card__meta-row mb-card__meta-row--desktop">
            <span className="mb-card__meta-item">
              <i className="fas fa-calendar"></i>
              {getDayOfWeek(item.showTime.startTime)},{" "}
              {getDate(item.showTime.startTime)}
            </span>
            <span className="mb-card__meta-item mb-card__meta-item--gold">
              <i className="fas fa-clock"></i>
              {getTime(item.showTime.startTime)} –{" "}
              {getTime(item.showTime.endTime)}
            </span>
          </div>

          {/* Mobile compact info - chỉ hiện trên mobile */}
          <div className="mb-card__meta-compact">
            <span className="mb-card__meta-item mb-card__meta-item--gold">
              <i className="fas fa-clock"></i>
              {getTime(item.showTime.startTime)} · {getDate(item.showTime.startTime)}
            </span>
            <span className="mb-card__meta-item">
              <i className="fas fa-map-marker-alt" style={{ color: "#ef4444" }}></i>
              {item.showTime.room.cinema.name}
            </span>
          </div>

          {/* Seats - ẩn trên mobile nhỏ */}
          <div className="mb-card__seats mb-card__seats--responsive">
            <span className="mb-card__seats-label">Ghế:</span>
            {item.bookingSeats.map((s) => (
              <span key={s.bookingSeatID} className="mb-seat-badge">
                {s.seat.seatNumber}
              </span>
            ))}
          </div>

          <div className="mb-card__price-row">
            <span className="mb-card__price-label">Tổng</span>
            <span className="mb-card__price-value">
              {formatPrice(item.totalPrice)}
            </span>
          </div>
        </div>

        {/* Side */}
        <div className="mb-card__side">
          {/* Status badge - ẩn trên mobile nhỏ (đã có tab) */}
          <span className={`mb-status mb-card__status-badge ${upcoming ? "mb-status--upcoming" : "mb-status--watched"}`}>
            <i className={`fas ${upcoming ? "fa-circle" : "fa-check-circle"} me-1`}></i>
            {upcoming ? "Sắp chiếu" : "Đã xem"}
          </span>

          {upcoming && countdown && (
            <div className="mb-card__countdown">
              <div className="mb-countdown-label">Còn</div>
              <div className="mb-countdown-time">{countdown}</div>
            </div>
          )}

          <div className="mb-card__actions">
            <button
              className="mb-btn mb-btn--primary"
              onClick={() => setSelectedBooking(item)}
            >
              <i className="fas fa-qrcode me-1"></i>
              <span className="mb-btn__text">Xem vé</span>
            </button>
            {!upcoming && (
              <button className="mb-btn mb-btn--ghost">
                <i className="fas fa-star me-1"></i>
                <span className="mb-btn__text">Đánh giá</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />

      <div className="bk-wrapper">
        <div className="container-fluid">
          {/* PAGE HEADER */}
          <div className="mb-page-header">
            <div className="mb-page-header__icon">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <div>
              <h2 className="mb-page-header__title">Vé Của Tôi</h2>
              <p className="mb-page-header__sub">
                Lịch sử đặt vé &amp; các vé sắp chiếu
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="mb-search-section">
            <div className="st-search-bar">
              <i className="fas fa-search st-search-bar__icon"></i>
              <input
                type="text"
                className="st-search-bar__input"
                placeholder="Tìm kiếm theo tên phim..."
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="st-search-bar__btn" onClick={handleSearch}>
                <i className="fas fa-search me-2"></i>
                <span className="st-search-bar__btn-text">Tìm Kiếm</span>
              </button>
            </div>
          </div>

          {/* FILTER PANEL */}
          <div className="st-filter-panel mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <label className="st-filter-sublabel">
                  <i className="fas fa-calendar-alt me-1" style={{ color: "#f5a623" }}></i>
                  Ngày chiếu
                </label>
                <div className="st-date-picker-wrap">
                  <i className="fas fa-calendar-day st-date-picker-wrap__icon"></i>
                  <input
                    type="date"
                    className="st-date-input"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
                <p className="st-filter-applied mb-0">
                  <i className="fas fa-filter me-1"></i>
                  Đang áp dụng:&nbsp;
                  <span className="st-filter-applied__num">
                    {(filterDate ? 1 : 0) + (inputSearch ? 1 : 0)}
                  </span>{" "}
                  bộ lọc
                </p>
                <button className="st-filter-reset-btn" onClick={clearFilter}>
                  <i className="fas fa-undo me-1"></i>Đặt lại
                </button>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="st-status-tabs mb-4">
            <button
              className={`st-status-tab${activeTab === "upcoming" ? " st-status-tab--active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              <span className="st-dot st-dot--showtime"></span>
              Sắp chiếu
            </button>
            <button
              className={`st-status-tab${activeTab === "watched" ? " st-status-tab--active" : ""}`}
              onClick={() => setActiveTab("watched")}
            >
              <span className="st-dot st-dot--ended"></span>
              Đã xem
            </button>
          </div>

          {/* LIST */}
          <div className="mb-list">
            {listBooking.length === 0 && !loading ? (
              <div className="mb-empty">
                <div className="mb-empty__icon">
                  <i className={`fas ${activeTab === "upcoming" ? "fa-ticket-alt" : "fa-film"}`}></i>
                </div>
                <p className="mb-empty__title">
                  {activeTab === "upcoming"
                    ? "Bạn chưa có vé nào sắp chiếu"
                    : "Chưa có lịch sử xem phim"}
                </p>
                <p className="mb-empty__sub">
                  {activeTab === "upcoming"
                    ? "Hãy đặt vé ngay để không bỏ lỡ suất chiếu yêu thích!"
                    : "Các vé đã xem sẽ xuất hiện ở đây."}
                </p>
              </div>
            ) : (
              listBooking.map(renderCard)
            )}
          </div>

          {/* PAGINATION */}
          <MyBookingPagination
            currentPage={currentPage}
            totalPage={overviewInfo.totalPage}
            totalItem={overviewInfo.totalItem}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            nameList={activeTab === "upcoming" ? "vé sắp chiếu" : "vé đã xem"}
          />
        </div>
      </div>

      <Footer />

      {selectedBooking && (
        <TicketModal
          item={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {loading && <Loading />}
    </>
  );
}

export default MyBooking;