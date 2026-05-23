import "../../css/managementMovie.css";
import "../../css/pagination.css";

import MovieModal from "../../components/MovieModal";

import { useEffect, useState } from "react";

import { movieService } from "../../services/movieService";
import { genreService } from "../../services/genreService";
import { statusService } from "../../services/statusService";

import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

function ManagementMovie() {
  const [openMovieModal, setOpenMovieModal] = useState(false);
  const [title, setTitle] = useState("");
  const [titleButton, setTitleButton] = useState("");
  const [initInfo, setInitInfo] = useState("");

  const [countLoading, setCountLoading] = useState(0);

  const [listMovie, setListMovie] = useState([]);
  const [listGenre, setListGenre] = useState([]);
  const [listStatus, setListStatus] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [movieInfoPagination, setMovieInfoPagination] = useState({});

  const [inputSearch, setInputSearch] = useState("");

  const totalPage = movieInfoPagination.totalPage;

  const [filter, setFilter] = useState({
    genre: "all",
    status: "all",
    keyword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        const [listGenre, listStatus] = await Promise.all([
          genreService.getListGenre(),
          statusService.getListStatus(),
        ]);

        setListGenre(listGenre);
        setListStatus(listStatus);
        stopLoading();
      } catch (err) {
        alert("Loading dữ liệu thất bại");
        stopLoading();
      }
    };
    fetchData();
  }, []);

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

  const renderClassStatus = (status) => {
    if (status === "Sắp chiếu") {
      return "dashboard-content__management-movie-status--upcoming";
    }
    if (status === "Đã kết thúc") {
      return "dashboard-content__management-movie-status--ended";
    }
    if (status === "Đang chiếu") {
      return "dashboard-content__management-movie-status--showing";
    }

    return "";
  };

  const handleDeleteMovie = async (id) => {
    try {
      if (window.confirm("Bạn có chắc muốn xóa phim?")) {
        startLoading();
        const result = await movieService.deleteMovie(id);
        setListMovie(
          listMovie.filter((item) => item.movieID !== result.movieID)
        );
        stopLoading();
        alert("Xóa phim thành công");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Xóa phim thất bại");
      stopLoading();
    }
  };

  const renderListMovie = () => {
    return listMovie.map((item) => (
      <tr key={item.movieID}>
        <td>
          <div className="dashboard-content__management-movie-poster-cell">
            <div className="dashboard-content__management-movie-poster">
              <img src={item.posterUrl} alt="" />
            </div>
            <div>
              <div className="dashboard-content__management-movie-movie-name">
                {item.title}
              </div>
              <div className="dashboard-content__management-movie-movie-year">
                {item.productionYear}
              </div>
            </div>
          </div>
        </td>
        <td>
          {item.listGenre.map((item) => (
            <div key={item.genreID}>{item.name}</div>
          ))}
        </td>
        <td>
          {item.listDirector.map((item) => (
            <div key={item.directorID}>{item.name}</div>
          ))}
        </td>
        <td>{item.duration} phút</td>
        <td>{item.country.name}</td>
        <td>
          <span
            className={`dashboard-content__management-movie-status ${renderClassStatus(
              item.status.name
            )}`}
          >
            {item.status.name}
          </span>
        </td>
        <td>
          <div className="dashboard-content__management-movie-actions">
            <button
              className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--outline dashboard-content__management-movie-btn--sm dashboard-content__management-movie-btn--icon-only"
              title="Xem chi tiết"
            >
              <i className="fa-solid fa-eye"></i>
            </button>
            <button
              className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--outline dashboard-content__management-movie-btn--sm dashboard-content__management-movie-btn--icon-only"
              title="Sửa"
              onClick={() => {
                setOpenMovieModal(true);
                setTitle({
                  icon: "🔧",
                  content: "Cập nhật phim",
                });
                setTitleButton({
                  icon: "📝",
                  content: "Cập nhật",
                  id: item.movieID,
                });
                setInitInfo({
                  title: item.title,
                  listChoosingDirector: [...item.listDirector],
                  listChoosingGenre: [...item.listGenre],
                  listChoosingActor: [...item.listActor],
                  listChoosingLanguage: [...item.listLanguage],
                  country: { ...item.country },
                  status: { ...item.status },
                  productionYear: item.productionYear,
                  releaseDate: item.releaseDate,
                  duration: item.duration,
                  ageRating: item.ageRating,
                  poster: null,
                  trailer: null,
                  posterUrl: item.posterUrl,
                  trailerUrl: item.trailerUrl,
                  description: item.description,
                  loading: false,
                });
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--danger dashboard-content__management-movie-btn--sm dashboard-content__management-movie-btn--icon-only"
              title="Xóa"
              onClick={() => handleDeleteMovie(item.movieID)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const countStatus = (status) => {
    const element = movieInfoPagination.listGroupbyStatus?.find(
      (e) => e.name === status
    );
    if (element) {
      return element.total;
    }
    return 0;
  };

  const handleSetPage = (page) => {
    setPage(page);
    fetchMovie(page);
  };

  useEffect(() => {
    setPage(1);
    fetchMovie(1);
  }, [filter]);

  const startLoading = () => setCountLoading((prev) => prev + 1);
  const stopLoading = () => setCountLoading((prev) => prev - 1);

  const handleSearch = () => {
    if (inputSearch.trim() !== "") {
      setFilter({
        ...filter,
        keyword: inputSearch,
      });
    } else {
      alert("Vui lòng nhập từ khóa");
    }
  };

  const handleClearFilter = () => {
    setFilter({
      genre: "all",
      status: "all",
      keyword: "",
    });

    setInputSearch("");
  };

  console.log(listMovie);

  return (
    <>
      <div className="dashboard-content__management-movie">
        {/* Header */}
        <div className="dashboard-content__management-movie-header">
          <div>
            <h1 className="dashboard-content__management-movie-title">
              Quản Lý Phim
            </h1>
            <p className="dashboard-content__management-movie-subtitle">
              Tổng hợp và quản lý toàn bộ danh sách phim trên hệ thống
            </p>
          </div>
          <button
            className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--primary"
            onClick={() => {
              setOpenMovieModal(true);
              setTitle({
                icon: "➕",
                content: "Thêm phim mới",
              });
              setTitleButton({
                icon: "💾",
                content: "Lưu phim",
              });
              setInitInfo({
                title: null,
                listChoosingDirector: [],
                listChoosingGenre: [],
                listChoosingActor: [],
                listChoosingLanguage: [],
                country: null,
                status: null,
                productionYear: null,
                releaseDate: null,
                duration: null,
                ageRating: null,
                poster: null,
                trailer: null,
                description: null,
                loading: false,
              });
            }}
          >
            ➕ Thêm phim mới
          </button>
        </div>

        {/* Stats */}
        <div className="dashboard-content__management-movie-stats">
          <div className="dashboard-content__management-movie-stat-card">
            <div className="dashboard-content__management-movie-stat-icon dashboard-content__management-movie-stat-icon--blue">
              <i className="fa-solid fa-film"></i>
            </div>
            <div>
              <div className="dashboard-content__management-movie-stat-label">
                Tổng phim
              </div>
              <div className="dashboard-content__management-movie-stat-value">
                {movieInfoPagination.totalMovie}
              </div>
            </div>
          </div>
          <div className="dashboard-content__management-movie-stat-card">
            <div className="dashboard-content__management-movie-stat-icon dashboard-content__management-movie-stat-icon--orange">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
            <div>
              <div className="dashboard-content__management-movie-stat-label">
                Sắp chiếu
              </div>
              <div className="dashboard-content__management-movie-stat-value">
                {countStatus("Sắp chiếu")}
              </div>
            </div>
          </div>

          <div className="dashboard-content__management-movie-stat-card">
            <div className="dashboard-content__management-movie-stat-icon dashboard-content__management-movie-stat-icon--green">
              <i className="fa-solid fa-circle-play"></i>
            </div>
            <div>
              <div className="dashboard-content__management-movie-stat-label">
                Đang chiếu
              </div>
              <div className="dashboard-content__management-movie-stat-value">
                {countStatus("Đang chiếu")}
              </div>
            </div>
          </div>

          <div className="dashboard-content__management-movie-stat-card">
            <div className="dashboard-content__management-movie-stat-icon dashboard-content__management-movie-stat-icon--red">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <div className="dashboard-content__management-movie-stat-label">
                Đã kết thúc
              </div>
              <div className="dashboard-content__management-movie-stat-value">
                {countStatus("Đã kết thúc")}
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="dashboard-content__management-movie-toolbar">
          <div className="dashboard-content__management-movie-search-wrap">
            <span className="dashboard-content__management-movie-search-icon">
              🔍
            </span>
            <input
              type="text"
              className="dashboard-content__management-movie-search"
              placeholder="Tìm kiếm tên phim, diễn viên"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            />
          </div>

          <button
            className="dashboard-content__management-movie-search-button"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>

          <button
            className="dashboard-content__management-movie-clear-filter-button"
            onClick={handleClearFilter}
          >
            Xóa bộ lọc
          </button>

          <select
            className="dashboard-content__management-movie-filter-select"
            onChange={(e) => {
              setFilter({
                ...filter,
                genre: e.target.value,
              });
            }}
          >
            <option value="all">Tất cả thể loại</option>
            {listGenre.map((item) => (
              <option key={item.genreID} value={item.genreID}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            className="dashboard-content__management-movie-filter-select"
            onChange={(e) => {
              setFilter({
                ...filter,
                status: e.target.value,
              });
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            {listStatus.map((item) => (
              <option key={item.statusID} value={item.statusID}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="dashboard-content__management-movie-table-wrap">
          <table className="dashboard-content__management-movie-table">
            <thead>
              <tr>
                <th>Phim</th>
                <th>Thể loại</th>
                <th>Đạo diễn</th>
                <th>Thời lượng</th>
                <th>Quốc gia</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>{renderListMovie()}</tbody>
          </table>

          <Pagination
            currentPage={page}
            totalPage={totalPage}
            totalItem={movieInfoPagination.totalMovie}
            pageSize={pageSize}
            onPageChange={handleSetPage}
            nameList={"phim"}
          />
        </div>
      </div>

      {openMovieModal && (
        <MovieModal
          setOpenMovieModal={setOpenMovieModal}
          actionModal={{
            title: title,
            titleButton: titleButton,
            initInfo: initInfo,
          }}
          setListMovie={setListMovie}
          listMovie={listMovie}
        />
      )}

      {countLoading > 0 && <Loading />}
    </>
  );
}

export default ManagementMovie;
