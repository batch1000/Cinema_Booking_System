import "../css/footer.css";
import logoWeb from "../image/logo_web.png";

import { Link} from "react-router-dom/cjs/react-router-dom.min";

function Footer() {
  return (
    <footer className="footer__wrapper">
      <div className="footer__inner">
        {/* ── Brand column ── */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src={logoWeb} alt="RoPhim" className="footer__logo-img" />
          </Link>
          <p className="footer__brand-desc">
            Trải nghiệm điện ảnh đỉnh cao ngay tại rạp chiếu phim của chúng tôi.
            Hệ thống âm thanh Dolby Atmos, màn hình 4K — nơi mỗi thước phim đều
            sống động.
          </p>
          <div className="footer__socials">
            <Link to="/" className="footer__social-btn" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </Link>
            <Link to="/" className="footer__social-btn" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </Link>
            <Link to="/" className="footer__social-btn" aria-label="TikTok">
              <i className="fa-brands fa-tiktok"></i>
            </Link>
            <Link to="/" className="footer__social-btn" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </Link>
          </div>
        </div>

        {/* ── Thể loại ── */}
        <div className="footer__col">
          <h4 className="footer__col-title">Thể Loại</h4>
          <ul className="footer__col-list">
            <li>
              <div className="footer__col-link">
                Hành Động
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Tình Cảm
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Kinh Dị
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Hài Hước
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Viễn Tưởng
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Hoạt Hình
              </div>
            </li>
          </ul>
        </div>

        {/* ── Dịch vụ ── */}
        <div className="footer__col">
          <h4 className="footer__col-title">Dịch Vụ</h4>
          <ul className="footer__col-list">
            <li>
              <div className="footer__col-link">
                Đặt Vé Online
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Combo Bắp Nước
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Thẻ Thành Viên
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Vé Nhóm & Doanh Nghiệp
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Phòng Chiếu VIP
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Ưu Đãi & Khuyến Mãi
              </div>
            </li>
          </ul>
        </div>

        {/* ── Hỗ trợ ── */}
        <div className="footer__col">
          <h4 className="footer__col-title">Hỗ Trợ</h4>
          <ul className="footer__col-list">
            <li>
              <div className="footer__col-link">
                Hệ Thống Rạp
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Hướng Dẫn Đặt Vé
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Chính Sách Hoàn Vé
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Liên Hệ
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Chính Sách Bảo Mật
              </div>
            </li>
            <li>
              <div className="footer__col-link">
                Điều Khoản Sử Dụng
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            © {new Date().getFullYear()}{" "}
            <span className="footer__copyright-brand">StarLight</span>. Tất cả
            quyền được bảo lưu.
          </p>
          <p className="footer__disclaimer">
            Hotline: <span className="footer__hotline">1900 6789</span> — Hỗ trợ
            24/7
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;