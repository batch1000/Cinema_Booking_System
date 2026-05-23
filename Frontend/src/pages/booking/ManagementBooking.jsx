import { useEffect, useState, useReducer } from "react";
import {
  Switch,
  Route,
  NavLink,
} from "react-router-dom/cjs/react-router-dom.min";

import "../../css/managementBooking.css";

import { movieService } from "../../services/movieService";
import { cinemaService } from "../../services/cinemaService";
import { showTimeService } from "../../services/showTimeService";
import { bookingService } from "../../services/bookingService";

import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

function ShowTimeModal({ mode, setShowTimeModal, initState, setRefresh }) {
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_MOVIE_ID":
        return {
          ...state,
          movieID: action.payload,
        };

      case "SET_CINEMA_ID":
        return {
          ...state,
          cinemaID: action.payload,
        };

      case "SET_ROOM_ID":
        return {
          ...state,
          roomID: action.payload,
        };

      case "SET_START_TIME":
        return {
          ...state,
          startTime: action.payload,
        };

      case "SET_END_TIME":
        return {
          ...state,
          endTime: action.payload,
        };

      case "SET_PRICE":
        return {
          ...state,
          price: action.payload,
        };

      case "CLEAR":
        return {
          movieID: "",
          cinemaID: "",
          roomID: "",
          startTime: "",
          endTime: "",
          price: "",
        };

      default:
        return state;
    }
  };

  const setInfo = (info, typeAction) => {
    return {
      type: typeAction,
      payload: info,
    };
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const [listMovie, setListMovie] = useState([]);
  const [listCinema, setListCinema] = useState([]);
  const [loading, setLoading] = useState(false);

  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [listMovie, listCinema] = await Promise.all([
          movieService.getAllListMovie(),
          cinemaService.getAllListCinema(),
        ]);

        setListMovie(listMovie);
        setListCinema(listCinema);

        setLoading(false);
      } catch (err) {
        alert("Loading phim thất bại");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderListRoom = () => {
    if (state?.cinemaID) {
      const cinema = listCinema.find(
        (cinema) => cinema.cinemaID === state.cinemaID
      );
      return (
        <select
          className="dashboard-content__management-booking-form-select"
          value={state.roomID}
          onChange={(e) => dispatch(setInfo(e.target.value, "SET_ROOM_ID"))}
        >
          <option value="">-- Chọn phòng --</option>
          {cinema?.listRoom?.map((room) => (
            <option key={room.roomID} value={room.roomID}>
              {room.name}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <select className="dashboard-content__management-booking-form-select">
          <option value="">-- Chọn phòng --</option>
        </select>
      );
    }
  };

  const normalizeText = (str) => {
    return str
      ?.normalize("NFD") // tách dấu ra
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .replace(/đ/g, "d") // xử lý riêng đ
      .replace(/Đ/g, "D")
      .toLowerCase()
      .trim();
  };

  const renderDropDownListMovie = () => {
    const listMovieFilter = listMovie.filter((movie) =>
      normalizeText(movie.title).includes(normalizeText(inputSearch))
    );

    return (
      <div className="booking-movie-dropdown">
        {listMovieFilter.map((movie) => (
          <div
            className="booking-movie-dropdown-item"
            key={movie.movieID}
            onClick={() => {
              setInputSearch("");
              dispatch(setInfo(movie.movieID, "SET_MOVIE_ID"));
            }}
          >
            <img
              src={movie.posterUrl}
              alt=""
              className="booking-movie-dropdown-thumb"
            />
            <div>
              <div className="booking-movie-dropdown-title">{movie.title}</div>
              <div className="booking-movie-dropdown-meta">
                {movie.listGenre.map((genre) => genre.name).join(", ")} ·{" "}
                {movie.duration} phút
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSelectedMovie = () => {
    const movie = listMovie.find((item) => item.movieID === state?.movieID);

    return (
      <>
        <div className="booking-movie-selected" key={movie?.movieID}>
          <img
            src={movie?.posterUrl}
            alt=""
            className="booking-movie-selected-thumb"
          />

          <div className="booking-movie-selected-info">
            <div className="booking-movie-selected-title">{movie?.title}</div>

            <div className="booking-movie-selected-meta">
              {movie?.listGenre.map((genre) => genre.name).join(", ")} ·{" "}
              {movie?.duration} phút
            </div>
          </div>

          <button
            className="booking-movie-selected-remove"
            onClick={() => dispatch(setInfo("", "SET_MOVIE_ID"))}
          >
            ✕
          </button>
        </div>
      </>
    );
  };

  const handleAddShowTime = async () => {
    let empty = 0;
    Object.entries(state).map(([key, value]) => {
      if (value === "") {
        empty += 1;
      }
    });

    if (empty > 0) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const { cinemaID, ...data } = state;

      const result = await showTimeService.createShowTime(data);
      if (result) {
        alert("Thêm suất chiếu thành công");
        dispatch({ type: "CLEAR" });
        setRefresh();
      }

      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Thêm suất chiếu thất bại");
      setLoading(false);
    }
  };

  const handleUpdateShowTime = async () => {
    const isChange =
      state.cinemaID !== initState.cinemaID ||
      state.movieID !== initState.movieID ||
      state.roomID !== initState.roomID ||
      state.startTime !== initState.startTime ||
      state.endTime !== initState.endTime ||
      state.price !== initState.price;

    if (isChange) {
      try {
        setLoading(true);
        const { cinemaID, showTimeID, ...data } = state;

        const result = await showTimeService.updateShowTime(showTimeID, data);

        if (result) {
          alert("Cập nhật suất chiếu thành công");
          setRefresh();
        }

        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Cập nhật suất chiếu thất bại");
        setLoading(false);
      }
    } else {
      alert("Hiện tại không có thông tin nào thay đổi");
    }
  };

  const handleButton = () => {
    if (mode === "edit") {
      handleUpdateShowTime();
    } else {
      handleAddShowTime();
    }
  };

  console.log("State: ", state);

  return (
    <>
      <div className="dashboard-content__management-booking-modal-overlay">
        <div className="dashboard-content__management-booking-modal">
          <div className="dashboard-content__management-booking-modal-header">
            <div className="dashboard-content__management-booking-modal-title">
              <span className="dashboard-content__management-booking-modal-title-icon">
                🎬
              </span>
              {mode === "edit" ? "Cập nhật suất chiếu" : "Thêm suất chiếu"}
            </div>
            <button
              className="dashboard-content__management-booking-modal-close"
              onClick={() => setShowTimeModal(false)}
            >
              ✕
            </button>
          </div>

          <div className="dashboard-content__management-booking-modal-body">
            <div className="dashboard-content__management-booking-form-grid">
              {/* Phim */}
              <div
                className="dashboard-content__management-booking-form-group dashboard-content__management-booking-form-group--full"
                style={{ position: "relative" }}
              >
                <label className="dashboard-content__management-booking-form-label">
                  Phim <span>*</span>
                </label>
                <input
                  type="text"
                  className="dashboard-content__management-booking-form-input"
                  placeholder="🔍 Gõ tên phim để tìm..."
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                />

                {inputSearch.trim() && renderDropDownListMovie()}

                {state?.movieID && renderSelectedMovie()}
              </div>

              {/* Rạp */}
              <div className="dashboard-content__management-booking-form-group">
                <label className="dashboard-content__management-booking-form-label">
                  Rạp <span>*</span>
                </label>
                <select
                  className="dashboard-content__management-booking-form-select"
                  value={state.cinemaID}
                  onChange={(e) =>
                    dispatch(setInfo(e.target.value, "SET_CINEMA_ID"))
                  }
                >
                  <option value="">-- Chọn rạp --</option>
                  {listCinema.map((cinema) => (
                    <option key={cinema.cinemaID} value={cinema.cinemaID}>
                      {cinema.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phòng */}
              <div className="dashboard-content__management-booking-form-group">
                <label className="dashboard-content__management-booking-form-label">
                  Phòng chiếu <span>*</span>
                </label>
                {renderListRoom()}
              </div>

              {/* Giờ bắt đầu */}
              <div className="dashboard-content__management-booking-form-group">
                <label className="dashboard-content__management-booking-form-label">
                  Giờ bắt đầu <span>*</span>
                </label>
                <input
                  type="datetime-local"
                  className="dashboard-content__management-booking-form-input"
                  value={state.startTime}
                  onChange={(e) => {
                    dispatch(setInfo(e.target.value, "SET_START_TIME"));
                  }}
                />
              </div>

              {/* Giờ kết thúc */}
              <div className="dashboard-content__management-booking-form-group">
                <label className="dashboard-content__management-booking-form-label">
                  Giờ kết thúc <span>*</span>
                </label>
                <input
                  type="datetime-local"
                  className="dashboard-content__management-booking-form-input"
                  value={state.endTime}
                  onChange={(e) => {
                    dispatch(setInfo(e.target.value, "SET_END_TIME"));
                  }}
                />
              </div>

              {/* Giá cơ bản */}
              <div className="dashboard-content__management-booking-form-group dashboard-content__management-booking-form-group--full">
                <label className="dashboard-content__management-booking-form-label">
                  Giá vé cơ bản (VNĐ) <span>*</span>
                </label>
                <input
                  type="number"
                  className="dashboard-content__management-booking-form-input"
                  placeholder="VD: 85000"
                  min="0"
                  step="1000"
                  value={state.price}
                  onChange={(e) =>
                    dispatch(setInfo(Number(e.target.value), "SET_PRICE"))
                  }
                />
                <span className="dashboard-content__management-booking-form-hint">
                  Giá thực tế = Giá cơ bản × Hệ số loại ghế
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-content__management-booking-modal-footer">
            <button
              className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--secondary"
              onClick={() => setShowTimeModal(false)}
            >
              Hủy
            </button>
            <button
              className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--primary"
              onClick={handleButton}
            >
              💾 {mode === "edit" ? "Cập nhật" : "Tạo suất chiếu"}
            </button>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
}

function DetailTicketModal() {
  return (
    <>
      <div className="dashboard-content__management-booking-modal-overlay">
        <div className="dashboard-content__management-booking-modal dashboard-content__management-booking-modal--wide">
          <div className="dashboard-content__management-booking-modal-header">
            <div className="dashboard-content__management-booking-modal-title">
              <span className="dashboard-content__management-booking-modal-title-icon">
                <i className="fa-solid fa-ticket"></i>
              </span>
              Chi tiết đơn — #BK00123
            </div>
            <button className="dashboard-content__management-booking-modal-close">
              ✕
            </button>
          </div>

          <div className="dashboard-content__management-booking-modal-body">
            {/* Info grid */}
            <div className="dashboard-content__management-booking-detail-grid">
              <div className="dashboard-content__management-booking-detail-block">
                <div className="dashboard-content__management-booking-detail-block-title">
                  <i className="fa-solid fa-user"></i> Khách hàng
                </div>
                <div className="dashboard-content__management-booking-detail-row">
                  <span className="dashboard-content__management-booking-detail-label">
                    Họ tên:
                  </span>
                  <span className="dashboard-content__management-booking-detail-value">
                    Nguyễn Văn A
                  </span>
                </div>
                <div className="dashboard-content__management-booking-detail-row">
                  <span className="dashboard-content__management-booking-detail-label">
                    Email:
                  </span>
                  <span className="dashboard-content__management-booking-detail-value">
                    vana@gmail.com
                  </span>
                </div>
                <div className="dashboard-content__management-booking-detail-row">
                  <span className="dashboard-content__management-booking-detail-label">
                    Điện thoại:
                  </span>
                  <span className="dashboard-content__management-booking-detail-value">
                    0901 234 567
                  </span>
                </div>
              </div>

              <div className="dashboard-content__management-booking-detail-block">
                <div className="dashboard-content__management-booking-detail-block-title">
                  <i className="fa-solid fa-film"></i> Suất chiếu
                </div>
                <div className="dashboard-content__management-booking-detail-row">
                  <span className="dashboard-content__management-booking-detail-label">
                    Phim:
                  </span>
                  <span className="dashboard-content__management-booking-detail-value">
                    Avengers: Doomsday
                  </span>
                </div>
                <div className="dashboard-content__management-booking-detail-row">
                  <span className="dashboard-content__management-booking-detail-label">
                    Rạp:
                  </span>
                  <span className="dashboard-content__management-booking-detail-value">
                    CGV Vincom
                  </span>
                </div>
                <div className="dashboard-content__management-booking-detail-row">
                  <span className="dashboard-content__management-booking-detail-label">
                    Phòng:
                  </span>
                  <span className="dashboard-content__management-booking-detail-value">
                    Phòng 01
                  </span>
                </div>
                <div className="dashboard-content__management-booking-detail-row">
                  <span className="dashboard-content__management-booking-detail-label">
                    Suất:
                  </span>
                  <span className="dashboard-content__management-booking-detail-value">
                    25/03/2026 — 09:00 → 11:30
                  </span>
                </div>
              </div>
            </div>

            {/* Seat detail table */}
            <div className="dashboard-content__management-booking-detail-section-title">
              <i className="fa-solid fa-couch"></i> Chi tiết ghế
            </div>
            <div className="dashboard-content__management-booking-table-wrap">
              <table className="dashboard-content__management-booking-table">
                <thead>
                  <tr>
                    <th>Ghế</th>
                    <th>Loại ghế</th>
                    <th>Giá cơ bản</th>
                    <th>Hệ số</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="dashboard-content__management-booking-seat-tag">
                        A1
                      </span>
                    </td>
                    <td>
                      <span className="dashboard-content__management-booking-badge dashboard-content__management-booking-badge--gray">
                        Standard
                      </span>
                    </td>
                    <td>85.000 ₫</td>
                    <td>× 1</td>
                    <td>
                      <strong>85.000 ₫</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="dashboard-content__management-booking-seat-tag">
                        A2
                      </span>
                    </td>
                    <td>
                      <span className="dashboard-content__management-booking-badge dashboard-content__management-booking-badge--blue">
                        VIP
                      </span>
                    </td>
                    <td>85.000 ₫</td>
                    <td>× 2</td>
                    <td>
                      <strong>170.000 ₫</strong>
                    </td>
                  </tr>
                  {/* ... thêm row tương tự */}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="dashboard-content__management-booking-detail-total">
              <span>Tổng cộng:</span>
              <span className="dashboard-content__management-booking-detail-total-value">
                255.000 ₫
              </span>
            </div>

            {/* Payment status */}
            <div className="dashboard-content__management-booking-detail-payment">
              <span className="dashboard-content__management-booking-detail-label">
                Trạng thái thanh toán:
              </span>
              <span className="dashboard-content__management-booking-badge dashboard-content__management-booking-badge--green">
                <i className="fa-solid fa-check"></i> Đã thanh toán
              </span>
              <span
                className="dashboard-content__management-booking-detail-label"
                style={{ marginLeft: "2rem" }}
              >
                Phương thức:
              </span>
              <span className="dashboard-content__management-booking-detail-value">
                VNPAY
              </span>
            </div>
          </div>

          <div className="dashboard-content__management-booking-modal-footer">
            <button className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--danger">
              <i className="fa-solid fa-ban"></i> Hủy đơn
            </button>
            <button className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--secondary">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ShowTimeTab({ overViewInfo, setOverViewInfo }) {
  const [openAddShowTimeModal, setOpenAddShowTimeModal] = useState(false);
  const [openUpdateShowTimeModal, setUpdateShowTimeModal] = useState(false);
  const [selectUpdateElement, setSelectUpdateElement] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [filter, setFilter] = useState({
    keyword: "",
    cinemaID: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const [inputSearch, setInputSearch] = useState("");
  const [listShowTime, setListShowTime] = useState([]);
  const [listCinema, setListCinema] = useState([]);

  const [refresh, setRefresh] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await cinemaService.getAllListCinema();

        setListCinema(result);

        setLoading(false);
      } catch (err) {
        alert("Loading dữ rạp chiếu thất bại");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchShowTime();
  }, [currentPage, filter, refresh]);

  const fetchShowTime = async () => {
    try {
      setLoading(true);

      const result = await showTimeService.getListShowTime(
        currentPage,
        pageSize,
        filter
      );

      const [listShowTime, overviewInfo] = await Promise.all([
        showTimeService.getListShowTime(currentPage, pageSize, filter),
        showTimeService.getPaginationInfo(pageSize, filter),
      ]);

      if (result) {
        setListShowTime(listShowTime);
        setOverViewInfo(overviewInfo);
      }

      setLoading(false);
    } catch (error) {
      alert(
        error.response?.data?.message || "Tải danh sách suất chiếu thất bại"
      );
      setLoading(false);
    }
  };

  function getDate(str) {
    const [y, m, d] = str.split("T")[0].split("-");
    return `${d}/${m}/${y}`;
  }

  function getTime(str) {
    const [h, min] = str.split("T")[1].split(":");
    return `${h}:${min}`;
  }

  function formatPrice(price) {
    return price.toLocaleString("vi-VN") + " ₫";
  }

  const renderListShowTime = () => {
    return listShowTime.map((item) => (
      <tr key={item.showTimeID}>
        <td>
          <div className="dashboard-content__management-booking-movie-cell">
            <img
              className="dashboard-content__management-booking-movie-thumb"
              src={item.movie.posterUrl}
              alt=""
            />
            <span className="dashboard-content__management-booking-movie-name">
              {item.movie.title}
            </span>
          </div>
        </td>
        <td>
          <div className="dashboard-content__management-booking-room-cell">
            <span className="dashboard-content__management-booking-cinema-name">
              {item.room.cinemaName}
            </span>
            <span className="dashboard-content__management-booking-room-name">
              <i className="fa-solid fa-clapperboard"></i> {item.room.name}
            </span>
          </div>
        </td>

        <td>
          <div className="dashboard-content__management-booking-timerange">
            <span className="dashboard-content__management-booking-date">
              {getDate(item.startTime)}
            </span>
            <div className="dashboard-content__management-booking-timerange-row">
              <span className="dashboard-content__management-booking-time">
                {getTime(item.startTime)}
              </span>
              <span className="dashboard-content__management-booking-timerange-arrow">
                →
              </span>
              <span className="dashboard-content__management-booking-time">
                {getTime(item.endTime)}
              </span>
            </div>
          </div>
        </td>

        <td>
          <span className="dashboard-content__management-booking-price">
            {formatPrice(item.price)}
          </span>
        </td>

        {/* <td>
          <div className="dashboard-content__management-booking-seat-progress">
            <span className="dashboard-content__management-booking-seat-count">
              72 / 120
            </span>
            <div className="dashboard-content__management-booking-progress-bar">
              <div
                className="dashboard-content__management-booking-progress-fill"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </td> */}

        <td>
          <div className="dashboard-content__management-booking-actions">
            <button
              className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--outline dashboard-content__management-booking-btn--sm dashboard-content__management-booking-btn--icon-only"
              title="Xem đơn đặt vé"
            >
              <i className="fa-solid fa-eye"></i>
            </button>
            <button
              className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--outline dashboard-content__management-booking-btn--sm dashboard-content__management-booking-btn--icon-only"
              title="Chỉnh sửa"
              onClick={() => {
                setUpdateShowTimeModal(true);
                setSelectUpdateElement(item);
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--danger dashboard-content__management-booking-btn--sm dashboard-content__management-booking-btn--icon-only"
              title="Xóa"
              onClick={() => handleDelete(item.showTimeID)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const handleSearch = () => {
    if (inputSearch) {
      setCurrentPage(1);
      setFilter({
        keyword: inputSearch,
      });
    } else {
      alert("Vui lòng nhập từ khóa");
    }
  };

  const clearFilter = () => {
    setCurrentPage(1);

    if (inputSearch) {
      setInputSearch("");
    }
    setFilter({
      keyword: "",
      cinemaID: "",
      date: "",
    });
  };

  const renderListCinema = () => {
    return (
      <select
        className="dashboard-content__management-booking-filter-select"
        value={filter.cinemaID}
        onChange={(e) => {
          setCurrentPage(1);
          setFilter({
            ...filter,
            cinemaID: e.target.value,
          });
        }}
      >
        <option value="">Tất cả rạp</option>
        {listCinema.map((item) => (
          <option key={item.cinemaID} value={item.cinemaID}>
            {item.name}
          </option>
        ))}
      </select>
    );
  };

  const handleDelete = async (showTimeID) => {
    if (window.confirm("Bạn có thật sự muốn xóa suất chiếu này?")) {
      try {
        setLoading(true);
        const result = await showTimeService.deleteShowTime(showTimeID);
        if (result) {
          alert("Xóa suất chiếu thành công");
          setRefresh((prev) => prev + 1);
          clearFilter();
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Xóa suất chiếu thất bại");
        setLoading(false);
      }
    }
  };

  console.log(listShowTime);
  // console.log(overViewInfo);
  // console.log(listCinema);

  return (
    <>
      <div className="dashboard-content__management-booking-tab-content">
        {/* Toolbar */}
        <div className="dashboard-content__management-booking-toolbar">
          <div className="dashboard-content__management-booking-search-wrap">
            <span className="dashboard-content__management-booking-search-icon">
              🔍
            </span>
            <input
              type="text"
              className="dashboard-content__management-booking-search"
              placeholder="Tìm theo tên phim"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            />
          </div>

          <button
            className="dashboard-content__management-booking-search-button"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>

          {renderListCinema()}

          <input
            type="date"
            className="dashboard-content__management-booking-filter-date"
            value={filter.date}
            onChange={(e) => {
              setFilter({
                ...filter,
                date: e.target.value,
              });

              setCurrentPage(1);
            }}
          />

          <button
            className="dashboard-content__management-booking-clear-filter-button"
            onClick={clearFilter}
          >
            Xóa bộ lọc
          </button>
        </div>

        <div className="d-flex mb-3">
          <button
            className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--primary"
            onClick={() => setOpenAddShowTimeModal(true)}
          >
            ➕ Thêm suất chiếu
          </button>
        </div>

        {/* Showtime Table */}
        <div className="dashboard-content__management-booking-table-wrap">
          <table className="dashboard-content__management-booking-table">
            <thead>
              <tr>
                <th>Phim</th>
                <th>Rạp / Phòng</th>
                <th>Thời gian chiếu</th>
                <th>Giá cơ bản</th>
                {/* <th>Đã đặt / Tổng</th> */}
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>{renderListShowTime()}</tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPage={overViewInfo.totalPage}
          totalItem={overViewInfo.totalItem}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          nameList={"suất chiếu"}
        />
      </div>

      {openAddShowTimeModal && (
        <ShowTimeModal
          mode={"add"}
          setShowTimeModal={setOpenAddShowTimeModal}
          initState={{
            movieID: "",
            cinemaID: "",
            roomID: "",
            startTime: "",
            endTime: "",
            price: "",
          }}
          setRefresh={() => {
            setCurrentPage(1);
            clearFilter();
            setRefresh((prev) => prev + 1);
          }}
        />
      )}

      {openUpdateShowTimeModal && (
        <ShowTimeModal
          mode={"edit"}
          setShowTimeModal={setUpdateShowTimeModal}
          initState={{
            movieID: selectUpdateElement.movie.movieID,
            cinemaID: selectUpdateElement.room.cinemaID,
            roomID: selectUpdateElement.room.roomID,
            startTime: selectUpdateElement.startTime,
            endTime: selectUpdateElement.endTime,
            price: selectUpdateElement.price,
            showTimeID: selectUpdateElement.showTimeID,
          }}
          setRefresh={() => {
            setRefresh((prev) => prev + 1);
          }}
        />
      )}

      {loading && <Loading />}
    </>
  );
}

function BookingTab({ overViewInfo, setOverViewInfo }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [filter, setFilter] = useState({
    keyword: "",
    date: "",
  });
  const [inputSearch, setInputSearch] = useState("");
  const [listBooking, setListBooking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(1);

  useEffect(() => {
    fetchBooking();
  }, [currentPage, filter, refresh]);

  const fetchBooking = async () => {
    try {
      setLoading(true);

      const [listBooking, overviewInfo] = await Promise.all([
        bookingService.getListBooking(currentPage, pageSize, filter),
        bookingService.getPaginationInfo(pageSize, filter),
      ]);

      setListBooking(listBooking);
      setOverViewInfo(overviewInfo);

      setLoading(false);
    } catch (error) {
      alert(
        error.response?.data?.message || "Tải danh sách đơn đặt vé thất bại"
      );
      setLoading(false);
    }
  };

  function getDate(str) {
    const [y, m, d] = str.split("T")[0].split("-");
    return `${d}/${m}/${y}`;
  }

  function getTime(str) {
    const [h, min] = str.split("T")[1].split(":");
    return `${h}:${min}`;
  }

  function formatPrice(price) {
    return price.toLocaleString("vi-VN") + " ₫";
  }

  const handleSearch = () => {
    if (inputSearch) {
      setCurrentPage(1);
      setFilter({ ...filter, keyword: inputSearch });
    } else {
      alert("Vui lòng nhập từ khóa");
    }
  };

  const clearFilter = () => {
    if (inputSearch) setInputSearch("");
    setCurrentPage(1);
    setFilter({ keyword: "", date: "" });
  };

  const renderListBooking = () => {
    return listBooking.map((item) => (
      <tr key={item.bookingID}>
        <td>
          <span className="dashboard-content__management-booking-order-id">
            #{item.bookingID.toString().slice(0, 8).toUpperCase()}
          </span>
        </td>

        <td>
          <div className="dashboard-content__management-booking-customer-cell">
            <div className="dashboard-content__management-booking-avatar">
              {item.user.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="dashboard-content__management-booking-customer-name">
                {item.user.lastName} {item.user.firstName}
              </div>
              <div className="dashboard-content__management-booking-customer-email">
                {item.user.email}
              </div>
            </div>
          </div>
        </td>

        <td>
          <div className="dashboard-content__management-booking-showtime-cell">
            <span className="dashboard-content__management-booking-movie-name">
              {item.showTime.movie.title}
            </span>
            <span className="dashboard-content__management-booking-showtime-info">
              <i className="fa-regular fa-clock"></i>{" "}
              {getDate(item.showTime.startTime)} —{" "}
              {getTime(item.showTime.startTime)}
            </span>
          </div>
        </td>
        <td>
          <div className="dashboard-content__management-booking-room-cell">
            <span className="dashboard-content__management-booking-cinema-name">
              {item.showTime.room.cinema.name}
            </span>
            <span className="dashboard-content__management-booking-room-name">
              <i className="fa-solid fa-clapperboard"></i>{" "}
              {item.showTime.room.name}
            </span>
          </div>
        </td>
        <td>
          <div className="dashboard-content__management-booking-seat-tags">
            {item.bookingSeats.map((s) => (
              <span
                key={s.bookingSeatID}
                className="dashboard-content__management-booking-seat-tag"
              >
                {s.seat.seatNumber}
              </span>
            ))}
          </div>
        </td>
        <td>
          <span className="dashboard-content__management-booking-total-price">
            {formatPrice(item.totalPrice)}
          </span>
        </td>
        <td>
          <span className="dashboard-content__management-booking-date-text">
            {getDate(item.createAt)}
          </span>
        </td>
        <td>
          <div className="dashboard-content__management-booking-actions">
            <button
              className="dashboard-content__management-booking-btn dashboard-content__management-booking-btn--outline dashboard-content__management-booking-btn--sm dashboard-content__management-booking-btn--icon-only"
              title="Xem chi tiết"
            >
              <i className="fa-solid fa-eye"></i>
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className="dashboard-content__management-booking-tab-content">
        {/* Toolbar */}
        <div className="dashboard-content__management-booking-toolbar">
          <div className="dashboard-content__management-booking-search-wrap">
            <span className="dashboard-content__management-booking-search-icon">
              🔍
            </span>
            <input
              type="text"
              className="dashboard-content__management-booking-search"
              placeholder="Tìm theo tên khách, tên phim..."
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            />
          </div>

          <button
            className="dashboard-content__management-booking-search-button"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>

          <input
            type="date"
            className="dashboard-content__management-booking-filter-date"
            value={filter.date}
            onChange={(e) => {
              setCurrentPage(1);
              setFilter({ ...filter, date: e.target.value });
            }}
          />

          <button
            className="dashboard-content__management-booking-clear-filter-button"
            onClick={clearFilter}
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Booking Table */}
        <div className="dashboard-content__management-booking-table-wrap">
          <table className="dashboard-content__management-booking-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Phim / Suất chiếu</th>
                <th>Rạp / Phòng</th>
                <th>Ghế</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>{renderListBooking()}</tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPage={overViewInfo.totalPage}
          totalItem={overViewInfo.totalItem}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          nameList={"đơn đặt vé"}
        />
      </div>

      {loading && <Loading />}
    </>
  );
}

function ManagementBooking() {
  const [overViewInfo, setOverViewInfo] = useState({});
  const [overViewInfoBooking, setOverViewInfoBooking] = useState({});

  return (
    <div className="dashboard-content__management-booking">
      {/* ===== HEADER ===== */}
      <div className="dashboard-content__management-booking-header">
        <div>
          <h1 className="dashboard-content__management-booking-title">
            <i className="fa-solid fa-ticket"></i> Quản Lý Đặt Vé
          </h1>
          <p className="dashboard-content__management-booking-subtitle">
            Tổng hợp suất chiếu, đơn đặt vé và tình trạng thanh toán
          </p>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="dashboard-content__management-booking-stats">
        {Object.entries(overViewInfo).length !== 0 && (
          <div className="dashboard-content__management-booking-stat-card">
            <div className="dashboard-content__management-booking-stat-icon dashboard-content__management-booking-stat-icon--blue">
              <i className="fa-solid fa-film"></i>
            </div>
            <div>
              <div className="dashboard-content__management-booking-stat-label">
                Tổng suất chiếu
              </div>
              <div className="dashboard-content__management-booking-stat-value">
                {overViewInfo.totalItem}
              </div>
            </div>
          </div>
        )}

        {Object.entries(overViewInfoBooking).length !== 0 && (
          <>
            <div className="dashboard-content__management-booking-stat-card">
              <div className="dashboard-content__management-booking-stat-icon dashboard-content__management-booking-stat-icon--green">
                <i className="fa-solid fa-ticket"></i>
              </div>
              <div>
                <div className="dashboard-content__management-booking-stat-label">
                  Tổng đơn đặt vé
                </div>
                <div className="dashboard-content__management-booking-stat-value">
                  {overViewInfoBooking.totalItem}
                </div>
              </div>
            </div>

            <div className="dashboard-content__management-booking-stat-card">
              <div className="dashboard-content__management-booking-stat-icon dashboard-content__management-booking-stat-icon--purple">
                <i className="fa-solid fa-money-bill-wave"></i>
              </div>
              <div>
                <div className="dashboard-content__management-booking-stat-label">
                  Doanh thu
                </div>
                <div className="dashboard-content__management-booking-stat-value">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(overViewInfoBooking.totalPriceSum)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===== TAB BAR ===== */}
      <div className="dashboard-content__management-booking-tabs">
        <NavLink
          to="/dashboard/managementBooking/showTimeTab"
          className="dashboard-content__management-booking-tab-btn"
          activeClassName="dashboard-content__management-booking-tab-btn--active"
        >
          <i className="fa-solid fa-clapperboard"></i> Suất chiếu
        </NavLink>

        <NavLink
          to="/dashboard/managementBooking/bookingTab"
          className="dashboard-content__management-booking-tab-btn"
          activeClassName="dashboard-content__management-booking-tab-btn--active"
        >
          <i className="fa-solid fa-ticket"></i> Đơn đặt vé
        </NavLink>
      </div>

      <Switch>
        <Route path="/dashboard/managementBooking/showTimeTab">
          <ShowTimeTab
            overViewInfo={overViewInfo}
            setOverViewInfo={setOverViewInfo}
          />
        </Route>

        <Route path="/dashboard/managementBooking/bookingTab">
          <BookingTab
            overViewInfo={overViewInfoBooking}
            setOverViewInfo={setOverViewInfoBooking}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default ManagementBooking;
