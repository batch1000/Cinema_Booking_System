import "../../css/signup.css";
import signupImg from "../../image/image_signup.jpg";

import { Link, useHistory } from "react-router-dom";
import { useReducer, useState } from "react";

import { authService } from "../../services/authService";
import Loading from "../../components/Loading";

const initialState = {
  lastName: "",
  firstName: "",
  username: "",
  password: "",
  rePassword: "",
  email: "",
  phone: "",
  loading: false,
  emptyInput: [],
};

const signupReducer = (state, action) => {
  switch (action.type) {
    case "SET_FRIST_NAME":
      return {
        ...state,
        firstName: action.payload,
        emptyInput: state.emptyInput.filter((item) => item !== "firstName"),
      };

    case "SET_LAST_NAME":
      return {
        ...state,
        lastName: action.payload,
        emptyInput: state.emptyInput.filter((item) => item !== "lastName"),
      };

    case "SET_USERNAME":
      return {
        ...state,
        username: action.payload,
        emptyInput: state.emptyInput.filter((item) => item !== "username"),
      };

    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
        emptyInput: state.emptyInput.filter((item) => item !== "password"),
      };

    case "SET_REPASSWORD":
      return {
        ...state,
        rePassword: action.payload,
        emptyInput: state.emptyInput.filter((item) => item !== "rePassword"),
      };

    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
        emptyInput: state.emptyInput.filter((item) => item !== "email"),
      };

    case "SET_PHONE":
      return {
        ...state,
        phone: action.payload,
        emptyInput: state.emptyInput.filter((item) => item !== "phone"),
      };

    case "SET_EMPTY_INPUT":
      return {
        ...state,
        emptyInput: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "REMOVE_LOADING":
      return {
        ...state,
        loading: false,
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

function Signup() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const history = useHistory();

  const handleSignup = async (e) => {
    e.preventDefault();

    const inputEmpty = [];
    Object.entries(state).forEach(([key, value]) => {
      if (typeof value === "string") {
        if (value === "") {
          inputEmpty.push(key);
        }
      }
    });

    if (inputEmpty.length !== 0) {
      dispatch({
        type: "SET_EMPTY_INPUT",
        payload: inputEmpty,
      });
    } else {
      try {
        const {loading, emptyInput,rePassword, ...data} = state;
        if(rePassword !== data.password){
          alert("Mật khẩu xác nhận không trùng khớp");
          return;
        }

        dispatch({
          type: "SET_LOADING",
        });

        const result = await authService.signup(data);

        if (result) {
          alert("Đăng ký thành công");
          history.push("/login");
          return;
        }

        dispatch({
          type: "REMOVE_LOADING",
        });
      } catch (error) {
        alert(error.response?.data?.message || "Đăng ký thất bại");
        dispatch({
          type: "REMOVE_LOADING",
        });
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      {state.loading && <Loading />}

      <div className="signup-page min-vh-100 d-flex align-items-center">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="signup-card rounded d-flex">
                <div className="image-holder col-md-6 p-0">
                  <img src={signupImg} alt="" className="image-fluid" />
                </div>

                <form
                  className="col-md-6 p-4 signup-form"
                  onSubmit={handleSignup}
                >
                  <div className="signup-form-wrapper">
                    <h3 className="text-center mb-4">Đăng Ký</h3>

                    <div className="mb-3 double-input">
                      <input
                        type="text"
                        placeholder="Họ lót"
                        className={`form-control ${
                          state.emptyInput.includes("lastName")
                            ? "signup-input-error"
                            : ""
                        }`}
                        required
                        onChange={(e) =>
                          dispatch(setInfo(e.target.value, "SET_LAST_NAME"))
                        }
                      />

                      <input
                        type="text"
                        placeholder="Tên"
                        className={`form-control ${
                          state.emptyInput.includes("firstName")
                            ? "signup-input-error"
                            : ""
                        }`}
                        required
                        onChange={(e) =>
                          dispatch(setInfo(e.target.value, "SET_FRIST_NAME"))
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className={`form-control ${
                          state.emptyInput.includes("username")
                            ? "signup-input-error"
                            : ""
                        }`}
                        required
                        onChange={(e) =>
                          dispatch(setInfo(e.target.value, "SET_USERNAME"))
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="email"
                        placeholder="Email"
                        className={`form-control ${
                          state.emptyInput.includes("email")
                            ? "signup-input-error"
                            : ""
                        }`}
                        required
                        onChange={(e) =>
                          dispatch(setInfo(e.target.value, "SET_EMAIL"))
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        className={`form-control ${
                          state.emptyInput.includes("phone")
                            ? "signup-input-error"
                            : ""
                        }`}
                        pattern="[0-9]{10}"
                        required
                        onChange={(e) =>
                          dispatch(setInfo(e.target.value, "SET_PHONE"))
                        }
                      />
                    </div>

                    <div className="mb-3 position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        className={`form-control ${
                          state.emptyInput.includes("password")
                            ? "signup-input-error"
                            : ""
                        }`}
                        required
                        onChange={(e) =>
                          dispatch(setInfo(e.target.value, "SET_PASSWORD"))
                        }
                      />
                      <span
                        className={`fas ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        } position-absolute top-50 end-0 translate-middle-y me-2`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      ></span>
                    </div>

                    <div className="mb-3 position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        className={`form-control ${
                          state.emptyInput.includes("rePassword")
                            ? "signup-input-error"
                            : ""
                        }`}
                        required
                        onChange={(e) =>
                          dispatch(setInfo(e.target.value, "SET_REPASSWORD"))
                        }
                      />
                      <span
                        className={`fas ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        } position-absolute top-50 end-0 translate-middle-y me-2`}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      ></span>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3 mt-3"
                    >
                      Đăng Ký
                    </button>

                    <p className="text-center">
                      Đã có tài khoản?{" "}
                      <Link
                        to="/login"
                        className="fw-bold text-decoration-none"
                      >
                        Đăng Nhập
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
