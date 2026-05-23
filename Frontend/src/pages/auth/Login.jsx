import "../../css/login.css";
import welcomeLogin from "../../image/icon_login.png";

import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

import Loading from "../../components/Loading";
import { authService } from "../../services/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      var loginInfo = { username, password };
      setLoading(true);
      const result = await authService.login(loginInfo);
      if (result) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify({
          userId: result.userId,
          name: result.name,
          role: result.role
        }))

        if(result.role === "Admin") {
          history.push("/dashboard/managementMovie");
        } else {
          history.push("/");
        }
        return;
      }
      setLoading(false);
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <div className="login">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-welcome">
            <div className="login-form-welcome-title">Xin chào</div>
            <div className="login-form-welcome-logo">
              <img src={welcomeLogin} alt="" />
            </div>
          </div>

          <div className="login-form-input-and-button">
            <div className="login-form-input-username">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="login-form-input-password">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={
                  showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                }
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <button type="submit" className="login-form-btn">
              Đăng nhập
            </button>
          </div>

          <div className="login-form-ask">
            Bạn chưa có tài khoản?{" "}
            <Link to="/signup">
              <span>Đăng ký</span>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
