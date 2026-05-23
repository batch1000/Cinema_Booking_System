import "../css/managementMovie.css";

import { useState, useReducer, useEffect, useRef } from "react";
import { genreService } from "../services/genreService";
import { directorService } from "../services/directorService";
import { actorService } from "../services/actorService";
import { languageService } from "../services/languageService";
import { countryService } from "../services/countryService";
import { statusService } from "../services/statusService";
import { movieService } from "../services/movieService";

import ManagementAttributeMovieModal from "./ManagementAttributeMovieModal";
import Loading from "./Loading";
import loadingGif from "../image/loading.gif";

const movieReducer = (state, action) => {
  switch (action.type) {
    case "SET_TITLE":
      return {
        ...state,
        title: action.payload,
      };

    case "SET_DURATION":
      return {
        ...state,
        duration: action.payload,
      };

    case "SET_RELEASE_DATE":
      return {
        ...state,
        releaseDate: action.payload,
      };

    case "SET_LIST_GENRE":
      return {
        ...state,
        listChoosingGenre: action.payload,
      };

    case "SET_LIST_DIRECTOR":
      return {
        ...state,
        listChoosingDirector: action.payload,
      };

    case "SET_LIST_ACTOR":
      return {
        ...state,
        listChoosingActor: action.payload,
      };

    case "SET_LIST_LANGUAGE":
      return {
        ...state,
        listChoosingLanguage: action.payload,
      };

    case "SET_COUNTRY":
      return {
        ...state,
        country: action.payload,
      };

    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    case "SET_AGE_RATING":
      return {
        ...state,
        ageRating: action.payload,
      };

    case "SET_PRODUCTION_YEAR":
      return {
        ...state,
        productionYear: action.payload,
      };

    case "SET_POSTER":
      return {
        ...state,
        poster: action.payload,
      };

    case "SET_TRAILER":
      return {
        ...state,
        trailer: action.payload,
      };

    case "SET_DESCRIPTION":
      return {
        ...state,
        description: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "CLEAR":
      return {
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
      };

    default:
      return state;
  }
};

const setInfo = (type, payload) => {
  return {
    type,
    payload,
  };
};

function MovieModal({
  setOpenMovieModal,
  actionModal,
  listMovie,
  setListMovie,
}) {
  const getInitInfo = (original) => {
    const { posterUrl, trailerUrl, ...initInfo } = original;
    return initInfo;
  };

  const [state, dispatch] = useReducer(
    movieReducer,
    getInitInfo(actionModal.initInfo)
  );
  // console.log(state);

  const [loadingGenre, setLoadingGenre] = useState(false);
  const [openGenreModal, setOpenGenreModal] = useState(false);
  const [genreSelect, setGenreSelect] = useState(false);
  const [listGenre, setListGenre] = useState([]);
  const [searchGenreInput, setSearchGenreInput] = useState("");

  const [loadingDirector, setLoadingDirector] = useState(false);
  const [openDirectorModal, setOpenDirectorModal] = useState(false);
  const [directorSelect, setDirectorSelect] = useState(false);
  const [listDirector, setListDirector] = useState([]);
  const [searchDirectorInput, setSearchDirectorInput] = useState("");

  const [loadingActor, setLoadingActor] = useState(false);
  const [openActorModal, setOpenActorModal] = useState(false);
  const [actorSelect, setActorSelect] = useState(false);
  const [listActor, setListActor] = useState([]);
  const [searchActorInput, setSearchActorInput] = useState("");

  const [loadingLanguage, setLoadingLanguage] = useState(false);
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [languageSelect, setLanguageSelect] = useState(false);
  const [listLanguage, setListLanguage] = useState([]);
  const [searchLanguageInput, setSearchLanguageInput] = useState("");

  const [loadingCountry, setLoadingCountry] = useState(false);
  const [listCountry, setListCountry] = useState([]);
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [countrySelect, setCountrySelect] = useState(false);
  const [searchCountryInput, setSearchCountryInput] = useState("");

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [listStatus, setListStatus] = useState([]);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusSelect, setStatusSelect] = useState(false);
  const [searchStatusInput, setSearchStatusInput] = useState("");

  const inputFileRef = useRef(null);
  const [previewImg, setPreviewImg] = useState(null);

  const inputVideoRef = useRef(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    fetchGenre();
    fetchDirector();
    fetchActor();
    fetchLanguage();
    fetchCountry();
    fetchStatus();
  }, []);

  const fetchGenre = async () => {
    try {
      setLoadingGenre(true);

      const data = await genreService.getListGenre();
      setListGenre(data);

      setLoadingGenre(false);
    } catch (err) {
      alert("Không thể tải danh sách thể loại");
      setLoadingGenre(false);
    }
  };

  const fetchDirector = async () => {
    try {
      setLoadingDirector(true);

      const data = await directorService.getListDirector();
      setListDirector(data);

      setLoadingDirector(false);
    } catch (err) {
      alert("Không thể tải danh sách đạo diễn");
      setLoadingDirector(false);
    }
  };

  const fetchActor = async () => {
    try {
      setLoadingActor(true);

      const data = await actorService.getListActor();
      setListActor(data);

      setLoadingActor(false);
    } catch (err) {
      alert("Không thể tải danh sách diễn viên");
      setLoadingActor(false);
    }
  };

  const fetchLanguage = async () => {
    try {
      setLoadingLanguage(true);

      const data = await languageService.getListLanguage();
      setListLanguage(data);

      setLoadingLanguage(false);
    } catch (err) {
      alert("Không thể tải danh sách ngôn ngữ");
      setLoadingLanguage(false);
    }
  };

  const fetchCountry = async () => {
    try {
      setLoadingCountry(true);

      const data = await countryService.getListCountry();
      setListCountry(data);

      setLoadingCountry(false);
    } catch (err) {
      alert("Không thể tải danh sách quốc gia");
      setLoadingCountry(false);
    }
  };

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);

      const data = await statusService.getListStatus();
      setListStatus(data);

      setLoadingStatus(false);
    } catch (err) {
      alert("Không thể tải danh sách trạng thái");
      setLoadingStatus(false);
    }
  };

  const normalizeVietnamese = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD") // tách dấu ra
      .replace(/[\u0300-\u036f]/g, "") // xoá dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .trim();
  };

  const isInputChecked = (obj, arr, keyAttribute) => {
    return arr.some((item) => item[keyAttribute.id] === obj[keyAttribute.id]);
  };

  const renderListAttribute = (renderObject) => {
    return renderObject.listAttribute
      .filter((item) =>
        normalizeVietnamese(item.name).includes(
          normalizeVietnamese(renderObject.searchAttributeInput)
        )
      )
      .map((item) => (
        <label
          className="multi-select-dropdown__item"
          key={item[renderObject.keyAttribute.id]}
        >
          <input
            type="checkbox"
            checked={isInputChecked(
              item,
              renderObject.listChoosingAttribute,
              renderObject.keyAttribute
            )}
            onChange={(e) => {
              if (e.target.checked) {
                dispatch(
                  setInfo(renderObject.typeActionListChoosingAttribute, [
                    ...renderObject.listChoosingAttribute,
                    item,
                  ])
                );
              } else {
                dispatch(
                  setInfo(
                    renderObject.typeActionListChoosingAttribute,
                    renderObject.listChoosingAttribute.filter(
                      (obj) =>
                        obj[renderObject.keyAttribute.id] !==
                        item[renderObject.keyAttribute.id]
                    )
                  )
                );
              }
            }}
          />{" "}
          {item[renderObject.keyAttribute.name]}
        </label>
      ));
  };

  const renderAttribute = (renderObject) => {
    return (
      <>
        <div className="multi-select-dropdown">
          <div
            className="multi-select-dropdown__trigger"
            tabIndex="0"
            onClick={() =>
              renderObject.setAttributeSelect(!renderObject.attributeSelect)
            }
          >
            <span className="multi-select-dropdown__placeholder">
              -- Chọn {renderObject.title} --
            </span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>

          {renderObject.attributeSelect && (
            <div className="multi-select-dropdown__list">
              <div className="multi-select-dropdown__search-wrap">
                <i className="fa-solid fa-magnifying-glass multi-select-dropdown__search-icon"></i>
                <input
                  type="text"
                  className="multi-select-dropdown__search"
                  placeholder={`Tìm ${renderObject.title}...`}
                  value={renderObject.searchAttributeInput}
                  onChange={(e) =>
                    renderObject.setSearchAttributeInput(e.target.value)
                  }
                />
              </div>

              <div className="multi-select-dropdown__options">
                {renderListAttribute(renderObject)}
              </div>

              <div
                className="multi-select-dropdown__add-btn"
                onClick={() => renderObject.setOpenAttributeModal(true)}
              >
                <i className="fa-solid fa-plus"></i> Quản lý{" "}
                {renderObject.title}
              </div>
            </div>
          )}
        </div>

        <div className="multi-select-dropdown__tags">
          {renderObject.listChoosingAttribute.map((item) => (
            <span
              className="multi-select-dropdown__tag"
              key={item[renderObject.keyAttribute.id]}
            >
              {item[renderObject.keyAttribute.name]}{" "}
              <button
                onClick={() =>
                  dispatch(
                    setInfo(
                      renderObject.typeActionListChoosingAttribute,
                      renderObject.listChoosingAttribute.filter(
                        (obj) =>
                          obj[renderObject.keyAttribute.id] !==
                          item[renderObject.keyAttribute.id]
                      )
                    )
                  )
                }
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </>
    );
  };

  const renderInfo = (renderObject) => {
    return renderObject.loadingAttribute
      ? renderTextLoading(`Đang tải ${renderObject.title}`)
      : renderAttribute(renderObject);
  };

  const renderTextLoading = (content) => {
    return (
      <h1 className="dashboard-loading-component">
        {content}
        <img
          src={loadingGif}
          alt="loading"
          className="dashboard-loading-component__gif"
        />
      </h1>
    );
  };

  const renderSingleDropdown = (renderObject) => {
    return (
      <div className="single-select-dropdown__list">
        <div className="multi-select-dropdown__search-wrap">
          <i className="fa-solid fa-magnifying-glass multi-select-dropdown__search-icon"></i>
          <input
            type="text"
            className="multi-select-dropdown__search"
            placeholder={`Tìm ${renderObject.title}...`}
            value={renderObject.searchAttributeInput}
            onChange={(e) =>
              renderObject.setSearchAttributeInput(e.target.value)
            }
          />
        </div>

        <div className="multi-select-dropdown__options">
          {renderObject.list
            .filter((item) =>
              normalizeVietnamese(item[renderObject.attribute.name]).includes(
                normalizeVietnamese(renderObject.searchAttributeInput)
              )
            )
            .map((item) => {
              return (
                <div
                  className={`single-select-dropdown__item ${
                    renderObject.choosingAttribute?.[
                      renderObject.attribute.id
                    ] === item[renderObject.attribute.id]
                      ? "single-select-dropdown__item--selected"
                      : ""
                  }`}
                  key={item[renderObject.attribute.id]}
                  onClick={() => {
                    dispatch(
                      setInfo(renderObject.typeActionChoosingAttribute, item)
                    );
                    renderObject.setAttributeSelect(
                      !renderObject.attributeSelect
                    );
                    renderObject.setSearchAttributeInput("");
                  }}
                >
                  {renderObject.choosingAttribute?.[
                    renderObject.attribute.id
                  ] === item[renderObject.attribute.id] && (
                    <i className="fa-solid fa-check single-select-dropdown__check"></i>
                  )}
                  {item[renderObject.attribute.name]}
                </div>
              );
            })}
        </div>

        <div
          className="multi-select-dropdown__add-btn"
          onClick={() => renderObject.setOpenAttributeModal(true)}
        >
          <i className="fa-solid fa-plus"></i> Quản lý {renderObject.title}
        </div>
      </div>
    );
  };

  const renderInputSingleDropdown = (renderObject) => {
    return (
      <div className="single-select-dropdown">
        <div
          className="single-select-dropdown__trigger"
          tabIndex="0"
          onClick={() =>
            renderObject.setAttributeSelect(!renderObject.attributeSelect)
          }
        >
          {renderObject.choosingAttribute === null ? (
            <span className="single-select-dropdown__placeholder">
              -- Chọn {renderObject.title} --
            </span>
          ) : (
            <span className="single-select-dropdown__value">
              {renderObject.choosingAttribute[renderObject.attribute.name]}
            </span>
          )}

          <i className="fa-solid fa-chevron-down"></i>
        </div>

        {renderObject.attributeSelect && renderSingleDropdown(renderObject)}
      </div>
    );
  };

  const renderInfoSingleInput = (renderObject) => {
    return renderObject.loadingAttribute
      ? renderTextLoading(`Đang tải ${renderObject.title}`)
      : renderInputSingleDropdown(renderObject);
  };

  useEffect(() => {
    return () => {
      if (previewImg) {
        URL.revokeObjectURL(previewImg);
      }
    };
  }, [previewImg]);

  useEffect(() => {
    return () => {
      if (previewVideo) {
        URL.revokeObjectURL(previewVideo);
      }
    };
  }, [previewVideo]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };

  const renderPoster = () => {
    if (state.poster === null && actionModal.initInfo.posterUrl === undefined) {
      return (
        <div className="dashboard-content__management-movie-form-group dashboard-content__management-movie-form-group--full">
          <label className="dashboard-content__management-movie-form-label">
            Poster phim
          </label>

          <div
            className="dashboard-content__management-movie-upload-area"
            onClick={() => inputFileRef.current.click()}
          >
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              style={{ display: "none" }}
              ref={inputFileRef}
              onChange={(e) => {
                dispatch(setInfo("SET_POSTER", e.target.files[0]));
                setPreviewImg(URL.createObjectURL(e.target.files[0]));
              }}
            />

            <div className="dashboard-content__management-movie-upload-icon">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>

            <p className="dashboard-content__management-movie-upload-text">
              <strong>Nhấn để tải lên</strong> hoặc kéo thả file vào đây
            </p>
            <p className="dashboard-content__management-movie-upload-sub">
              PNG, JPG tối đa 5MB
            </p>
          </div>
        </div>
      );
    } else {
      if (state.poster?.size > 5 * 1024 * 1024) {
        alert("Kích thước file không vượt quá 5 MB");
        dispatch(setInfo("SET_POSTER", null));
        setPreviewImg("");
        return;
      }

      return (
        <div className="dashboard-content__management-movie-form-group dashboard-content__management-movie-form-group--full">
          <label className="dashboard-content__management-movie-form-label">
            Poster phim
          </label>

          <div className="dashboard-content__management-movie-poster-preview-wrap">
            <div className="dashboard-content__management-movie-poster-preview-wrap-image">
              <img
                className="dashboard-content__management-movie-poster-preview-img"
                src={previewImg || actionModal.initInfo.posterUrl}
                alt="poster preview"
              />
            </div>

            <div className="dashboard-content__management-movie-poster-preview-overlay">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                style={{ display: "none" }}
                ref={inputFileRef}
                onChange={(e) => {
                  dispatch(setInfo("SET_POSTER", e.target.files[0]));
                  setPreviewImg(URL.createObjectURL(e.target.files[0]));
                }}
              />

              <div
                className="dashboard-content__management-movie-poster-preview-btn dashboard-content__management-movie-poster-preview-btn--change"
                onClick={() => inputFileRef.current.click()}
              >
                <i className="fa-solid fa-arrow-up-from-bracket"></i> Đổi ảnh
              </div>

              <button
                className="dashboard-content__management-movie-poster-preview-btn dashboard-content__management-movie-poster-preview-btn--remove"
                onClick={() => {
                  dispatch(setInfo("SET_POSTER", null));
                  setPreviewImg("");
                  if (actionModal.initInfo.posterUrl) {
                    actionModal.initInfo.posterUrl = undefined;
                  }
                }}
              >
                <i className="fa-solid fa-trash"></i> Xoá
              </button>
            </div>
          </div>

          <div className="dashboard-content__management-movie-poster-preview-meta">
            <span className="dashboard-content__management-movie-poster-preview-filename">
              {state.poster?.name || ""}
            </span>
            <span className="dashboard-content__management-movie-poster-preview-filesize">
              {state.poster && formatFileSize(state.poster.size)}
            </span>
          </div>
        </div>
      );
    }
  };

  const renderTrailer = () => {
    if (
      state.trailer === null &&
      actionModal.initInfo.trailerUrl === undefined
    ) {
      return (
        <div className="dashboard-content__management-movie-form-group dashboard-content__management-movie-form-group--full">
          <label className="dashboard-content__management-movie-form-label">
            Trailer phim
          </label>

          <div
            className="dashboard-content__management-movie-upload-area"
            onClick={() => inputVideoRef.current.click()}
          >
            <input
              type="file"
              accept="video/mp4"
              style={{ display: "none" }}
              ref={inputVideoRef}
              onChange={(e) => {
                dispatch(setInfo("SET_TRAILER", e.target.files[0]));
                setPreviewVideo(URL.createObjectURL(e.target.files[0]));
              }}
            />

            <div className="dashboard-content__management-movie-upload-icon">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>

            <p className="dashboard-content__management-movie-upload-text">
              <strong>Nhấn để tải lên</strong> hoặc kéo thả file vào đây
            </p>
            <p className="dashboard-content__management-movie-upload-sub">
              MP4 tối đa 10MB
            </p>
          </div>
        </div>
      );
    } else {
      if (state.trailer?.size > 10 * 1024 * 1024) {
        alert("Kích thước file không vượt quá 10 MB");
        dispatch(setInfo("SET_TRAILER", null));
        setPreviewVideo("");
        return;
      }

      const trailerUrl = previewVideo || actionModal.initInfo.trailerUrl;
      const isYoutube = trailerUrl?.includes("youtube.com");

      return (
        <div className="dashboard-content__management-movie-form-group dashboard-content__management-movie-form-group--full">
          <label className="dashboard-content__management-movie-form-label">
            Trailer phim
          </label>

          {/* ---- CHỈ SỬA TỪ ĐÂY XUỐNG ---- */}
          <div className="dashboard-content__management-movie-trailer-preview-wrap">
            {isYoutube ? (
              <iframe
                className="dashboard-content__management-movie-trailer-preview-video"
                src={trailerUrl.replace("watch?v=", "embed/")}
                allowFullScreen
                title="Movie trailer"
              />
            ) : (
              <video
                className="dashboard-content__management-movie-trailer-preview-video"
                src={trailerUrl}
                controls 
                autoPlay={false} 
                loop={false}
              />
            )}

            <div className="dashboard-content__management-movie-trailer-preview-overlay">
              <input
                type="file"
                accept="video/mp4"
                style={{ display: "none" }}
                ref={inputVideoRef}
                onChange={(e) => {
                  dispatch(setInfo("SET_TRAILER", e.target.files[0]));
                  setPreviewVideo(URL.createObjectURL(e.target.files[0]));
                }}
              />

              <div
                className="dashboard-content__management-movie-poster-preview-btn dashboard-content__management-movie-poster-preview-btn--change"
                onClick={() => inputVideoRef.current.click()}
              >
                <i className="fa-solid fa-arrow-up-from-bracket"></i> Đổi video
              </div>

              <button
                className="dashboard-content__management-movie-poster-preview-btn dashboard-content__management-movie-poster-preview-btn--remove"
                onClick={() => {
                  dispatch(setInfo("SET_TRAILER", null));
                  setPreviewVideo("");
                  if (actionModal.initInfo.trailerUrl) {
                    actionModal.initInfo.trailerUrl = undefined;
                  }
                }}
              >
                <i className="fa-solid fa-trash"></i> Xoá
              </button>
            </div>
          </div>

          <div className="dashboard-content__management-movie-poster-preview-meta">
            <span className="dashboard-content__management-movie-poster-preview-filename">
              {state.trailer?.name}
            </span>
            <span className="dashboard-content__management-movie-poster-preview-filesize">
              {state.trailer && formatFileSize(state.trailer.size)}
            </span>
          </div>
        </div>
      );
    }
  };

  const handleAddMovie = async () => {
    const formData = new FormData();
    let objectData = {};
    let unValidInfo = null;

    Object.entries(state).forEach(([key, value]) => {
      if (key !== "loading") {
        if (value === null || (Array.isArray(value) && value.length === 0)) {
          if (unValidInfo === null) {
            unValidInfo = key;
          }
        } else {
          objectData[key] = value;
        }
      }
    });

    if (unValidInfo !== null) {
      const fieldLabels = {
        title: "Tên phim",
        releaseDate: "Ngày khởi chiếu",
        description: "Mô tả",
        duration: "Thời lượng",
        listChoosingGenre: "Thể loại",
        listChoosingDirector: "Đạo diễn",
        listChoosingActor: "Diễn viên",
        listChoosingLanguage: "Ngôn ngữ",
        country: "Quốc gia",
        status: "Trạng thái",
        ageRating: "Độ tuổi",
        productionYear: "Năm sản xuất",
        poster: "Poster",
        trailer: "Trailer",
      };

      alert(`Vui lòng nhập thông tin ${fieldLabels[unValidInfo]}`);
    } else {
      const {
        country,
        status,
        listChoosingActor,
        listChoosingDirector,
        listChoosingGenre,
        listChoosingLanguage,
        ...rest
      } = objectData;

      const data = {
        ...rest,
        countryId: country.countryID,
        statusId: status.statusID,
        listActorId: listChoosingActor.map((item) => item.actorID),
        listDirectorId: listChoosingDirector.map((item) => item.directorID),
        listGenreId: listChoosingGenre.map((item) => item.genreID),
        listLanguageId: listChoosingLanguage.map((item) => item.languageID),
      };

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });

      try {
        dispatch(setInfo("SET_LOADING", true));
        await movieService.createMovie(formData);
        alert("Tạo phim thành công");
        dispatch(setInfo("SET_LOADING", false));
        dispatch({ type: "CLEAR" });
      } catch (err) {
        console.log(err);
        alert(err.response?.data?.message || "Tạo phim thất bại");
        dispatch(setInfo("SET_LOADING", false));
      }
    }
  };

  const handleUpdateMovie = async (movieID) => {
    const { posterUrl, trailerUrl, ...initInfo } = actionModal.initInfo;
    if (JSON.stringify(initInfo) === JSON.stringify(state)) {
      alert("Không có gì thay đổi");
    } else {
      const {
        loading,
        country,
        status,
        listChoosingActor,
        listChoosingDirector,
        listChoosingGenre,
        listChoosingLanguage,
        ...rest
      } = state;

      const data = {
        ...rest,
        countryId: country.countryID,
        statusId: status.statusID,
        listActorId: listChoosingActor.map((item) => item.actorID),
        listDirectorId: listChoosingDirector.map((item) => item.directorID),
        listGenreId: listChoosingGenre.map((item) => item.genreID),
        listLanguageId: listChoosingLanguage.map((item) => item.languageID),
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });

      try {
        dispatch(setInfo("SET_LOADING", true));
        const result = await movieService.updateMovie(movieID, formData);
        setListMovie(
          listMovie.map((item) => {
            if (item.movieID === result.movieID) {
              return result;
            }
            return item;
          })
        );
        dispatch(setInfo("SET_LOADING", false));
        alert("Cập nhật phim thành công");
      } catch (err) {
        alert(err.response?.data?.message || "Cập nhật phim thất bại");
        dispatch(setInfo("SET_LOADING", false));
      }
    }
  };

  return (
    <>
      <div className="dashboard-content__management-movie-modal-overlay">
        <div className="dashboard-content__management-movie-modal">
          <div className="dashboard-content__management-movie-modal-header">
            <h2 className="dashboard-content__management-movie-modal-title">
              <span className="dashboard-content__management-movie-modal-title-icon">
                {actionModal.title.icon}
              </span>
              {actionModal.title.content}
            </h2>
            <button
              className="dashboard-content__management-movie-modal-close"
              onClick={() => setOpenMovieModal(false)}
            >
              ✕
            </button>
          </div>

          <div className="dashboard-content__management-movie-modal-body">
            <div className="dashboard-content__management-movie-form-grid">
              {/* Tên phim */}
              <div className="dashboard-content__management-movie-form-group dashboard-content__management-movie-form-group--full">
                <label className="dashboard-content__management-movie-form-label">
                  Tên phim <span>*</span>
                </label>
                <input
                  type="text"
                  className="dashboard-content__management-movie-form-input"
                  placeholder="Nhập tên phim..."
                  value={state.title || ""}
                  onChange={(e) =>
                    dispatch(setInfo("SET_TITLE", e.target.value))
                  }
                />
              </div>

              {/* Đạo diễn */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Đạo diễn <span>*</span>
                </label>

                {renderInfo({
                  title: "đạo diễn",
                  loadingAttribute: loadingDirector,
                  attributeSelect: directorSelect,
                  setAttributeSelect: setDirectorSelect,
                  searchAttributeInput: searchDirectorInput,
                  setSearchAttributeInput: setSearchDirectorInput,
                  listAttribute: listDirector,
                  keyAttribute: {
                    id: "directorID",
                    name: "name",
                  },
                  listChoosingAttribute: state.listChoosingDirector,
                  typeActionListChoosingAttribute: "SET_LIST_DIRECTOR",
                  setOpenAttributeModal: setOpenDirectorModal,
                })}
              </div>

              {/* Thể loại */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Thể loại <span>*</span>
                </label>

                {renderInfo({
                  title: "thể loại",
                  loadingAttribute: loadingGenre,
                  attributeSelect: genreSelect,
                  setAttributeSelect: setGenreSelect,
                  searchAttributeInput: searchGenreInput,
                  setSearchAttributeInput: setSearchGenreInput,
                  listAttribute: listGenre,
                  keyAttribute: {
                    id: "genreID",
                    name: "name",
                  },
                  listChoosingAttribute: state.listChoosingGenre,
                  typeActionListChoosingAttribute: "SET_LIST_GENRE",
                  setOpenAttributeModal: setOpenGenreModal,
                })}
              </div>

              {/* Diễn viên */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Diễn viên <span>*</span>
                </label>

                {renderInfo({
                  title: "diễn viên",
                  loadingAttribute: loadingActor,
                  attributeSelect: actorSelect,
                  setAttributeSelect: setActorSelect,
                  searchAttributeInput: searchActorInput,
                  setSearchAttributeInput: setSearchActorInput,
                  listAttribute: listActor,
                  keyAttribute: {
                    id: "actorID",
                    name: "name",
                  },
                  listChoosingAttribute: state.listChoosingActor,
                  typeActionListChoosingAttribute: "SET_LIST_ACTOR",
                  setOpenAttributeModal: setOpenActorModal,
                })}
              </div>

              {/* Ngôn ngữ */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Ngôn ngữ
                </label>
                {renderInfo({
                  title: "ngôn ngữ",
                  loadingAttribute: loadingLanguage,
                  attributeSelect: languageSelect,
                  setAttributeSelect: setLanguageSelect,
                  searchAttributeInput: searchLanguageInput,
                  setSearchAttributeInput: setSearchLanguageInput,
                  listAttribute: listLanguage,
                  keyAttribute: {
                    id: "languageID",
                    name: "name",
                  },
                  listChoosingAttribute: state.listChoosingLanguage,
                  typeActionListChoosingAttribute: "SET_LIST_LANGUAGE",
                  setOpenAttributeModal: setOpenLanguageModal,
                })}
              </div>

              {/* Quốc gia */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Quốc gia <span>*</span>
                </label>

                {renderInfoSingleInput({
                  title: "quốc gia",
                  list: listCountry,
                  attribute: {
                    id: "countryID",
                    name: "name",
                  },
                  setOpenAttributeModal: setOpenCountryModal,
                  loadingAttribute: loadingCountry,
                  setSearchAttributeInput: setSearchCountryInput,
                  searchAttributeInput: searchCountryInput,
                  choosingAttribute: state.country,
                  attributeSelect: countrySelect,
                  setAttributeSelect: setCountrySelect,
                  typeActionChoosingAttribute: "SET_COUNTRY",
                })}
              </div>

              {/* Trạng thái */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Trạng thái <span>*</span>
                </label>

                {renderInfoSingleInput({
                  title: "trạng thái",
                  list: listStatus,
                  attribute: {
                    id: "statusID",
                    name: "name",
                  },
                  setOpenAttributeModal: setOpenStatusModal,
                  loadingAttribute: loadingStatus,
                  setSearchAttributeInput: setSearchStatusInput,
                  searchAttributeInput: searchStatusInput,
                  choosingAttribute: state.status,
                  attributeSelect: statusSelect,
                  setAttributeSelect: setStatusSelect,
                  typeActionChoosingAttribute: "SET_STATUS",
                })}
              </div>

              {/* Năm sản xuất */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Năm sản xuất <span>*</span>
                </label>
                <input
                  type="number"
                  className="dashboard-content__management-movie-form-input"
                  placeholder="VD: 1992"
                  value={state.productionYear || ""}
                  onChange={(e) =>
                    dispatch(setInfo("SET_PRODUCTION_YEAR", e.target.value))
                  }
                />
              </div>

              {/* Ngày khởi chiếu */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Ngày khởi chiếu
                </label>
                <input
                  type="date"
                  className="dashboard-content__management-movie-form-input"
                  value={state.releaseDate || ""}
                  onChange={(e) =>
                    dispatch(setInfo("SET_RELEASE_DATE", e.target.value))
                  }
                />
              </div>

              {/* Thời lượng */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Thời lượng (phút)
                </label>
                <input
                  type="number"
                  className="dashboard-content__management-movie-form-input"
                  placeholder="VD: 120"
                  value={state.duration || ""}
                  onChange={(e) =>
                    dispatch(setInfo("SET_DURATION", e.target.value))
                  }
                />
              </div>

              {/* Độ tuổi */}
              <div className="dashboard-content__management-movie-form-group">
                <label className="dashboard-content__management-movie-form-label">
                  Độ tuổi
                </label>
                <input
                  type="number"
                  className="dashboard-content__management-movie-form-input"
                  placeholder="VD: 12, 16, 18"
                  value={state.ageRating || ""}
                  onChange={(e) =>
                    dispatch(setInfo("SET_AGE_RATING", e.target.value))
                  }
                />
              </div>

              {/* Poster */}
              {renderPoster()}

              {/* Trailer */}
              {renderTrailer()}

              {/* Mô tả */}
              <div className="dashboard-content__management-movie-form-group dashboard-content__management-movie-form-group--full">
                <label className="dashboard-content__management-movie-form-label">
                  Mô tả phim
                </label>
                <textarea
                  className="dashboard-content__management-movie-form-textarea"
                  placeholder="Nhập nội dung tóm tắt phim..."
                  value={state.description || ""}
                  onChange={(e) =>
                    dispatch(setInfo("SET_DESCRIPTION", e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          <div className="dashboard-content__management-movie-modal-footer">
            <button className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--outline">
              Hủy
            </button>
            <button
              className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--primary"
              onClick={() => {
                if (actionModal.title.content === "Thêm phim mới") {
                  handleAddMovie();
                }
                if (actionModal.title.content === "Cập nhật phim") {
                  handleUpdateMovie(actionModal.titleButton.id);
                }
              }}
            >
              {`${actionModal.titleButton.icon} ${actionModal.titleButton.content}`}
            </button>
          </div>
        </div>
      </div>

      {state.loading && <Loading />}

      {openGenreModal && (
        <ManagementAttributeMovieModal
          setOpenManagementInfoModal={setOpenGenreModal}
          action={{
            type: "thể loại",
            payload: {
              create: genreService.createGenre,
              update: genreService.updateGenre,
              delete: genreService.deleteGenre,
            },
          }}
          list={listGenre}
          setList={setListGenre}
          attributeList={{
            id: "genreID",
            name: "name",
          }}
        />
      )}

      {openDirectorModal && (
        <ManagementAttributeMovieModal
          setOpenManagementInfoModal={setOpenDirectorModal}
          action={{
            type: "đạo diễn",
            payload: {
              create: directorService.createDirector,
              update: directorService.updateDirector,
              delete: directorService.deleteDirector,
            },
          }}
          list={listDirector}
          setList={setListDirector}
          attributeList={{
            id: "directorID",
            name: "name",
          }}
        />
      )}

      {openActorModal && (
        <ManagementAttributeMovieModal
          setOpenManagementInfoModal={setOpenActorModal}
          action={{
            type: "diễn viên",
            payload: {
              create: actorService.createActor,
              update: actorService.updateActor,
              delete: actorService.deleteActor,
            },
          }}
          list={listActor}
          setList={setListActor}
          attributeList={{
            id: "actorID",
            name: "name",
          }}
        />
      )}

      {openLanguageModal && (
        <ManagementAttributeMovieModal
          setOpenManagementInfoModal={setOpenLanguageModal}
          action={{
            type: "ngôn ngữ",
            payload: {
              create: languageService.createLanguage,
              update: languageService.updateLanguage,
              delete: languageService.deleteLanguage,
            },
          }}
          list={listLanguage}
          setList={setListLanguage}
          attributeList={{
            id: "languageID",
            name: "name",
          }}
        />
      )}

      {openCountryModal && (
        <ManagementAttributeMovieModal
          setOpenManagementInfoModal={setOpenCountryModal}
          action={{
            type: "quốc gia",
            payload: {
              create: countryService.createCountry,
              update: countryService.updateCountry,
              delete: countryService.deleteCountry,
            },
          }}
          list={listCountry}
          setList={setListCountry}
          attributeList={{
            id: "countryID",
            name: "name",
          }}
        />
      )}

      {openStatusModal && (
        <ManagementAttributeMovieModal
          setOpenManagementInfoModal={setOpenStatusModal}
          action={{
            type: "trạng thái",
            payload: {
              create: statusService.createStatus,
              update: statusService.updateStatus,
              delete: statusService.deleteStatus,
            },
          }}
          list={listStatus}
          setList={setListStatus}
          attributeList={{
            id: "statusID",
            name: "name",
          }}
        />
      )}
    </>
  );
}

export default MovieModal;
