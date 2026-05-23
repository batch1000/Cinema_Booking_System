import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import "../../css/payment.css";

import { bookingService } from "../../services/bookingService";
import { seatHubService } from "../../services/hub/seatHubService";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import Loading from "../../components/Loading";

const stripePromise = loadStripe(
  "pk_test_51TIiwm1j6lEtxDFTsxcOcs2Oqrv0vPMmOZM7XaCg98XGpyqVnB7Zd2upKSxn85wk7cz9ciXUrieBxJ9VmHyErDiT00Ob45nIsn"
);

// ── CHECKOUT FORM ─────────────────────────────────────────────
function CheckoutForm({ bookingDraftID, showTimeID, userID }) {
  const history = useHistory();

  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
  
    setProcessing(true);
    setErrorMsg("");
  
    try {
      setLoading(true); 
  
      const result = await bookingService.refreshTimeToLiveBooking({
        bookingDraftID,
        showTimeID,
        userID,
      });
  
      if (!result) {
        setProcessing(false);
        setLoading(false); 
        return;
      }
  
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirm`,
        },
        redirect: "if_required",
      });
  
      if (error) {
        setErrorMsg(error.message);
        setProcessing(false);
        setLoading(false);
      } else if (paymentIntent) {
        handleCheckValidPayment(paymentIntent);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đã vượt quá giới hạn thanh toán");
      setProcessing(false);
      setLoading(false); 
    }
  };

  const handleCheckValidPayment = async (paymentIntent) => {
    try {
      setLoading(true);

      const result = await bookingService.confirmPayment({
        paymentIntentId: paymentIntent.id,
        bookingDraftID: bookingDraftID,
        showTimeID: showTimeID,
        userID: userID,
      });

      if(result.status === "succeeded") {
        history.push("/myBooking");
        alert("Thanh toán thành công");
        return;
      }

      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Thanh toán thất bại");
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="pm-stripe-form-wrapper">
        <PaymentElement />
        {errorMsg && (
          <div className="pm-stripe-error">
            <i className="fas fa-exclamation-circle me-2" />
            {errorMsg}
          </div>
        )}
        <button
          type="submit"
          disabled={!stripe || processing}
          className="dm-btn dm-btn--primary w-100 bk-confirm-btn mt-3"
        >
          {processing ? (
            <>
              <i className="fas fa-spinner fa-spin me-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <i className="fas fa-lock me-2" />
              Thanh Toán Ngay
            </>
          )}
        </button>
      </form>

      {loading && <Loading />}
    </>
  );
}

// ── STRIPE PANEL ──────────────────────────────────────────────
function StripePanel({ clientSecret, bookingDraftID, showTimeID, userID }) {
  if (!clientSecret) {
    return (
      <div className="pm-stripe-loading">
        <i className="fas fa-spinner fa-spin me-2" />
        Đang khởi tạo thanh toán...
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#f5a623",
        colorBackground: "#1a1d2e",
        colorText: "#e0e0e0",
        colorTextSecondary: "#888",
        colorDanger: "#f87171",
        fontSizeBase: "15px",
        borderRadius: "10px",
        spacingUnit: "4px",
      },
      rules: {
        ".Input": {
          border: "1.5px solid rgba(255,255,255,0.09)",
          backgroundColor: "rgba(255,255,255,0.03)",
        },
        ".Input:focus": {
          border: "1.5px solid #f5a623",
          boxShadow: "0 0 0 3px rgba(245,166,35,0.12)",
        },
        ".Label": {
          color: "#888",
          fontWeight: "500",
        },
      },
    },
  };

  return (
    <div className="pm-stripe-panel">
      <div className="pm-stripe-sandbox">
        <i className="fas fa-flask me-2" />
        Chế độ Sandbox — dùng thẻ test <code>4242 4242 4242 4242</code>
      </div>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          bookingDraftID={bookingDraftID}
          showTimeID={showTimeID}
          userID={userID}
        />
      </Elements>

      <div className="pm-stripe-powered">
        <i className="fab fa-stripe" />
        <span>Thanh toán được bảo mật bởi Stripe</span>
      </div>
    </div>
  );
}

// ── PAYMENT INFO (SIDEBAR) ────────────────────────────────────
function PaymentInfo({ booking }) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    if (!booking?.expireTime) return;

    const interval = setInterval(() => {
      const diff = new Date(booking.expireTime) - new Date();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        return;
      }

      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [booking?.expireTime]);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "0";
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

  return (
    <div className="bk-summary-card">
      <h4 className="bk-summary-card__title">
        <i className="fas fa-receipt me-2"></i>Thông Tin Đặt Vé
      </h4>

      <div className="bk-summary-row">
        <span className="bk-summary-label">
          <i className="fas fa-film me-2"></i>Phim
        </span>
        <span className="bk-summary-value">
          {booking?.showTime?.movie?.title}
        </span>
      </div>
      <div className="bk-summary-row">
        <span className="bk-summary-label">
          <i className="fas fa-map-marker-alt me-2"></i>Rạp
        </span>
        <span className="bk-summary-value">
          {booking?.showTime?.room?.cinema?.name}
        </span>
      </div>
      <div className="bk-summary-row">
        <span className="bk-summary-label">
          <i className="fas fa-calendar me-2"></i>Ngày
        </span>
        <span className="bk-summary-value">
          {formatDateVN(booking?.showTime?.startTime)}
        </span>
      </div>
      <div className="bk-summary-row">
        <span className="bk-summary-label">
          <i className="fas fa-clock me-2"></i>Suất chiếu
        </span>
        <span className="bk-summary-value bk-summary-value--gold">
          {formatTimeRange(
            booking?.showTime?.startTime,
            booking?.showTime?.endTime
          )}
        </span>
      </div>

      <div className="bk-summary-divider" />

      <table className="bk-ticket-table">
        <thead>
          <tr>
            <th>Ghế</th>
            <th>Loại</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          {booking?.showTime?.room?.listSeat?.map((item) => (
            <tr key={item.seatID}>
              <td>
                <span
                  className="bk-seat-badge dynamic-seat"
                  style={{ "--seat-color": item.seatType.color }}
                >
                  {item.seatNumber}
                </span>
              </td>
              <td>{item.seatType.name}</td>
              <td>
                {" "}
                {formatPrice(
                  booking?.showTime?.price * item.seatType.priceMultiplier
                )}{" "}
                đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bk-summary-divider" />

      <div className="bk-summary-row bk-summary-row--total">
        <span>Tổng cộng</span>
        <span className="bk-summary-total">
          {formatPrice(
            booking?.showTime?.room?.listSeat?.reduce((sum, item) => {
              return (
                sum + item.seatType.priceMultiplier * booking?.showTime?.price
              );
            }, 0)
          )}{" "}
        </span>
      </div>

      <div className="bk-summary-divider" />

      <div className="pm-countdown">
        <i className="fas fa-hourglass-half pm-countdown__icon"></i>
        <span className="pm-countdown__text">Ghế được giữ trong</span>
        <span className="pm-countdown__timer">{timeLeft}</span>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────
function Payment() {
  const { bookingId, showTimeId } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState([]);

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);

        const result = await bookingService.getBookingDraft({
          showTimeID: showTimeId,
          bookingDraftID: bookingId,
          userID: getUserId(),
        });

        if (result) {
          setBooking(result);

          const paymentIntent = await bookingService.createPaymentIntent({
            bookingDraftID: bookingId,
            showTimeID: showTimeId,
            userID: getUserId(),
          });
          setClientSecret(paymentIntent.clientSecret);
        }

        setLoading(false);
      } catch (error) {
        alert(
          error.response?.data?.message || "Tải thông tin thanh toán thất bại"
        );
        setLoading(false);
      }
    };

    fetchBooking();
  }, []);

  useEffect(() => {
    seatHubService.start();

    seatHubService.joinGroupShowTime(showTimeId);

    seatHubService.listenSeatHold((res) => {
      history.push("/");
    });

    return () => {
      seatHubService.leaveGroupShowTime(showTimeId);
    };
  }, []);

  const getUserId = () => {
    return JSON.parse(localStorage.getItem("user")).userId;
  };

  console.log("Booking: ", booking);

  return (
    <div className="pm-wrapper">
      <div className="pm-container">
        {/* MOVIE INFO BAR */}
        <div className="bk-movie-bar">
          <div className="bk-movie-bar__poster">
            <img src={booking?.showTime?.movie?.posterUrl} alt="" />
          </div>
          <div className="bk-movie-bar__info">
            <h2 className="bk-movie-bar__title">
              {booking?.showTime?.movie?.title}
            </h2>
            <div className="bk-movie-bar__meta">
              <span className="dm-meta-item">
                {booking?.showTime?.movie?.duration} phút
              </span>
              <span className="dm-meta-dot" />
              <span className="dm-meta-item">
                {booking?.showTime?.movie?.productionYear}
              </span>
            </div>
          </div>
        </div>

        {/* STEP INDICATOR */}
        <div className="pm-steps mb-5">
          <div className="pm-step pm-step--done">
            <div className="pm-step__circle">
              <i className="fas fa-check"></i>
            </div>
            <span className="pm-step__label">Chọn Ghế</span>
          </div>
          <div className="pm-step__line pm-step__line--done"></div>
          <div className="pm-step pm-step--active">
            <div className="pm-step__circle">2</div>
            <span className="pm-step__label">Thanh Toán</span>
          </div>
          <div className="pm-step__line"></div>
          <div className="pm-step">
            <div className="pm-step__circle">3</div>
            <span className="pm-step__label">Xác Nhận</span>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="pm-layout">
          {/* CỘT TRÁI */}
          <div className="pm-layout__left">
            {/* STRIPE PANEL */}
            <div className="bk-section mb-4">
              <div className="bk-section__header">
                <span className="bk-step-badge">1</span>
                <h3 className="bk-section__title">Thông Tin Thẻ Thanh Toán</h3>
                <div className="pm-stripe-header-badge">
                  <i className="fab fa-stripe" />
                </div>
              </div>

              <StripePanel
                clientSecret={clientSecret}
                bookingDraftID={bookingId}
                showTimeID={showTimeId}
                userID={getUserId()}
              />
            </div>

            {/* SECURITY BAR */}
            <div className="pm-security-bar">
              <div className="pm-security-bar__item">
                <i className="fas fa-shield-alt"></i>
                <span>Bảo mật SSL 256-bit</span>
              </div>
              <div className="pm-security-bar__item">
                <i className="fas fa-lock"></i>
                <span>Mã hoá đầu cuối</span>
              </div>
              <div className="pm-security-bar__item">
                <i className="fas fa-undo"></i>
                <span>Hoàn tiền nếu lỗi</span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="pm-layout__right">
            <PaymentInfo booking={booking} />
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </div>
  );
}

export default Payment;