import "../css/detailMovie.css";
import defaultAvatar from "../image/default_avatar.jpg";

import { useParams, Link } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";

import { movieService } from "../services/movieService";
import { showTimeService } from "../services/showTimeService";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function RenderShowTime({ id, listShowTime, setListShowTime}) {
  const [listDate, setListDate] = useState([]);
  const [filter, setFilter] = useState({ date: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListDate = async () => {
      try {
        setLoading(true);
        const result = await showTimeService.getListGroupByShowTimeByMovie(id);
        setListDate(result);
        if (result.length > 0) {
          setFilter({ date: result[0].date });
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Load ngày chiếu thất bại");
        setLoading(false);
      }
    };
    fetchListDate();
  }, []);

  useEffect(() => {
    if (filter?.date) {
      fetchListShowTime();
    }
  }, [filter]);

  const fetchListShowTime = async () => {
    try {
      setLoading(true);
      const result = await showTimeService.getListShowTimeByMovie(id, filter);
      setListShowTime(result);
      setLoading(false);
    } catch (error) {
      // alert(error.response?.data?.message || "Load lịch chiếu thất bại"); /error
      setLoading(false);
    }
  };

  const renderShowTime = () => {
    if (listDate?.length === 0)
      return <p className="dm-showtime-empty">Hiện tại không có suất chiếu.</p>;

    return (
      <>
        <div className="dm-date-tabs mb-3">
          {listDate?.map((item, index) => (
            <button
              className={`dm-date-tab ${filter?.date === item.date ? "dm-date-tab--active" : ""}`}
              key={index}
              onClick={() => setFilter({ date: item.date })}
            >
              {new Date(item.date).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </button>
          ))}
        </div>

        {listShowTime?.map((item) => (
          <div className="dm-showtime-cinema mb-3" key={item.cinema.cinemaID}>
            <p className="dm-showtime-cinema__name">{item.cinema.name}</p>
            <div className="row g-2">
              {item.listShowTime?.map((st) => (
                <div className="col-auto" key={st.showTimeID}>
                  <div className="dm-showtime-btn">
                    {new Date(st.startTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      {renderShowTime()}
      {loading && <Loading />}
    </>
  );
}

function DetailMovie() {
  const { id } = useParams();
  const history = useHistory();

  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const [listShowTime, setListShowTime] = useState([]);

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

  const getUserId = () => {
    return JSON.parse(localStorage.getItem("user"))?.userId;
  };

  const renderAgeClass = (ageRating) => {
    if (ageRating >= 16 && ageRating < 18) return "st-badge--age--16";
    if (ageRating >= 18) return "st-badge--age--18";
    return "st-badge--age--all";
  };

  const convertFormatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang chiếu": return "dm-status-active";
      case "Đã kết thúc": return "dm-status-ended";
      case "Sắp chiếu": return "dm-status-coming";
      default: return "";
    }
  };

  const renderMovie = () => {
    if (loading) return <Loading />;

    if (Object.keys(movie).length !== 0) {
      return (
        <>
          <Header />

          {/* ── HERO BANNER ── */}
          <section
            className="dm-hero"
            style={{ backgroundImage: `url(${movie.bannerUrl})` }}
          >
            <div className="dm-hero__overlay" />
            <div className="dm-hero__content container-fluid">
              <div className="row align-items-end h-100">
                {/* Poster — ẩn trên mobile */}
                <div className="col-lg-2 col-md-3 d-none d-md-block">
                  <div className="dm-poster">
                    <img src={movie.posterUrl} alt="poster" className="dm-poster__img" />
                  </div>
                </div>

                {/* Title block */}
                <div className="col-lg-10 col-md-9 col-12">
                  <div className="dm-hero__info">
                    {/* Mobile: poster nhỏ + title cùng hàng */}
                    <div className="dm-hero__mobile-top d-flex d-md-none align-items-end gap-3 mb-2">
                      <img src={movie.posterUrl} alt="poster" className="dm-poster__img--mobile" />
                      <div className="flex-1">
                        <h1 className="dm-hero__title">{movie.title}</h1>
                        <p className="dm-hero__original-title">{movie.title}</p>
                      </div>
                    </div>

                    {/* Desktop title */}
                    <h1 className="dm-hero__title d-none d-md-block">{movie.title}</h1>
                    <p className="dm-hero__original-title mt-2 d-none d-md-block">{movie.title}</p>

                    <div className="dm-hero__genres mb-2 mt-3">
                      {movie.listGenre.map((item) => (
                        <span
                          key={item.genreID}
                          className="dm-genre-tag"
                          onClick={() => history.push("/showTimes", { genre: item.genreID })}
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>

                    <div className="dm-hero__meta mt-3">
                      <span className="dm-meta-item">
                        <i className="fas fa-clock me-2"></i>{movie.duration} phút
                      </span>
                      <span className="dm-meta-dot" />
                      <span className="dm-meta-item">{movie.productionYear}</span>
                      <span className="dm-meta-dot" />
                      <span className="dm-meta-item">
                        <i className="fas fa-globe me-2"></i>{movie.country.name}
                      </span>
                      <span className="dm-meta-dot" />
                      <span className={`dm-meta-age ${renderAgeClass(movie.ageRating)}`}>
                        {movie.ageRating}+
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── BODY ── */}
          <div className="dm-body">
            <div className="container-fluid">

              {/* ── BOOKING BAR ── */}
              <div className="row dm-booking-bar align-items-center mb-4">
                <div className="col-lg-7 col-md-6">
                  <div className="dm-score-row"></div>
                </div>
                <div className="col-lg-5 col-md-6 col-12 d-flex justify-content-end justify-content-md-end mt-2 mt-md-0">
                  <button
                    className="dm-btn dm-btn--primary dm-btn--book-full"
                    onClick={() => {
                      if (getUserId()) {
                        if(listShowTime.length > 0) {
                          history.push(`/booking/${id}`);
                        }
                        else {
                          alert("Hiện tại không có suất chiếu");
                        }
                      } else {
                        history.push("/login");
                      }
                    }}
                  >
                    <i className="fas fa-ticket-alt me-2"></i>Đặt Vé Ngay
                  </button>
                </div>
              </div>

              <div className="row g-4">
                {/* ── CỘT TRÁI ── */}
                <div className="col-lg-8">
                  {/* Nội dung phim */}
                  <div className="dm-section mb-4">
                    <h3 className="dm-section__title">Nội Dung Phim</h3>
                    <p className={`dm-desc ${!showFullDesc ? "dm-desc--clamped" : ""}`}>
                      {movie.description}
                    </p>
                    <button
                      className="dm-toggle-desc"
                      onClick={() => setShowFullDesc((p) => !p)}
                    >
                      {showFullDesc ? "Thu gọn ▲" : "Xem thêm ▼"}
                    </button>
                  </div>

                  {/* Diễn viên */}
                  <div className="dm-section mb-4">
                    <h3 className="dm-section__title">Diễn Viên</h3>
                    <div className="row g-2">
                      {movie.listActor.map((item) => (
                        <div className="col-6 col-sm-4 col-md-3" key={item.actorID}>
                          <div
                            className="dm-actor-item"
                            onClick={() => history.push("/showTimes", { keyword: item.name })}
                          >
                            <div className="dm-actor-item__avatar">
                              <img src={defaultAvatar} alt="" />
                            </div>
                            <div>
                              <p className="dm-actor-item__name">{item.name}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trailer */}
                  <div className="dm-section mb-4">
                    <h3 className="dm-section__title">Trailer</h3>
                    <div className="dm-trailer">
                      <iframe
                        className="dm-trailer__frame"
                        src={movie.trailerUrl.replace("watch?v=", "embed/")}
                        title="Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Sidebar trên mobile — chèn vào đây */}
                  <div className="d-lg-none">
                    <div className="dm-sidebar-card mb-4">
                      <h4 className="dm-sidebar-card__title">
                        <i className="fas fa-calendar-alt me-2"></i>Lịch Chiếu
                      </h4>
                      <RenderShowTime id={id} />
                    </div>

                    <div className="dm-sidebar-card mb-4">
                      <h4 className="dm-sidebar-card__title">
                        <i className="fas fa-info-circle me-2"></i>Thông Tin Chi Tiết
                      </h4>
                      <div className="dm-info-list">
                        <div className="row dm-info-row">
                          <div className="col-5"><span className="dm-info-label">Đạo diễn</span></div>
                          <div className="col-7">{movie.listDirector.map((i) => i.name).join(", ")}</div>
                        </div>
                        <div className="row dm-info-row">
                          <div className="col-5"><span className="dm-info-label">Quốc gia</span></div>
                          <div className="col-7"><span className="dm-info-value">{movie.country.name}</span></div>
                        </div>
                        <div className="row dm-info-row">
                          <div className="col-5"><span className="dm-info-label">Ngôn ngữ</span></div>
                          <div className="col-7">{movie.listLanguage.map((i) => i.name).join(", ")}</div>
                        </div>
                        <div className="row dm-info-row">
                          <div className="col-5"><span className="dm-info-label">Khởi chiếu</span></div>
                          <div className="col-7"><span className="dm-info-value">{convertFormatDate(movie.releaseDate)}</span></div>
                        </div>
                        <div className="row dm-info-row">
                          <div className="col-5"><span className="dm-info-label">Thời lượng</span></div>
                          <div className="col-7"><span className="dm-info-value">{movie.duration} phút</span></div>
                        </div>
                        <div className="row dm-info-row">
                          <div className="col-5"><span className="dm-info-label">Giới hạn tuổi</span></div>
                          <div className="col-7">
                            <span className={`dm-meta-age ${renderAgeClass(movie.ageRating)}`}>{movie.ageRating}+</span>
                          </div>
                        </div>
                        <div className="row dm-info-row">
                          <div className="col-5"><span className="dm-info-label">Trạng thái</span></div>
                          <div className="col-7">
                            <span className={`dm-status-badge ${getStatusClass(movie.status.name)}`}>
                              {movie.status.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── CỘT PHẢI — chỉ hiện trên lg+ ── */}
                <div className="col-lg-4 d-none d-lg-block">
                  <div className="dm-sidebar-card mb-4">
                    <h4 className="dm-sidebar-card__title">
                      <i className="fas fa-calendar-alt me-2"></i>Lịch Chiếu
                    </h4>
                    <RenderShowTime id={id} listShowTime={listShowTime} setListShowTime={setListShowTime} />
                  </div>

                  <div className="dm-sidebar-card mb-4">
                    <h4 className="dm-sidebar-card__title">
                      <i className="fas fa-info-circle me-2"></i>Thông Tin Chi Tiết
                    </h4>
                    <div className="dm-info-list">
                      <div className="row dm-info-row">
                        <div className="col-5"><span className="dm-info-label">Đạo diễn</span></div>
                        <div className="col-7">{movie.listDirector.map((i) => i.name).join(", ")}</div>
                      </div>
                      <div className="row dm-info-row">
                        <div className="col-5"><span className="dm-info-label">Quốc gia</span></div>
                        <div className="col-7"><span className="dm-info-value">{movie.country.name}</span></div>
                      </div>
                      <div className="row dm-info-row">
                        <div className="col-5"><span className="dm-info-label">Ngôn ngữ</span></div>
                        <div className="col-7">{movie.listLanguage.map((i) => i.name).join(", ")}</div>
                      </div>
                      <div className="row dm-info-row">
                        <div className="col-5"><span className="dm-info-label">Khởi chiếu</span></div>
                        <div className="col-7"><span className="dm-info-value">{convertFormatDate(movie.releaseDate)}</span></div>
                      </div>
                      <div className="row dm-info-row">
                        <div className="col-5"><span className="dm-info-label">Thời lượng</span></div>
                        <div className="col-7"><span className="dm-info-value">{movie.duration} phút</span></div>
                      </div>
                      <div className="row dm-info-row">
                        <div className="col-5"><span className="dm-info-label">Giới hạn tuổi</span></div>
                        <div className="col-7">
                          <span className={`dm-meta-age ${renderAgeClass(movie.ageRating)}`}>{movie.ageRating}+</span>
                        </div>
                      </div>
                      <div className="row dm-info-row">
                        <div className="col-5"><span className="dm-info-label">Trạng thái</span></div>
                        <div className="col-7">
                          <span className={`dm-status-badge ${getStatusClass(movie.status.name)}`}>
                            {movie.status.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
          {loading && <Loading />}
        </>
      );
    }

    return <></>;
  };

  return <>{renderMovie()}</>;
}

export default DetailMovie;