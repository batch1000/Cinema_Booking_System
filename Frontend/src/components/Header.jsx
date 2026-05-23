import { useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

import "../css/header.css";
import logoWeb from "../image/logo_web.png";
import avatar from "../image/default_avatar.jpg";

import { genreService } from "../services/genreService";
import { countryService } from "../services/countryService";

function Header() {
  const history = useHistory();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [listGenre, setListGenre] = useState([]);
  const [listCountry, setListCountry] = useState([]);

  const dropdownGenreRef = useRef(null);
  const dropdownCountryRef = useRef(null);
  const [genreDropdown, setGenreDropdown] = useState(false);
  const [countryDropdown, setCountryDropdown] = useState(false);

  // ── Mobile state (thêm mới, không đụng logic cũ) ──
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);
  const [mobileCountryOpen, setMobileCountryOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownGenreRef.current &&
        !dropdownGenreRef.current.contains(event.target)
      ) {
        setGenreDropdown(false);
      }

      if (
        dropdownCountryRef.current &&
        !dropdownCountryRef.current.contains(event.target)
      ) {
        setCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listGenre, listCountry] = await Promise.all([
          genreService.getListGenre(),
          countryService.getListCountry(),
        ]);

        setListGenre(listGenre);
        setListCountry(listCountry);
      } catch (err) {
        alert("Loading dữ liệu thất bại");
      }
    };
    fetchData();
  }, []);

  const renderMember = () => {
    if (user) {
      return (
        <div className="header__user">
          <img src={avatar} alt="" className="header__user-avatar" />
          <span className="header__user-name">{user.name}</span>
          <i className="fa-solid fa-caret-down header__user-name-icon-caret"></i>
          <div className="header__user-dropdown">
            <div className="header__user-dropdown-info">
              <div className="header__user-dropdown-username">{user.name}</div>
            </div>
            <Link to="/myBooking" className="header__user-dropdown-item">
              Vé của tôi
            </Link>
            <Link
              to="/login"
              className="header__user-dropdown-item header__user-dropdown-item--logout"
              onClick={handleLogout}
            >
              Đăng xuất
            </Link>
          </div>
        </div>
      );
    }

    return (
      <Link to="/login" className="header__member-btn">
        <i className="fa-solid fa-user header__member-btn-icon-user"></i>
        <span className="header__member-btn-text">Thành viên</span>
      </Link>
    );
  };

  const renderListGenre = () => {
    return listGenre.map((item) => (
      <div
        className="header__dropdown-grid-item"
        key={item.genreID}
        onClick={() => {
          history.push("/showTimes", { genre: item.genreID });
        }}
      >
        {item.name}
      </div>
    ));
  };

  const renderListCountry = () => {
    return listCountry.map((item) => (
      <div
        className="header__dropdown-grid-item"
        key={item.countryID}
        onClick={() => {
          history.push("/showTimes", { countryId: item.countryID });
        }}
      >
        {item.name}
      </div>
    ));
  };

  // ── Mobile render (thêm mới) ──
  const renderListGenreMobile = () => {
    return listGenre.map((item) => (
      <div
        className="header__mobile-submenu-item"
        key={item.genreID}
        onClick={() => {
          setMobileMenuOpen(false);
          history.push("/showTimes", { genre: item.genreID });
        }}
      >
        {item.name}
      </div>
    ));
  };

  const renderListCountryMobile = () => {
    return listCountry.map((item) => (
      <div
        className="header__mobile-submenu-item"
        key={item.countryID}
        onClick={() => {
          setMobileMenuOpen(false);
          history.push("/showTimes", { countryId: item.countryID });
        }}
      >
        {item.name}
      </div>
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <>
      <header className="header__wrapper">
        <div className="header__inner">
          {/* ── Logo ── */}
          <Link to="/" className="header__logo">
            <img src={logoWeb} alt="RoPhim" className="header__logo-img" />
          </Link>

          {/* ── Search (desktop) ── */}
          <div className="header__search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              className="header__search-input"
              placeholder="Tìm kiếm phim, diễn viên"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  history.push("/showTimes", { keyword: e.target.value });
                }
              }}
            />
          </div>

          {/* ── Nav (desktop) ── */}
          <nav className="header__nav">
            <Link to="/" className="header__nav-link">
              Trang chủ
            </Link>

            <Link to="/showTimes" className="header__nav-link">
              Lịch chiếu
            </Link>

            <div className="header__nav-dropdown" ref={dropdownGenreRef}>
              <span
                className="header__nav-link header__nav-link--arrow"
                onClick={() => {
                  setGenreDropdown(!genreDropdown);
                }}
              >
                Thể Loại
                <i className="fa-solid fa-caret-down ms-2"></i>
              </span>

              {genreDropdown && (
                <div className="header__dropdown-menu--grid">
                  <div className="header__dropdown-grid">
                    {renderListGenre()}
                  </div>
                </div>
              )}
            </div>

            <div className="header__nav-dropdown" ref={dropdownCountryRef}>
              <span
                className="header__nav-link header__nav-link--arrow"
                onClick={() => {
                  setCountryDropdown(!countryDropdown);
                }}
              >
                Quốc gia
                <i className="fa-solid fa-caret-down ms-2"></i>
              </span>

              {countryDropdown && (
                <div className="header__dropdown-menu--grid">
                  <div className="header__dropdown-grid">
                    {renderListCountry()}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ── Member ── */}
          {renderMember()}

          {/* ── Hamburger (mobile) ── */}
          <div
            className="header__hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="header__hamburger-line" />
            <span className="header__hamburger-line" />
            <span className="header__hamburger-line" />
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="header__mobile-menu header__mobile-menu--open">
          {/* Search mobile */}
          <div className="header__mobile-search">
            <i className="fas fa-search" style={{ color: "#888" }}></i>
            <input
              type="text"
              className="header__mobile-search-input"
              placeholder="Tìm kiếm phim, diễn viên"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMobileMenuOpen(false);
                  history.push("/showTimes", { keyword: e.target.value });
                }
              }}
            />
          </div>

          <Link
            to="/"
            className="header__mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trang chủ
          </Link>

          <Link
            to="/showTimes"
            className="header__mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Lịch chiếu
          </Link>

          {/* Thể Loại accordion */}
          <div
            className={`header__mobile-nav-toggle ${
              mobileGenreOpen ? "header__mobile-nav-toggle--open" : ""
            }`}
            onClick={() => setMobileGenreOpen(!mobileGenreOpen)}
          >
            <span>Thể Loại</span>
            <i className="fa-solid fa-caret-down"></i>
          </div>
          <div
            className={`header__mobile-submenu ${
              mobileGenreOpen ? "header__mobile-submenu--open" : ""
            }`}
          >
            {renderListGenreMobile()}
          </div>

          {/* Quốc Gia accordion */}
          <div
            className={`header__mobile-nav-toggle ${
              mobileCountryOpen ? "header__mobile-nav-toggle--open" : ""
            }`}
            onClick={() => setMobileCountryOpen(!mobileCountryOpen)}
          >
            <span>Quốc gia</span>
            <i className="fa-solid fa-caret-down"></i>
          </div>
          <div
            className={`header__mobile-submenu ${
              mobileCountryOpen ? "header__mobile-submenu--open" : ""
            }`}
          >
            {renderListCountryMobile()}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;