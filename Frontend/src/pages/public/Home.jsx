import "../../css/home.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { movieService } from "../../services/movieService";
import { useEffect, useState } from "react";

import LoadingSkeleton from "../../components/LoadingSkeleton";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Banner() {
  const history = useHistory();

  const [listMovieBanner, setListMovieBanner] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(false);
  const [movieBannerChoosing, setMovieBannerChoosing] = useState({});
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const convertFormatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchMovieBanner = async () => {
      try {
        setLoadingBanner(true);
        const data = await movieService.getListMovieBanner(1, 5, {});
        setListMovieBanner(data);
        if (data.length > 0) {
          setCurrentBannerIndex(0);
          setMovieBannerChoosing(data[0]);
        }
        setLoadingBanner(false);
      } catch (err) {
        console.log("Không thể tải danh sách banner phim");
        setLoadingBanner(false);
      }
    };
    fetchMovieBanner();
  }, []);

  useEffect(() => {
    if (!listMovieBanner || listMovieBanner.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => {
        const nextIndex = prev === listMovieBanner.length - 1 ? 0 : prev + 1;
        setMovieBannerChoosing(listMovieBanner[nextIndex]);
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [listMovieBanner]);

  const renderBanner = () => {
    if (loadingBanner) {
      return <LoadingSkeleton count={5} />;
    }

    return (
      <section
        key={movieBannerChoosing?.movieID}
        className="home-hero fade-anim"
        style={{ backgroundImage: `url(${movieBannerChoosing?.bannerUrl})` }}
      >
        <div className="home-hero__overlay" />
        <div className="home-hero__content">
          <Link
            to={`/detailMovie/${movieBannerChoosing?.movieID}`}
            className="home-hero__title"
          >
            {movieBannerChoosing?.title}
          </Link>
          <p className="home-hero__author mt-4">
            {movieBannerChoosing?.listDirector?.map((it) => it.name).join(", ")}
          </p>
          <div className="home-hero__meta mt-4">
            Ngày khởi chiếu:{" "}
            {convertFormatDate(movieBannerChoosing?.releaseDate)}
          </div>
          <div className="home-hero__tags mt-1">
            <span>Thể loại: </span>
            {movieBannerChoosing?.listGenre?.map((it) => (
              <span
                className="home-hero__tag ms-3"
                key={it.genreID}
                onClick={() => {
                  history.push("/showTimes", { genre: it.genreID });
                }}
              >
                {it.name}
              </span>
            ))}
          </div>
          <p className="home-hero__desc mt-5">
            {movieBannerChoosing?.description}
          </p>
          <Link
            to={`/detailMovie/${movieBannerChoosing?.movieID}`}
            className="home-hero__play mt-5"
          >
            <i className="fas fa-calendar-plus"></i>
          </Link>
        </div>

        <div className="home-hero__thumbs">
          {listMovieBanner?.map((item) => (
            <img
              src={item.posterUrl}
              alt=""
              className={`home-hero__thumb ${
                item.movieID === movieBannerChoosing?.movieID
                  ? "home-hero__thumb--active"
                  : ""
              }`}
              key={item.movieID}
              onClick={() => {
                setMovieBannerChoosing(item);
                const index = listMovieBanner.findIndex(
                  (it) => it.movieID === item.movieID,
                );
                setCurrentBannerIndex(index);
              }}
            />
          ))}
        </div>
      </section>
    );
  };

  return renderBanner();
}

function Home() {
  const history = useHistory();

  const [listMovieUs, setListMovieUs] = useState([]);
  const [loadingListMovieUs, setLoadingListMovieUs] = useState(false);
  const [indexElementMovieUs, setIndexElementMovieUs] = useState(0);

  const [listMovieFrance, setListMovieFrance] = useState([]);
  const [loadingListMovieFrance, setLoadingListMovieFrance] = useState(false);
  const [indexElementMovieFrance, setIndexElementMovieFrance] = useState(0);

  const [listMovieChina, setListMovieChina] = useState([]);
  const [loadingListMovieChina, setLoadingListMovieChina] = useState(false);
  const [indexElementMovieChina, setIndexElementMovieChina] = useState(0);

  const [listMovieAction, setListMovieAction] = useState([]);
  const [loadingListMovieAction, setLoadingListMovieAction] = useState(false);

  const [listMovieMystery, setListMovieMystery] = useState([]);
  const [loadingListMovieMystery, setLoadingListMovieMystery] = useState(false);

  const [listMovieAnimation, setListMovieAnimation] = useState([]);
  const [loadingListMovieAnimation, setLoadingListMovieAnimation] =
    useState(false);

  const convertFormatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const increaseIndexElement = (setIndexElement) => {
    setIndexElement((prev) => prev + 1);
  };

  const decreaseIndexElement = (setIndexElement) => {
    setIndexElement((prev) => prev - 1);
  };

  const isAppearPreviousButton = (indexElement) => {
    return indexElement > 0;
  };

  const isAppearNextButton = (indexElement, length) => {
    return indexElement < length - 3;
  };

  useEffect(() => {
    const fetchListMovieUs = async () => {
      try {
        setLoadingListMovieUs(true);
        const data = await movieService.getListMovieByCountry(1, 6, {
          country: "United States of America",
        });
        setListMovieUs(data);
        setLoadingListMovieUs(false);
      } catch (err) {
        console.log("Không thể tải danh sách phim Us");
        setLoadingListMovieUs(false);
      }
    };
    fetchListMovieUs();
  }, []);

  useEffect(() => {
    const fetchListMovieFrance = async () => {
      try {
        setLoadingListMovieFrance(true);
        const data = await movieService.getListMovieByCountry(1, 6, {
          country: "France",
        });
        setListMovieFrance(data);
        setLoadingListMovieFrance(false);
      } catch (err) {
        console.log("Không thể tải danh sách phim France");
        setLoadingListMovieFrance(false);
      }
    };
    fetchListMovieFrance();
  }, []);

  useEffect(() => {
    const fetchListMovieChina = async () => {
      try {
        setLoadingListMovieChina(true);
        const data = await movieService.getListMovieByCountry(1, 6, {
          country: "China",
        });
        setListMovieChina(data);
        setLoadingListMovieChina(false);
      } catch (err) {
        console.log("Không thể tải danh sách phim China");
        setLoadingListMovieChina(false);
      }
    };
    fetchListMovieChina();
  }, []);

  const renderListMovieByCountry = (
    loadingListMovieByCountry,
    indexElementMovieByCountry,
    setIndexElementMovieByCountry,
    listMovieByMovie,
  ) => {
    if (loadingListMovieByCountry) {
      return (
        <div className="col-12">
          <LoadingSkeleton count={3} />
        </div>
      );
    }

    return (
      <>
        {isAppearPreviousButton(indexElementMovieByCountry) && (
          <button
            className="home-section__btn home-section__btn-left-position"
            onClick={() => decreaseIndexElement(setIndexElementMovieByCountry)}
          >
            ‹
          </button>
        )}

        <div className="slider-container">
          <div
            className="slider-track"
            style={{
              transform: `translateX(-${
                indexElementMovieByCountry * (100 / 3)
              }%)`,
            }}
          >
            {listMovieByMovie?.map((item) => (
              <div className="slider-item" key={item.movieID}>
                <div className="home-card__wrap">
                  <Link to={`/detailMovie/${item.movieID}`}>
                    <img
                      src={item.bannerUrl}
                      alt=""
                      className="home-card__img"
                    />
                  </Link>
                  <div className="home-card__badges">
                    <span className="home-card__badge">
                      {convertFormatDate(item.releaseDate)}
                    </span>
                  </div>
                  <span className="home-card__ep home-card__ep--soon">
                    {item.status.name}
                  </span>
                </div>
                <Link to={`/detailMovie/${item.movieID}`}>
                  <p className="home-card__name">{item.title}</p>
                </Link>
                <p className="home-card__sub">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {isAppearNextButton(
          indexElementMovieByCountry,
          listMovieByMovie.length,
        ) && (
          <button
            className="home-section__btn home-section__btn-right-position"
            onClick={() => increaseIndexElement(setIndexElementMovieByCountry)}
          >
            ›
          </button>
        )}
      </>
    );
  };

  useEffect(() => {
    const fetchListMovieAction = async () => {
      try {
        setLoadingListMovieAction(true);
        const data = await movieService.getListMovieByGenre(1, 4, {
          genreName: "Action",
        });
        setListMovieAction(data);
        setLoadingListMovieAction(false);
      } catch (err) {
        console.log("Không thể tải danh sách phim Action");
        setLoadingListMovieAction(false);
      }
    };
    fetchListMovieAction();
  }, []);

  const renderListMovieAction = () => {
    if (loadingListMovieAction) {
      return (
        <div className="col-12">
          <LoadingSkeleton count={4} />
        </div>
      );
    }

    return listMovieAction.map((item) => (
      <div
        className="col-6 col-md-4 col-lg-3 home-card--cinema mb-4"
        key={item.movieID}
      >
        <div className="home-card__wrap">
          <Link to={`/detailMovie/${item.movieID}`}>
            <img src={item.bannerUrl} alt="" className="home-card__banner" />
          </Link>
        </div>
        <div className="home-card__bottom">
          <div className="home-card__poster-wrap">
            <Link to={`/detailMovie/${item.movieID}`}>
              <img src={item.posterUrl} alt="" className="home-card__poster" />
            </Link>
            <span className="home-card__poster-badge">
              {`${new Date(item.releaseDate).getDate()}/${
                new Date(item.releaseDate).getMonth() + 1
              }`}
            </span>
          </div>
          <div className="home-card__info">
            <Link to={`/detailMovie/${item.movieID}`}>
              <p className="home-card__name">{item.title}</p>
            </Link>
            <p className="home-card__sub">
              <span>{item.title}</span>
            </p>
            <p className="home-card__meta">
              {item.productionYear}
              <span className="home-card__dot" />
              {item.ageRating}+
            </p>
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    const fetchListMovieMystery = async () => {
      try {
        setLoadingListMovieMystery(true);
        const data = await movieService.getListMovieByGenre(1, 6, {
          genreName: "Mystery",
        });
        setListMovieMystery(data);
        setLoadingListMovieMystery(false);
      } catch (err) {
        console.log("Không thể tải danh sách phim Mystery");
        setLoadingListMovieMystery(false);
      }
    };
    fetchListMovieMystery();
  }, []);

  const renderListMovieMystery = () => {
    if (loadingListMovieMystery) {
      return (
        <div className="col-12">
          <LoadingSkeleton count={6} />
        </div>
      );
    }

    return listMovieMystery.map((item) => (
      <div
        className="col-6 col-md-4 col-lg-2 home-card--portrait mb-4"
        key={item.movieID}
      >
        <div className="home-card__wrap">
          <Link to={`/detailMovie/${item.movieID}`}>
            <img src={item.posterUrl} alt="" className="home-card__img" />
          </Link>
          <span className="home-card__ep home-card__ep--soon">
            {item.status.name}
          </span>
        </div>
        <Link to={`/detailMovie/${item.movieID}`}>
          <p className="home-card__name">{item.title}</p>
        </Link>
        <p className="home-card__sub">{item.title}</p>
      </div>
    ));
  };

  useEffect(() => {
    const fetchListMovieAnimation = async () => {
      try {
        setLoadingListMovieAnimation(true);
        const data = await movieService.getListMovieByGenre(1, 4, {
          genreName: "Animation",
        });
        setListMovieAnimation(data);
        setLoadingListMovieAnimation(false);
      } catch (err) {
        console.log("Không thể tải danh sách phim Animation");
        setLoadingListMovieAnimation(false);
      }
    };
    fetchListMovieAnimation();
  }, []);

  const renderListMovieAnimation = () => {
    if (loadingListMovieAnimation) {
      return (
        <div className="col-12">
          <LoadingSkeleton count={4} />
        </div>
      );
    }

    return listMovieAnimation.map((item) => (
      <div
        className="col-6 col-md-4 col-lg-3 home-card--upcoming mb-4"
        key={item.movieID}
      >
        <div className="home-card__wrap">
          <Link to={`/detailMovie/${item.movieID}`}>
            <img src={item.bannerUrl} alt="" className="home-card__img" />
          </Link>
          <span className="home-card__ep home-card__ep--soon">
            {item.status.name}
          </span>
        </div>
        <Link to={`/detailMovie/${item.movieID}`}>
          <p className="home-card__name">{item.title}</p>
        </Link>
        <p className="home-card__sub">
          <span>{item.title}</span>
        </p>
      </div>
    ));
  };

  return (
    <>
      <Header />

      <div className="home">
        {/* HERO BANNER */}
        <Banner />

        <div className="home-body">
          {/* SECTION: PHIM THEO QUỐC GIA */}
          <section className="container-fluid home-section--grid">
            <div className="row home-section-style-1">
              {/* Phim US-UK */}
              <div className="country-section mb-5">
                <div className="country-section__header">
                  <h2 className="home-section__title home-section__title--blue-purple">
                    Phim US-UK Mới
                  </h2>
                  <span
                    className="home-section__view-all"
                    onClick={() => {
                      history.push("/showTimes", {
                        countryId: "dafc4bc2-016d-4473-8b23-8978071edbb8",
                      });
                    }}
                  >
                    {"Xem toàn bộ  >"}
                  </span>
                </div>
                <div className="country-section__slider position-relative">
                  {renderListMovieByCountry(
                    loadingListMovieUs,
                    indexElementMovieUs,
                    setIndexElementMovieUs,
                    listMovieUs,
                  )}
                </div>
              </div>

              {/* Phim Pháp */}
              <div className="country-section mb-5">
                <div className="country-section__header">
                  <h2 className="home-section__title home-section__title--pink">
                    Phim Pháp Mới
                  </h2>
                  <span
                    className="home-section__view-all"
                    onClick={() => {
                      history.push("/showTimes", {
                        countryId: "e2c70990-2378-48f6-adf8-11c432521988",
                      });
                    }}
                  >
                    {"Xem toàn bộ  >"}
                  </span>
                </div>
                <div className="country-section__slider position-relative">
                  {renderListMovieByCountry(
                    loadingListMovieFrance,
                    indexElementMovieFrance,
                    setIndexElementMovieFrance,
                    listMovieFrance,
                  )}
                </div>
              </div>

              {/* Phim Trung Quốc */}
              <div className="country-section">
                <div className="country-section__header">
                  <h2 className="home-section__title home-section__title--orange-yellow">
                    Phim Trung Quốc Mới
                  </h2>
                  <span
                    className="home-section__view-all"
                    onClick={() => {
                      history.push("/showTimes", {
                        countryId: "521f062f-9ecc-44a0-b8c2-87e107b912bf",
                      });
                    }}
                  >
                    {"Xem toàn bộ  >"}
                  </span>
                </div>
                <div className="country-section__slider position-relative">
                  {renderListMovieByCountry(
                    loadingListMovieChina,
                    indexElementMovieChina,
                    setIndexElementMovieChina,
                    listMovieChina,
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: HÀNH ĐỘNG */}
          <section className="container-fluid home-section mb-5">
            <div className="home-section__head mb-5">
              <h2 className="home-section__title">
                Mãn Nhãn với Phim Hành Động
              </h2>
              <button
                className="home-section__btn-light"
                onClick={() => {
                  history.push("/showTimes", {
                    genre: "8705125b-3220-409d-942b-b5b83ac10c3f",
                  });
                }}
              >
                ›
              </button>
            </div>
            <div className="row">{renderListMovieAction()}</div>
          </section>

          {/* SECTION: BÍ ẨN */}
          <section className="container-fluid home-section mt-5 mb-5">
            <div className="home-section__head mb-5">
              <h2 className="home-section__title">Cân Não với Phim Bí Ẩn</h2>
              <button
                className="home-section__btn-light"
                onClick={() => {
                  history.push("/showTimes", {
                    genre: "821bc833-e2f9-4ba0-b803-5334d6485769",
                  });
                }}
              >
                ›
              </button>
            </div>
            <div className="row">{renderListMovieMystery()}</div>
          </section>

          {/* SECTION: HOẠT HÌNH */}
          <section className="container-fluid home-section">
            <div className="home-section__head mb-5">
              <h2 className="home-section__title">
                Thế Giới Hoạt Hình Đầy Màu Sắc
              </h2>
              <button
                className="home-section__btn-light"
                onClick={() => {
                  history.push("/showTimes", {
                    genre: "561ed82e-aaef-4670-914c-c631b47292d1",
                  });
                }}
              >
                ›
              </button>
            </div>
            <div className="row">{renderListMovieAnimation()}</div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
