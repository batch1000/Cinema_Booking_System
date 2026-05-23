import "../../css/showTimes.css";

import { useState, useEffect } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";

import { movieService } from "../../services/movieService";
import { genreService } from "../../services/genreService";
import { statusService } from "../../services/statusService";
import { countryService } from "../../services/countryService";
import { cinemaService } from "../../services/cinemaService";

import LoadingSkeleton from "../../components/LoadingSkeleton";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function ShowTimes() {
  const history = useHistory();
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [listMovie, setListMovie] = useState([]);
  const [movieInfoPagination, setMovieInfoPagination] = useState({});

  const [filter, setFilter] = useState({
    genre: "all",
    countryId: "all",
    age: 0,
    status: "all",
    cinemaId: "all",
    showTimeId: "all",
    dateFilter: "",
    keyword: "",
  });

  const [listGenre, setListGenre] = useState([]);
  const [listStatus, setListStatus] = useState([]);
  const [listCountry, setListCountry] = useState([]);
  const [listCinema, setListCinema] = useState([]);

  const [inputSearch, setInputSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [loading, setLoading] = useState(0);

  const fetchMovie = async (pageChoose) => {
    try {
      startLoading();
      const [listMovie, movieInfoPagination] = await Promise.all([
        movieService.getListMovie(pageChoose, pageSize, filter),
        movieService.getMovieInfoPagination(pageSize, filter),
      ]);

      setListMovie(listMovie);
      setMovieInfoPagination(movieInfoPagination);
      stopLoading();
    } catch (err) {
      alert("Loading phim thất bại");
      stopLoading();
    }
  };

  useEffect(() => {
    // console.log(location.state);

    if (location.state) {
      if (location.state.keyword !== undefined) {
        setInputSearch(location.state.keyword);
      }

      setFilter((prev) => ({
        ...prev,
        ...location.state,
      }));

      history.replace(location.pathname, null);
    }
  }, []);

  useEffect(() => {
    fetchMovie(page);
  }, [page, filter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        const [listGenre, listStatus, listCountry, listCinema] =
          await Promise.all([
            genreService.getListGenre(),
            statusService.getListStatus(),
            countryService.getListCountry(),
            cinemaService.getAllListCinemaShowTime(),
          ]);

        setListGenre(listGenre);
        setListStatus(listStatus);
        setListCountry(listCountry);
        setListCinema(listCinema);
        stopLoading();
      } catch (err) {
        alert("Loading dữ liệu của bộ lọc thất bại");
        stopLoading();
      }
    };
    fetchData();
  }, []);

  const startLoading = () => setLoading((prev) => prev + 1);
  const stopLoading = () => setLoading((prev) => prev - 1);

  const renderStatusClass = (status) => {
    if (status === "Đang chiếu") return "st-badge--status-on";
    if (status === "Sắp chiếu") return "st-badge--status-soon";
    if (status === "Đã kết thúc") return "st-badge--status-end";
    return "";
  };

  const renderAgeClass = (ageRating) => {
    if (ageRating >= 16 && ageRating < 18) return "st-badge--age--16";
    if (ageRating >= 18) return "st-badge--age--18";
    return "st-badge--age--all";
  };

  const handleClickOnCard = (id) => {
    history.push(`/detailMovie/${id}`);
  };

  const renderListMovie = () => {
    if (loading > 0) {
      return (
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <LoadingSkeleton count={8} />
        </div>
      );
    }

    return listMovie?.map((item) => (
      <div
        className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6"
        key={item.movieID}
      >
        <div
          className="st-movie-card"
          onClick={() => handleClickOnCard(item.movieID)}
        >
          <div className="st-movie-card__poster-wrap">
            <img
              src={item.posterUrl}
              alt=""
              className="st-movie-card__poster"
            />
            <span className={`st-badge ${renderStatusClass(item.status.name)}`}>
              {item.status.name}
            </span>
            <span
              className={`st-badge st-badge--age ${renderAgeClass(item.ageRating)}`}
            >
              {item.ageRating}+
            </span>
            <div className="st-movie-card__overlay">
              <div className="st-overlay__actions">
                {item.status.name !== "Đã kết thúc" && (
                  <button className="st-overlay__book-btn">
                    <i className="fas fa-ticket-alt me-1"></i>Đặt vé
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="st-movie-card__info">
            <h3 className="st-movie-card__title">{item.title}</h3>
            <p className="st-movie-card__sub mt-2">{item.title}</p>
            <div className="st-movie-card__meta-row">
              <span className="st-movie-card__duration">
                <i className="fas fa-clock me-2"></i>
                {item.duration} phút
              </span>
              <span className="st-movie-card__year">
                {`${String(new Date(item.releaseDate).getDate()).padStart(2, "0")}/${String(
                  new Date(item.releaseDate).getMonth() + 1
                ).padStart(2, "0")}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const handleSetPage = (newPage) => {
    const total = movieInfoPagination?.totalPage || 1;
    if (newPage < 1 || newPage > total) return;
    setPage(newPage);
  };

  const countNowShowing = () => {
    const object = movieInfoPagination?.listGroupbyStatus?.find(
      (item) => item.name === "Đang chiếu"
    );
    return object ? object.total : 0;
  };

  const countComingSoon = () => {
    const object = movieInfoPagination?.listGroupbyStatus?.find(
      (item) => item.name === "Sắp chiếu"
    );
    return object ? object.total : 0;
  };

  const countEnded = () => {
    const object = movieInfoPagination?.listGroupbyStatus?.find(
      (item) => item.name === "Đã kết thúc"
    );
    return object ? object.total : 0;
  };

  const countQuantityFilter = () => {
    return Object.entries(filter).reduce((count, [key, value]) => {
      if (value !== "all" && value !== 0 && value !== "") return count + 1;
      return count;
    }, 0);
  };

  const renderListGenre = () => (
    <select
      className="st-filter-select"
      value={filter.genre}
      onChange={(e) => {
        setFilter({ ...filter, genre: e.target.value });
        handleSetPage(1);
      }}
    >
      <option value="all">Tất cả thể loại</option>
      {listGenre?.map((item) => (
        <option key={item.genreID} value={item.genreID}>
          {item.name}
        </option>
      ))}
    </select>
  );

  const renderListStatus = () => (
    <select
      className="st-filter-select"
      value={filter.status}
      onChange={(e) => {
        setFilter({ ...filter, status: e.target.value });
        handleSetPage(1);
      }}
    >
      <option value="all">Tất cả</option>
      {listStatus?.map((item) => (
        <option key={item.statusID} value={item.statusID}>
          {item.name}
        </option>
      ))}
    </select>
  );

  const renderListCountry = () => (
    <select
      className="st-filter-select"
      value={filter.countryId}
      onChange={(e) => {
        setFilter({ ...filter, countryId: e.target.value });
        handleSetPage(1);
      }}
    >
      <option value="all">Tất cả quốc gia</option>
      {listCountry?.map((item) => (
        <option key={item.countryID} value={item.countryID}>
          {item.name}
        </option>
      ))}
    </select>
  );

  const renderListCinema = () => (
    <select
      className="st-filter-select"
      value={filter.cinemaId}
      onChange={(e) => {
        setFilter({ ...filter, cinemaId: e.target.value });
        handleSetPage(1);
      }}
    >
      <option value="all">Tất cả rạp</option>
      {listCinema?.map((item) => (
        <option key={item.cinemaID} value={item.cinemaID}>
          {item.name}
        </option>
      ))}
    </select>
  );

  const renderListShowTime = () => {
    if (filter.cinemaId && filter.cinemaId !== "all") {
      const cinema = listCinema.find((c) => c.cinemaID === filter.cinemaId);

      const formatShowTime = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const formatDate = (date) => date.toLocaleDateString("vi-VN");
        const formatTime = (date) =>
          date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        return `${formatDate(start)} | ${formatTime(start)} - ${formatTime(end)}`;
      };

      return (
        <select
          className="st-filter-select"
          value={filter.showTimeId}
          onChange={(e) => {
            setFilter({ ...filter, showTimeId: e.target.value });
            handleSetPage(1);
          }}
        >
          <option value="all">Tất cả suất chiếu</option>
          {cinema?.listShowTime.map((item) => (
            <option key={item.showTimeID} value={item.showTimeID}>
              {formatShowTime(item.startTime, item.endTime)}
            </option>
          ))}
        </select>
      );
    }

    return (
      <select className="st-filter-select">
        <option value="">Chọn rạp trước</option>
      </select>
    );
  };

  const clearFilter = () => {
    setFilter({
      genre: "all",
      countryId: "all",
      cinemaId: "all",
      showTimeId: "all",
      age: 0,
      status: "all",
      dateFilter: "",
      keyword: "",
    });
    if (inputSearch !== "") setInputSearch("");
  };

  const handleSearchButton = () => {
    if (inputSearch !== "") {
      setFilter({ ...filter, keyword: inputSearch });
    } else {
      alert("Vui lòng nhập từ khóa");
    }
  };

  console.log("CountryId: ", filter.countryId);

  return (
    <>
      <Header />

      {/* ── PAGE HEADER ── */}
      <div className="st-page-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="st-page-header__title">
                <i className="fas fa-film me-3"></i>Lịch Chiếu Phim
              </h1>
              <p className="st-page-header__subtitle">
                Chọn ngày, rạp và suất chiếu phù hợp với bạn
              </p>
            </div>
            <div className="col-auto d-none d-md-flex">
              <div className="st-page-header__stats">
                <div className="st-header-stat">
                  <span className="st-header-stat__num">{countNowShowing()}</span>
                  <span className="st-header-stat__label">Phim đang chiếu</span>
                </div>
                <div className="st-header-stat__divider" />
                <div className="st-header-stat">
                  <span className="st-header-stat__num">{listCinema?.length}</span>
                  <span className="st-header-stat__label">Rạp chiếu phim</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="st-body">
        <div className="container-fluid">

          {/* ── SEARCH BAR ── */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="st-search-bar">
                <i className="fas fa-search st-search-bar__icon"></i>
                <input
                  type="text"
                  className="st-search-bar__input"
                  placeholder="Tìm kiếm theo tên phim, diễn viên"
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchButton()}
                />
                <button className="st-search-bar__btn" onClick={handleSearchButton}>
                  <i className="fas fa-search me-2"></i>
                  <span className="st-search-bar__btn-text">Tìm Kiếm</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── FILTER PANEL ── */}
          <div className="st-filter-panel mb-4">
            {/* Mobile toggle header */}
            <div
              className="st-filter-panel__mobile-header"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              <span>
                <i className="fas fa-sliders-h me-2" style={{ color: "#f5a623" }}></i>
                Bộ lọc
                {countQuantityFilter() > 0 && (
                  <span className="st-filter-badge-mobile">{countQuantityFilter()}</span>
                )}
              </span>
              <i className={`fas fa-chevron-${filterOpen ? "up" : "down"} st-filter-panel__chevron`}></i>
            </div>

            {/* Filter body — always visible on md+, toggle on mobile */}
            <div className={`st-filter-panel__body ${filterOpen ? "st-filter-panel__body--open" : ""}`}>
              <div className="row g-3 align-items-end">
                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                  <label className="st-filter-sublabel">
                    <i className="fas fa-calendar-alt me-1" style={{ color: "#f5a623" }}></i>
                    Ngày chiếu
                  </label>
                  <div className="st-date-picker-wrap">
                    <i className="fas fa-calendar-day st-date-picker-wrap__icon"></i>
                    <input
                      type="date"
                      value={filter.dateFilter}
                      className="st-date-input"
                      onChange={(e) => {
                        setFilter({ ...filter, dateFilter: e.target.value });
                        handleSetPage(1);
                      }}
                    />
                  </div>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                  <label className="st-filter-sublabel">Rạp chiếu</label>
                  {renderListCinema()}
                </div>

                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                  <label className="st-filter-sublabel">Suất chiếu</label>
                  {renderListShowTime()}
                </div>

                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                  <label className="st-filter-sublabel">Thể loại</label>
                  {renderListGenre()}
                </div>

                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                  <label className="st-filter-sublabel">Quốc gia</label>
                  {renderListCountry()}
                </div>

                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                  <label className="st-filter-sublabel">Trạng thái</label>
                  {renderListStatus()}
                </div>

                <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2 mt-2">
                  <p className="st-filter-applied mb-0">
                    <i className="fas fa-filter me-1"></i>
                    Đang áp dụng:&nbsp;
                    <span className="st-filter-applied__num">{countQuantityFilter()}</span> bộ lọc
                  </p>
                  <button className="st-filter-reset-btn" onClick={clearFilter}>
                    <i className="fas fa-undo me-1"></i>Đặt lại
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── TOOLBAR ── */}
          <div className="row align-items-center mb-3 g-2">
            <div className="col-12 col-md">
              <div className="st-status-tabs">
                <button className="st-status-tab st-status-tab--active">
                  Tất cả
                  <span className="st-status-tab__count">{movieInfoPagination.totalMovie}</span>
                </button>
                <button className="st-status-tab">
                  <span className="st-dot st-dot--showtime"></span>
                  <span className="d-none d-sm-inline">Đang chiếu</span>
                  <span className="st-status-tab__count">{countNowShowing()}</span>
                </button>
                <button className="st-status-tab">
                  <span className="st-dot st-dot--coming-soon"></span>
                  <span className="d-none d-sm-inline">Sắp chiếu</span>
                  <span className="st-status-tab__count">{countComingSoon()}</span>
                </button>
                <button className="st-status-tab">
                  <span className="st-dot st-dot--ended"></span>
                  <span className="d-none d-sm-inline">Đã kết thúc</span>
                  <span className="st-status-tab__count">{countEnded()}</span>
                </button>
              </div>
            </div>
            <div className="col-auto d-flex align-items-center gap-3">
              <div className="st-view-toggle">
                <button className="st-view-btn st-view-btn--active" title="Dạng lưới">
                  <i className="fas fa-th-large"></i>
                </button>
                <button className="st-view-btn" title="Dạng danh sách">
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* ── MOVIE GRID ── */}
          <div className="row g-3">{renderListMovie()}</div>

          {/* ── PAGINATION ── */}
          <div className="row mt-5">
            <div className="col-12 d-flex justify-content-center align-items-center gap-2 flex-wrap">
              <button
                className="st-page-btn"
                onClick={() => handleSetPage(page - 1)}
                disabled={page === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <button
                className={`st-page-btn ${page === 1 ? "st-page-btn--active" : ""}`}
                onClick={() => handleSetPage(1)}
              >
                1
              </button>

              {page > 3 && <span className="st-page-dots">...</span>}

              {page > 2 && (
                <button className="st-page-btn" onClick={() => handleSetPage(page - 1)}>
                  {page - 1}
                </button>
              )}

              {page !== 1 && page !== movieInfoPagination.totalPage && (
                <button className="st-page-btn st-page-btn--active">{page}</button>
              )}

              {page < movieInfoPagination.totalPage - 1 && (
                <button className="st-page-btn" onClick={() => handleSetPage(page + 1)}>
                  {page + 1}
                </button>
              )}

              {page < movieInfoPagination.totalPage - 2 && (
                <span className="st-page-dots">...</span>
              )}

              {movieInfoPagination.totalPage > 1 && (
                <button
                  className={`st-page-btn ${
                    page === movieInfoPagination.totalPage ? "st-page-btn--active" : ""
                  }`}
                  onClick={() => handleSetPage(movieInfoPagination.totalPage)}
                >
                  {movieInfoPagination.totalPage}
                </button>
              )}

              <button
                className="st-page-btn"
                onClick={() => handleSetPage(page + 1)}
                disabled={page === movieInfoPagination.totalPage}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default ShowTimes;