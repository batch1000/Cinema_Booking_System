import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";

import "../../css/booking.css";

import { movieService } from "../../services/movieService";
import { showTimeService } from "../../services/showTimeService";
import { seatTypeService } from "../../services/seatTypeService";

import { seatHubService } from "../../services/hub/seatHubService";
import { seatHoldingService } from "../../services/seatHoldingService";
import { bookingService } from "../../services/bookingService";

import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function OrderSummary({
  movie,
  listSeatHolding,
  selectedCinema,
  selectedShowTime,
  bookingInfo,
  listBookedSeat,
}) {
  const history = useHistory();

  const [seatCountdowns, setSeatCountdowns] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = {};
      listSeatHolding.forEach((sh) => {
        const expire = new Date(sh.expireTime);
        const secondsLeft = Math.max(0, Math.floor((expire - now) / 1000));
        updated[sh.seatID] = secondsLeft;
      });
      setSeatCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [listSeatHolding]);

  const [draftSecondsLeft, setDraftSecondsLeft] = useState(null);

  useEffect(() => {
    if (!bookingInfo?.expireTime) return;

    const interval = setInterval(() => {
      const left = Math.max(
        0,
        Math.floor((new Date(bookingInfo.expireTime) - new Date()) / 1000)
      );
      setDraftSecondsLeft(left);
    }, 1000);

    return () => clearInterval(interval);
  }, [bookingInfo]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  const formatDateVN = (isoString) => {
    const d = getDateParts(isoString);
    if (!d) return "Chưa chọn";

    const day = String(d.day).padStart(2, "0");
    const month = String(d.month).padStart(2, "0");

    return `${d.dayOfWeek}, ${day}/${month}/${d.year}`;
  };

  const formatTimeRange = (start, end) => {
    if (!start || !end) return "Chưa chọn";

    const format = (t) =>
      new Date(t).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

    return `${format(start)} - ${format(end)}`;
  };

  const formatCountdown = (seconds) => {
    if (seconds == null) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const getDateParts = (isoString) => {
    if (!isoString) return false;

    const d = new Date(isoString);

    const mapDay = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    return {
      dayOfWeek: mapDay[d.getDay()],
      day: String(d.getDate()).padStart(2, "0"),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    };
  };

  const getUserId = () => {
    return JSON.parse(localStorage.getItem("user")).userId;
  };

  const handleConfirmTicket = async (selectedListSeat) => {
    if (window.confirm("Bạn muốn đặt suất chiếu này?")) {
      try {
        setLoading(true);
        const bookingID = await bookingService.createBookingDraft({
          userID: getUserId(),
          showTimeID: selectedShowTime.showTimeID,
          listSelectSeatID: selectedListSeat.map((s) => s.seatID),
        });
        if (bookingID) {
          history.push(`/payment/${bookingID}/${selectedShowTime.showTimeID}`);
          return;
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Đặt suất chiếu thất bại");
        setLoading(false);
      }
    }
  };

  const hasShowTime = Object.keys(selectedShowTime).length > 0;
  // Chưa chọn suất chiếu
  if (!hasShowTime) {
    return (
      <div className="col-lg-4 bk-summary-col">
        <div className="bk-summary-card">
          <h4 className="bk-summary-card__title">
            <i className="fas fa-receipt me-2"></i>Thông Tin Đặt Vé
          </h4>
          <div className="bk-order-empty">
            <div className="bk-order-empty__icon">
              <svg
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="8" y="14" width="40" height="30" rx="6" fill="rgba(245,166,35,0.12)" stroke="#f5a623" strokeWidth="1.6" />
                <line x1="8" y1="24" x2="48" y2="24" stroke="#f5a623" strokeWidth="1.2" strokeOpacity="0.5" />
                <rect x="13" y="29" width="8" height="6" rx="2" fill="rgba(245,166,35,0.3)" stroke="#f5a623" strokeWidth="1" />
                <rect x="24" y="29" width="8" height="6" rx="2" fill="rgba(245,166,35,0.3)" stroke="#f5a623" strokeWidth="1" />
                <rect x="35" y="29" width="8" height="6" rx="2" fill="rgba(245,166,35,0.15)" stroke="rgba(245,166,35,0.4)" strokeWidth="1" />
                <line x1="20" y1="8" x2="20" y2="18" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" />
                <line x1="36" y1="8" x2="36" y2="18" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p>Chưa chọn suất chiếu</p>
            <span>Vui lòng chọn rạp & suất chiếu bên trái</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedListSeat = listSeatHolding
    .filter((sh) => sh.userID === getUserId())
    .map((sh) => {
      var seat = selectedShowTime.room.listSeat.find(
        (s) => s.seatID === sh.seatID
      );
      if (seat) {
        return {
          ...seat,
          expireTime: sh.expireTime,
        };
      }
      return null;
    });

  const hasSeats = selectedListSeat.length > 0;

  const renderListSeatBooked = () => {
    const listMySeatID = listBookedSeat.filter(
      (bs) => bs.userID === getUserId()
    );

    const listMySeat = listMySeatID.map((mySeat) => {
      const seat = selectedShowTime.room.listSeat.find(
        (seat) => seat.seatID === mySeat.seatID
      );
      return seat;
    });

    if (listMySeatID.length > 0) {
      return (
        <>
          <div className="bk-booked-block mt-2">
            <div className="bk-booked-block__label">
              <i className="fas fa-check-circle"></i>Vé đã thanh toán
            </div>
            <div className="bk-booked-tags">
              {listMySeat.map((item) => (
                <span key={item.seatID} className="bk-seat-badge-purple">
                  {item.seatNumber}
                </span>
              ))}
            </div>
            <table className="bk-ticket-table">
              <thead>
                <tr>
                  <th>Ghế</th>
                  <th>Loại</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                {listMySeat.map((item) => (
                  <tr key={item.seatID}>
                    <td>{item.seatNumber}</td>
                    <td>{item.seatType.name}</td>
                    <td>
                      {(
                        item.seatType.priceMultiplier * selectedShowTime.price
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bk-booked-total">
              <span className="bk-booked-total__label">Đã thanh toán</span>
              <span className="bk-booked-total__value">
                {listMySeat
                  .reduce(
                    (sum, item) =>
                      sum +
                      item.seatType.priceMultiplier * selectedShowTime.price,
                    0
                  )
                  .toLocaleString("vi-VN")}{" "}
                đ
              </span>
            </div>
          </div>
        </>
      );
    }
  };

  // Đã chọn suất nhưng chưa chọn ghế
  if (!hasSeats) {
    return (
      <div className="col-lg-4 bk-summary-col">
        <div className="bk-summary-card">
          <h4 className="bk-summary-card__title">
            <i className="fas fa-receipt me-2"></i>Thông Tin Đặt Vé
          </h4>

          <div className="bk-summary-row">
            <span className="bk-summary-label">
              <i className="fas fa-film me-2"></i>Phim
            </span>
            <span className="bk-summary-value">{movie.title}</span>
          </div>

          <div className="bk-summary-row">
            <span className="bk-summary-label">
              <i className="fas fa-map-marker-alt me-2"></i>Rạp
            </span>
            <span className="bk-summary-value">{selectedCinema.name}</span>
          </div>

          <div className="bk-summary-row">
            <span className="bk-summary-label">
              <i className="fas fa-calendar me-2"></i>Ngày
            </span>
            <span className="bk-summary-value">
              {formatDateVN(selectedShowTime.startTime)}
            </span>
          </div>

          <div className="bk-summary-row">
            <span className="bk-summary-label">
              <i className="fas fa-clock me-2"></i>Suất chiếu
            </span>
            <span className="bk-summary-value bk-summary-value--gold">
              {formatTimeRange(
                selectedShowTime.startTime,
                selectedShowTime.endTime
              )}
            </span>
          </div>

          {renderListSeatBooked()}

          <div className="bk-summary-divider" />

          <div className="bk-order-empty bk-order-empty--sm">
            <div className="bk-order-empty__icon">
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 6px rgba(245,166,35,0.6))" }}>
                <rect x="12" y="20" width="32" height="18" rx="5" fill="rgba(245,166,35,0.25)" stroke="#f5a623" strokeWidth="1.8" />
                <rect x="16" y="11" width="24" height="12" rx="4" fill="rgba(245,166,35,0.18)" stroke="rgba(245,166,35,0.6)" strokeWidth="1.5" />
                <rect x="8" y="22" width="7" height="12" rx="3" fill="rgba(245,166,35,0.15)" stroke="rgba(245,166,35,0.5)" strokeWidth="1.5" />
                <rect x="41" y="22" width="7" height="12" rx="3" fill="rgba(245,166,35,0.15)" stroke="rgba(245,166,35,0.5)" strokeWidth="1.5" />
                <line x1="18" y1="38" x2="16" y2="46" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="38" y1="38" x2="40" y2="46" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" />
                <text x="28" y="32" textAnchor="middle" fill="#f5a623" fontSize="11" fontWeight="800" fontFamily="sans-serif">?</text>
              </svg>
            </div>
            {(() => {
              const listMySeatID = listBookedSeat.filter(
                (bs) => bs.userID === getUserId()
              );

              if (listMySeatID.length == 0) {
                return (
                  <>
                    <p>Chưa chọn ghế</p>
                    <span>Chọn ghế ở sơ đồ bên trái để tiếp tục</span>
                  </>
                );
              }

              if (listMySeatID.length > 0) {
                return (
                  <>
                    <p>Ghế đã chọn</p>
                    <span>Bạn có thể chọn thêm ghế</span>
                  </>
                );
              }
            })()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="col-lg-4 bk-summary-col">
        <div className="bk-summary-card">
          <h4 className="bk-summary-card__title">
            <i className="fas fa-receipt me-2"></i>Thông Tin Đặt Vé
          </h4>

          <div className="bk-summary-row">
            <span className="bk-summary-label">
              <i className="fas fa-film me-2"></i>Phim
            </span>
            <span className="bk-summary-value">{movie.title}</span>
          </div>
          <div className="bk-summary-row">
            <span className="bk-summary-label">
              <i className="fas fa-map-marker-alt me-2"></i>Rạp
            </span>
            <span className="bk-summary-value">
              {selectedCinema.name || "Chưa chọn"}
            </span>
          </div>
          <div className="bk-summary-row">
            <span className="bk-summary-label">
              <i className="fas fa-calendar me-2"></i>Ngày
            </span>
            <span className="bk-summary-value">
              {formatDateVN(selectedShowTime.startTime)}
            </span>
          </div>
          <div className="bk-summary-row">
            <span className="bk-summary-label">
              <i className="fas fa-clock me-2"></i>Suất chiếu
            </span>
            <span className="bk-summary-value bk-summary-value--gold">
              {formatTimeRange(
                selectedShowTime.startTime,
                selectedShowTime.endTime
              )}
            </span>
          </div>

          <table className="bk-ticket-table">
            <thead>
              <tr>
                <th>Ghế</th>
                <th>Loại</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {selectedListSeat?.map((item) => {
                const seconds = seatCountdowns[item.seatID];
                const isUrgent = seconds != null && seconds <= 15;

                return (
                  <tr key={item.seatID}>
                    <td>
                      <span
                        className="bk-seat-badge dynamic-seat"
                        style={{ "--seat-color": item.seatType.color }}
                      >
                        {item.seatNumber}
                      </span>
                      <span
                        className={`bk-seat-timer ms-3 ${
                          isUrgent ? "bk-seat-timer--urgent" : ""
                        }`}
                      >
                        {formatCountdown(seconds)}
                      </span>
                    </td>
                    <td>{item.seatType.name}</td>
                    <td>
                      {formatPrice(
                        selectedShowTime.price * item.seatType.priceMultiplier
                      )}{" "}
                      đ
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="bk-summary-divider" />

          <div className="bk-summary-row bk-summary-row--total">
            <span>Tổng cộng</span>
            <span className="bk-summary-total">
              {formatPrice(
                selectedListSeat.reduce((sum, item) => {
                  return (
                    sum + item.seatType.priceMultiplier * selectedShowTime.price
                  );
                }, 0)
              )}{" "}
              đ
            </span>
          </div>

          <div className="bk-summary-divider" />

          {/* Mã giảm giá */}
          <div className="bk-coupon mb-3">
            <input
              type="text"
              className="bk-coupon__input"
              placeholder="Nhập mã giảm giá..."
            />
            <button className="bk-coupon__btn">Áp dụng</button>
          </div>

          {bookingInfo ? (
            <>
              <div className="bk-draft-warning mb-2">
                <i className="fas fa-exclamation-triangle me-1"></i>
                Bạn có đơn đặt chỗ chưa thanh toán — còn{" "}
                <strong>{formatCountdown(draftSecondsLeft)}</strong>
              </div>
              <button
                className="dm-btn dm-btn--warning w-100 bk-confirm-btn"
                onClick={() =>
                  history.push(
                    `/payment/${bookingInfo.bookingDraftID}/${selectedShowTime.showTimeID}`
                  )
                }
              >
                <i className="fas fa-credit-card me-2"></i>Tiếp Tục Thanh Toán
              </button>
            </>
          ) : (
            <button
              className="dm-btn dm-btn--primary w-100 bk-confirm-btn"
              onClick={() => handleConfirmTicket(selectedListSeat)}
            >
              <i className="fas fa-ticket-alt me-2"></i>Đặt Vé
            </button>
          )}

          <p className="bk-summary-note mt-3">
            <i className="fas fa-shield-alt me-1"></i>
            Thanh toán an toàn & bảo mật. Vé sẽ được gửi qua email sau khi xác
            nhận.
          </p>
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
}

function Order({ id, movie }) {
  const [listShowTime, setListShowTime] = useState([]);
  const [listDate, setListDate] = useState([]);
  const [filter, setFilter] = useState({
    date: "",
  });
  const [listSeatType, setListSeatType] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedCinema, setSelectedCinema] = useState({});
  const [selectedShowTime, setSelectedShowTime] = useState({});
  const [bookingInfo, setBookingInfo] = useState(null);

  const [listSeatHolding, setListSeatHolding] = useState([]);
  const [listBookedSeat, setListBookedSeat] = useState([]);

  // ── NEW: mobile summary drawer state ──
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [listDate, listSeatType] = await Promise.all([
          showTimeService.getListGroupByShowTimeByMovie(id),
          seatTypeService.getListSeatType(),
        ]);

        setListDate(listDate);
        if (listDate.length > 0) {
          setFilter({
            date: listDate[0].date,
          });
        }

        setListSeatType(listSeatType);

        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Load dữ liệu thất bại");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filter?.date) {
      fetchListShowTime();
    }
  }, [filter]);

  useEffect(() => {
    if (!Object.entries(selectedShowTime).length > 0) return;

    const showTimeID = selectedShowTime.showTimeID;
    seatHubService.joinGroupShowTime(showTimeID);

    fetchListSeatHolding(showTimeID);
    fetchBookingInfoDaft(showTimeID);
    fetchListBookedSeat(showTimeID);

    return () => {
      seatHubService.leaveGroupShowTime(showTimeID);
    };
  }, [selectedShowTime]);

  useEffect(() => {
    seatHubService.start();

    seatHubService.listenSeatHold((res) => {
      fetchListSeatHolding(res.showTimeID);
      fetchListBookedSeat(res.showTimeID);
    });
  }, []);

  const fetchBookingInfoDaft = async (showTimeID) => {
    const bookingInfoDraft = await bookingService.checkBookingDraftExist({
      showTimeID: showTimeID,
      userID: getUserId(),
    });

    if (bookingInfoDraft) {
      setBookingInfo(bookingInfoDraft);
    }
  };

  const fetchListSeatHolding = async (showTimeID) => {
    try {
      setLoading(true);

      const result = await seatHoldingService.getListSeatHolding(showTimeID);

      if (result) {
        setListSeatHolding(result);
      }
      setLoading(false);
    } catch (error) {
      alert(
        error.response?.data?.message || "Load danh sách ghế đang giữ thất bại"
      );
      setLoading(false);
    }
  };

  const fetchListBookedSeat = async (showTimeID) => {
    try {
      setLoading(true);

      const result = await bookingService.getListBookedSeat(showTimeID);

      if (result) {
        setListBookedSeat(result);
      }

      setLoading(false);
    } catch (error) {
      alert(
        error.response?.data?.message || "Load danh sách ghế đã đặt thất bại"
      );
      setLoading(false);
    }
  };

  const getUserId = () => {
    return JSON.parse(localStorage.getItem("user")).userId;
  };

  const fetchListShowTime = async () => {
    try {
      setLoading(true);

      const result = await showTimeService.getListShowTimeByMovie(id, filter);
      setListShowTime(result);

      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Load lịch chiếu thất bại");
      setLoading(false);
    }
  };

  const getDateParts = (isoString) => {
    if (!isoString) return false;

    const d = new Date(isoString);

    const mapDay = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    return {
      dayOfWeek: mapDay[d.getDay()],
      day: String(d.getDate()).padStart(2, "0"),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    };
  };

  const handleChooseDate = (date) => {
    setFilter({
      date: date,
    });
  };

  const handleChooseShowTime = (c, showTime) => {
    setSelectedShowTime(showTime);

    setSelectedCinema({
      cinemaID: c.cinema.cinemaID,
      name: c.cinema.name,
    });
  };

  const groupSeatByCol = (listSeat, col) => {
    if (listSeat) {
      let listGroup = [];
      let result = [];
      let count = 1;
      for (let i = 0; i < listSeat.length; i++) {
        listGroup.push(listSeat[i]);

        count += 1;
        if (count > col) {
          result.push(listGroup);
          listGroup = [];
          count = 1;
        }
      }

      return result;
    }

    return undefined;
  };

  const listGroupSeat = groupSeatByCol(
    selectedShowTime?.room?.listSeat,
    selectedShowTime?.room?.col
  );

  const handleSelectSeat = (seat) => {
    seatHubService.sendSeatHold({
      seatID: seat.seatID,
      showTimeID: selectedShowTime.showTimeID,
      userID: getUserId(),
    });
  };

  const renderStatusSeatClass = (seat) => {
    const seatHolding = listSeatHolding.find((sh) => sh.seatID === seat.seatID);
    if (seatHolding) {
      if (seatHolding.userID === getUserId()) {
        return "bk-seat--selected";
      }
      return "bk-seat--holding";
    }

    const bookedSeat = listBookedSeat.find((s) => s.seatID === seat.seatID);
    if (bookedSeat) {
      if (bookedSeat.userID === getUserId()) {
        return "bk-seat--my-booked";
      }
      return "bk-seat--taken";
    }

    return "";
  };

  const renderSeatMap = () => {
    if (!selectedShowTime?.room?.listSeat)
      return (
        <div className="bk-seat-empty">
          <div className="bk-seat-empty__icon">
            <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 6px rgba(245,166,35,0.6))" }}>
              <rect x="12" y="20" width="32" height="18" rx="5" fill="rgba(245,166,35,0.25)" stroke="#f5a623" strokeWidth="1.8" />
              <rect x="16" y="11" width="24" height="12" rx="4" fill="rgba(245,166,35,0.18)" stroke="rgba(245,166,35,0.6)" strokeWidth="1.5" />
              <rect x="8" y="22" width="7" height="12" rx="3" fill="rgba(245,166,35,0.15)" stroke="rgba(245,166,35,0.5)" strokeWidth="1.5" />
              <rect x="41" y="22" width="7" height="12" rx="3" fill="rgba(245,166,35,0.15)" stroke="rgba(245,166,35,0.5)" strokeWidth="1.5" />
              <line x1="18" y1="38" x2="16" y2="46" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="38" y1="38" x2="40" y2="46" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" />
              <text x="28" y="32" textAnchor="middle" fill="#f5a623" fontSize="11" fontWeight="800" fontFamily="sans-serif">?</text>
            </svg>
          </div>
          <p>Vui lòng chọn suất chiếu</p>
          <span>Sơ đồ ghế sẽ hiển thị tại đây</span>
        </div>
      );

    return (
      <>
        <div className="bk-legend mb-4">
          {listSeatType?.map((item) => (
            <div className="bk-legend-item" key={item.seatTypeID}>
              <div
                className="bk-seat dynamic-seat"
                style={{ "--seat-color": item.color }}
              />
              <span>{item.name}</span>
            </div>
          ))}

          <div className="bk-legend-item">
            <div className="bk-seat dynamic-seat bk-seat--selected" style={{ "--seat-color": "#a855f7" }} />
            <span>Bạn chọn</span>
          </div>

          <div className="bk-legend-item">
            <div className="bk-seat dynamic-seat bk-seat--holding" style={{ "--seat-color": "#f97316" }} />
            <span>Người khác giữ</span>
          </div>

          <div className="bk-legend-item">
            <div className="bk-seat dynamic-seat bk-seat--my-booked" style={{ "--seat-color": "#ff0033" }} />
            <span>Bạn đã đặt</span>
          </div>

          <div className="bk-legend-item">
            <div className="bk-seat bk-seat--taken" />
            <span>Đã đặt</span>
          </div>
        </div>

        <div className="bk-seat-map-scroll">
          <div className="bk-seat-map">
            {listGroupSeat?.map((item, index) => (
              <div className="bk-seat-row" key={index}>
                <span className="bk-seat-row__label">
                  {item[0].seatNumber[0]}
                </span>

                {item.map((s) => (
                  <div
                    key={s.seatID}
                    className={`bk-seat dynamic-seat ${renderStatusSeatClass(s)}`}
                    style={{ "--seat-color": s.seatType.color }}
                    onClick={() => {
                      if (
                        renderStatusSeatClass(s) !== "bk-seat--taken" &&
                        renderStatusSeatClass(s) !== "bk-seat--holding" &&
                        renderStatusSeatClass(s) !== "bk-seat--my-booked" &&
                        bookingInfo === null
                      ) {
                        handleSelectSeat(s);
                      }
                    }}
                  />
                ))}

                <span className="bk-seat-row__label">
                  {item[0].seatNumber[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderSeat = () => {
    return (
      <>
        <div className="bk-section mb-4">
          <div className="bk-section__header">
            <span className="bk-step-badge">2</span>
            <h3 className="bk-section__title">Chọn Ghế Ngồi</h3>
          </div>

          {/* Màn hình */}
          <div className="bk-screen-wrap mb-4">
            <div className="bk-screen">
              <span>MÀN HÌNH</span>
            </div>
            <div className="bk-screen__light" />
          </div>

          {renderSeatMap()}
        </div>
      </>
    );
  };

  console.log("Booking info", bookingInfo);

  // Tính số ghế đang giữ của user để hiện trên FAB
  const myHeldSeatsCount = listSeatHolding.filter(
    (sh) => sh.userID === getUserId()
  ).length;

  return (
    <>
      <div className="row g-4">
        {/* ══ CỘT TRÁI ══ */}
        <div className="col-lg-8">
          {/* ── BƯỚC 1: CHỌN RẠP & NGÀY ── */}
          <div className="bk-section mb-4">
            <div className="bk-section__header">
              <span className="bk-step-badge">1</span>
              <h3 className="bk-section__title">Chọn Rạp & Ngày Chiếu</h3>
            </div>

            {/* Chọn ngày */}
            <div className="bk-date-row mb-4">
              {listDate?.map((item, index) => (
                <button
                  className={`bk-date-btn ${
                    filter?.date === item.date ? "bk-date-btn--active" : ""
                  }`}
                  key={index}
                  onClick={() => handleChooseDate(item.date)}
                >
                  <span className="bk-date-btn__day">
                    {getDateParts(item.date).dayOfWeek}
                  </span>
                  <span className="bk-date-btn__num">
                    {getDateParts(item.date).day}
                  </span>
                  <span className="bk-date-btn__month">
                    Th{getDateParts(item.date).month}
                  </span>
                </button>
              ))}
            </div>

            {/* Chọn rạp & suất */}
            {listShowTime?.map((c) => (
              <div className="bk-cinema-block mb-3" key={c.cinema.cinemaID}>
                <div className="bk-cinema-block__header">
                  <span className="bk-cinema-block__name">{c.cinema.name}</span>
                  <div className="ms-2">
                    <i className="fas fa-map-marker-alt"></i>
                    <span className="bk-cinema-block__addr ms-2">
                      {c.cinema.address}
                    </span>
                  </div>
                </div>
                <div className="bk-showtime-row">
                  {c.listShowTime?.map((st) => (
                    <button
                      className={`bk-showtime-btn ${
                        st.showTimeID === selectedShowTime.showTimeID
                          ? "bk-showtime-btn--active"
                          : ""
                      }`}
                      key={st.showTimeID}
                      onClick={() => handleChooseShowTime(c, st)}
                    >
                      <span className="bk-showtime-btn__time">
                        {new Date(st.startTime).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(st.endTime).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {renderSeat()}
        </div>

        {/* ══ CỘT PHẢI — ẩn trên mobile ══ */}
        <div className="bk-desktop-summary">
          <OrderSummary
            movie={movie}
            listSeatHolding={listSeatHolding}
            selectedCinema={selectedCinema}
            selectedShowTime={selectedShowTime}
            bookingInfo={bookingInfo}
            listBookedSeat={listBookedSeat}
          />
        </div>
      </div>

      {/* ══ MOBILE: Floating Action Button ══ */}
      <div className="bk-mobile-fab-wrap">
        <button
          className="bk-mobile-fab"
          onClick={() => setShowMobileSummary(true)}
        >
          <i className="fas fa-receipt me-2"></i>
          Xem đơn hàng
          {myHeldSeatsCount > 0 && (
            <span className="bk-fab-badge">{myHeldSeatsCount}</span>
          )}
        </button>
      </div>

      {/* ══ MOBILE: Bottom Sheet ══ */}
      {showMobileSummary && (
        <div
          className="bk-bottom-sheet-overlay"
          onClick={() => setShowMobileSummary(false)}
        >
          <div
            className="bk-bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bk-bottom-sheet__handle" />
            <div className="bk-bottom-sheet__close" onClick={() => setShowMobileSummary(false)}>
              <i className="fas fa-times"></i>
            </div>
            <div className="bk-bottom-sheet__content">
              <OrderSummary
                movie={movie}
                listSeatHolding={listSeatHolding}
                selectedCinema={selectedCinema}
                selectedShowTime={selectedShowTime}
                bookingInfo={bookingInfo}
                listBookedSeat={listBookedSeat}
              />
            </div>
          </div>
        </div>
      )}

      {loading && <Loading />}
    </>
  );
}

function Booking() {
  const history = useHistory();
  const { id } = useParams();

  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);

        const result = await movieService.getMovieById(id);
        setMovie(result);

        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Load thông tin phim thất bại");
        setLoading(false);
      }
    };

    fetchMovie();
  }, []);

  const renderAgeClass = (ageRating) => {
    if (ageRating >= 16 && ageRating < 18) {
      return "st-badge--age--16";
    }

    if (ageRating >= 18) {
      return "st-badge--age--18";
    }

    return "st-badge--age--all";
  };

  return (
    <>
      <Header />

      <div className="bk-wrapper">
        <div className="container-fluid">
          {/* ── MOVIE INFO BAR ── */}
          <div className="bk-movie-bar">
            <div className="bk-movie-bar__poster">
              <img src={movie.posterUrl} alt="" />
            </div>
            <div className="bk-movie-bar__info">
              <h2 className="bk-movie-bar__title">{movie.title}</h2>
              <div className="bk-movie-bar__meta">
                <span className={`dm-meta-age ${renderAgeClass(movie.ageRating)}`}>{movie.ageRating}+</span>
                <span className="dm-meta-dot" />
                <span className="dm-meta-item">{movie.duration} phút</span>
                <span className="dm-meta-dot" />
                <span className="dm-meta-item">{movie.productionYear}</span>
                <span className="dm-meta-dot" />
                {movie?.listGenre?.map((item) => (
                  <span className="dm-genre-tag" key={item.genreID} onClick={() => {
                    history.push("/showTimes", { genre: item.genreID });
                  }}>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Order id={id} movie={movie} />
        </div>
      </div>

      {loading && <Loading />}

      <Footer />
    </>
  );
}

export default Booking;