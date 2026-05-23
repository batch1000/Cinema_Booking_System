import "../../css/managementCinema.css";

import {
  Switch,
  Route,
  NavLink,
} from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useReducer, useState } from "react";

import { seatTypeService } from "../../services/seatTypeService";
import { cinemaService } from "../../services/cinemaService";
import { roomService } from "../../services/roomService";
import { seatService } from "../../services/seatService";

import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

function ManagementRoomModal({
  setManagementRoomModal,
  initState,
  mode,
  listCinema,
  setListCinema,
}) {
  const isEdit = mode === "edit";

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_NAME":
        return {
          ...state,
          name: action.payload,
        };

      case "SET_COLUMN":
        return {
          ...state,
          col: action.payload,
        };

      case "SET_ROW":
        return {
          ...state,
          row: action.payload,
        };

      case "CLEAR":
        return {
          ...state,
          name: "",
          col: "",
          row: "",
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);
  const [loading, setLoading] = useState(false);

  const setInfo = (info, typeAction) => {
    return {
      type: typeAction,
      payload: info,
    };
  };

  const handleAddRoom = async () => {
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
      const result = await roomService.createRoom(state);
      if (result) {
        alert("Thêm phòng thành công");
        dispatch({ type: "CLEAR" });
        setListCinema(
          listCinema.map((cinema) => {
            if (state.cinemaID === cinema.cinemaID) {
              cinema.listRoom = [result, ...cinema.listRoom];
            }
            return cinema;
          })
        );
      }
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Thêm phòng thất bại");
      setLoading(false);
    }
  };

  const handleUpdateRoom = async () => {
    const isChange =
      state.name !== initState.name ||
      state.col !== initState.col ||
      state.row !== initState.row;

    if (isChange) {
      try {
        setLoading(true);
        const { cinemaID, roomID, ...data } = state;
        const result = await roomService.updateRoom(roomID, data);
        if (result) {
          alert("Cập nhật phòng thành công");
          setListCinema(
            listCinema.map((cinema) => {
              cinema.listRoom = cinema.listRoom.map((room) => {
                if (room.roomID === roomID) {
                  return result;
                }
                return room;
              });
              return cinema;
            })
          );
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Cập nhập phòng thất bại");
        setLoading(false);
      }
    } else {
      alert("Thông tin hiện không có sự thay đổi");
    }
  };

  const handleButton = () => {
    if (isEdit) {
      handleUpdateRoom();
    } else {
      handleAddRoom();
    }
  };

  return (
    <>
      <div className="dashboard-content__management-cinema-modal-overlay">
        <div className="dashboard-content__management-cinema-modal">
          <div className="dashboard-content__management-cinema-modal-header">
            <div className="dashboard-content__management-cinema-modal-title">
              <span className="dashboard-content__management-cinema-modal-title-icon">
                🎬
              </span>
              {!isEdit && "Thêm phòng chiếu"}
              {isEdit && "Cập nhật phòng chiếu"}
            </div>
            <button
              className="dashboard-content__management-cinema-modal-close"
              onClick={() => setManagementRoomModal(false)}
            >
              ✕
            </button>
          </div>

          <div className="dashboard-content__management-cinema-modal-body">
            <div className="dashboard-content__management-cinema-form-grid">
              {/* Tên phòng */}
              <div className="dashboard-content__management-cinema-form-group dashboard-content__management-cinema-form-group--full">
                <label className="dashboard-content__management-cinema-form-label">
                  Tên phòng chiếu <span>*</span>
                </label>
                <input
                  type="text"
                  className="dashboard-content__management-cinema-form-input"
                  placeholder="VD: Phòng 01, Phòng IMAX..."
                  value={state.name}
                  onChange={(e) =>
                    dispatch(setInfo(e.target.value, "SET_NAME"))
                  }
                />
              </div>

              {/* Số hàng */}
              <div className="dashboard-content__management-cinema-form-group">
                <label className="dashboard-content__management-cinema-form-label">
                  Số hàng <span>*</span>
                </label>
                <input
                  type="number"
                  className="dashboard-content__management-cinema-form-input"
                  placeholder="VD: 8"
                  min="1"
                  max="30"
                  value={state.row}
                  onChange={(e) =>
                    dispatch(setInfo(Number(e.target.value), "SET_ROW"))
                  }
                />
                <span className="dashboard-content__management-cinema-form-hint">
                  Hàng sẽ được đặt tên A, B, C...
                </span>
              </div>

              {/* Số cột */}
              <div className="dashboard-content__management-cinema-form-group">
                <label className="dashboard-content__management-cinema-form-label">
                  Số cột (ghế/hàng) <span>*</span>
                </label>
                <input
                  type="number"
                  className="dashboard-content__management-cinema-form-input"
                  placeholder="VD: 10"
                  min="1"
                  max="30"
                  value={state.col}
                  onChange={(e) =>
                    dispatch(setInfo(Number(e.target.value), "SET_COLUMN"))
                  }
                />
                <span className="dashboard-content__management-cinema-form-hint">
                  Ghế sẽ được đánh số 1, 2, 3...
                </span>
              </div>

              {/* Tổng ghế preview */}
              <div className="dashboard-content__management-cinema-form-group dashboard-content__management-cinema-form-group--full">
                <div className="dashboard-content__management-cinema-seat-preview-info">
                  <i className="fa-solid fa-circle-info"></i>
                  Tổng số ghế sẽ tạo: <strong>80 ghế</strong>
                  &nbsp;(8 hàng × 10 cột) — Ghế mặc định loại{" "}
                  <strong>Standard</strong>, có thể thay đổi trên sơ đồ sau khi
                  tạo phòng.
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-content__management-cinema-modal-footer">
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--secondary"
              onClick={() => setManagementRoomModal(false)}
            >
              Hủy
            </button>
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--primary"
              onClick={() => handleButton()}
            >
              {!isEdit && "💾 Tạo phòng"}
              {isEdit && "💾 Cập nhật phòng"}
            </button>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
}

function SeatModal({ room, setSeatModal }) {
  const [listSeatType, setListSeatType] = useState([]);
  const [listSeat, setListSeat] = useState(room.listSeat);
  const [selectSeat, setSelectSeat] = useState("");
  const [seatTypeOption, setSeatTypeOption] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSeatType = async () => {
      try {
        setLoading(true);
        const result = await seatTypeService.getListSeatType();
        if (result) {
          setListSeatType(result);
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Tải dữ liệu loại ghế thất bại");
        setLoading(false);
      }
    };
    fetchSeatType();
  }, []);

  const groupSeatByCol = () => {
    if (listSeat) {
      let listGroup = [];
      let result = [];
      let count = 1;
      for (let i = 0; i < room.seatCount; i++) {
        listGroup.push(room.listSeat[i]);

        count += 1;
        if (count > room.col) {
          result.push(listGroup);
          listGroup = [];
          count = 1;
        }
      }

      return result;
    }

    return undefined;
  };

  function getTextColor(bgColor) {
    // bỏ dấu # nếu có
    const color = bgColor.replace("#", "");
  
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
  
    // công thức độ sáng (luminance)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
    return brightness > 128 ? "#000" : "#fff";
  }

  const handleSeatSelect = (seat) => {
    setSelectSeat(seat.seatID);
    setSeatTypeOption(seat.seatType.seatTypeID);
  }

  const handleChangeSeatTypeOption = (value) => {
    if(selectSeat !== "") {
      setSeatTypeOption(value);
      setListSeat(listSeat.map(seat => {
        if(seat.seatID === selectSeat) {
          seat.seatType = listSeatType.find(seatType => seatType.seatTypeID === value);
        }
        return seat;
      }))
    } else {
      alert("Vui lòng chọn một ghế");
    }
  }

  const renderSeatMap = () => {
    const listGroupSeat = groupSeatByCol();

    return listGroupSeat.map((group, index) => (
      <div
        className="dashboard-content__management-cinema-seat-row"
        key={index}
      >
        <div className="dashboard-content__management-cinema-seats">
          {group.map((seat) => (
            <div
              key={seat.seatID}
              className={`dashboard-content__management-cinema-seat ${selectSeat === seat.seatID ? "seat--selected" : ""}`}
              title={seat.seatNumber}
              style={{
                backgroundColor: seat.seatType.color,
                color: getTextColor(seat.seatType.color),
                fontWeight: "bold"
              }}

              onClick={() => handleSeatSelect(seat)}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const handleUpdateListSeat = async() => {
    try {
      setLoading(true);
      const result = await seatService.updateListSeat(listSeat);
      if (result) {
        alert("Cập nhật dãy ghế thành công");
      }
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhập dãy ghế thất bại");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="dashboard-content__management-cinema-modal-overlay">
        <div className="dashboard-content__management-cinema-modal dashboard-content__management-cinema-modal--wide">
          <div className="dashboard-content__management-cinema-modal-header">
            <div className="dashboard-content__management-cinema-modal-title">
              <span className="dashboard-content__management-cinema-modal-title-icon">
                <i className="fa-solid fa-table-cells"></i>
              </span>
              Sơ đồ ghế — {room.name}
            </div>

            <button
              className="dashboard-content__management-cinema-modal-close"
              onClick={() => setSeatModal(false)}
            >
              ✕
            </button>
          </div>

          <div className="dashboard-content__management-cinema-modal-body">
            {/* Legend + Seat Type Selector */}
            <div className="dashboard-content__management-cinema-seat-map-toolbar">
              <div className="dashboard-content__management-cinema-seat-map-legend">
                {listSeatType.map((seatType) => (
                  <span
                    className="dashboard-content__management-cinema-legend-item"
                    key={seatType.seatTypeID}
                  >
                    <span
                      className="dashboard-content__management-cinema-legend-dot"
                      style={{ backgroundColor: seatType.color }}
                    ></span>
                    {seatType.name}
                  </span>
                ))}
              </div>

              <div className="dashboard-content__management-cinema-seat-map-actions">
                <span className="dashboard-content__management-cinema-seat-map-hint">
                  Click ghế để đổi loại:
                </span>
                <select className="dashboard-content__management-cinema-seat-type-select"
                 onChange={(e) => handleChangeSeatTypeOption(e.target.value)}
                 value={seatTypeOption}
                 >
                  {listSeatType.map((seatType) => (
                    <option
                      key={seatType.seatTypeID}
                      value={seatType.seatTypeID}
                    >
                      {seatType.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Screen */}
            <div className="dashboard-content__management-cinema-screen-wrap">
              <div className="dashboard-content__management-cinema-screen">
                <span>MÀN HÌNH</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="dashboard-content__management-cinema-seat-map">
              {renderSeatMap()}
            </div>

            {/* Seat count summary */}
            <div className="dashboard-content__management-cinema-seat-map-summary">
              <span>
                Tổng: <strong>{room.seatCount} ghế</strong>
              </span>
            </div>
          </div>

          <div className="dashboard-content__management-cinema-modal-footer">
            <button className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--secondary">
              Hủy
            </button>
            <button 
            className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--primary"
            onClick={handleUpdateListSeat}
            >
              💾 Lưu sơ đồ ghế
            </button>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
}

function SeatTypeModal({
  mode,
  setSeatModal,
  initState,
  listSeatType,
  setListSeatType,
}) {
  const isEdit = mode === "edit";

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_NAME":
        return {
          ...state,
          name: action.payload,
        };

      case "SET_PRICE_MULTIPLIER":
        return {
          ...state,
          priceMultiplier: action.payload,
        };

      case "SET_DESCRIPTION":
        return {
          ...state,
          description: action.payload,
        };

      case "SET_COLOR":
        return {
          ...state,
          color: action.payload,
        };
      case "CLEAR":
        return {
          name: "",
          priceMultiplier: "",
          description: "",
          color: "",
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);
  const [loading, setLoading] = useState(false);

  const setInfo = (info, typeAction) => {
    return {
      type: typeAction,
      payload: info,
    };
  };

  const handleAddSeatType = async () => {
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
      const result = await seatTypeService.createSeatType(state);
      if (result) {
        alert("Thêm loại ghế thành công");
        dispatch({ type: "CLEAR" });
        setListSeatType([result, ...listSeatType]);
      }
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Thêm loại ghế thất bại");
      setLoading(false);
    }
  };

  const handleUpdateSeatType = async () => {
    const isChange =
      state.name !== initState.name ||
      state.priceMultiplier !== initState.priceMultiplier ||
      state.description !== initState.description ||
      state.color !== initState.color;
    if (isChange) {
      try {
        setLoading(true);
        const { seatTypeID, ...data } = state;
        const result = await seatTypeService.updateSeatType(seatTypeID, data);
        if (result) {
          alert("Cập nhật loại ghế thành công");
          setListSeatType(
            listSeatType.map((item) => {
              if (item.seatTypeID !== result.seatTypeID) {
                return item;
              }
              return result;
            })
          );
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Cập nhật loại ghế thất bại");
        setLoading(false);
      }
    } else {
      alert("Thông tin hiện không có sự thay đổi");
    }
  };

  const handleButton = () => {
    if (isEdit) {
      handleUpdateSeatType();
    } else {
      handleAddSeatType();
    }
  };

  return (
    <>
      <div className="dashboard-content__management-cinema-modal-overlay">
        <div className="dashboard-content__management-cinema-modal">
          <div className="dashboard-content__management-cinema-modal-header">
            <div className="dashboard-content__management-cinema-modal-title">
              <span className="dashboard-content__management-cinema-modal-title-icon">
                <i className="fa-solid fa-couch"></i>
              </span>
              {isEdit ? "Chỉnh sửa loại ghế" : "Thêm loại ghế mới"}
            </div>
            <button
              className="dashboard-content__management-cinema-modal-close"
              onClick={() => setSeatModal(false)}
            >
              ✕
            </button>
          </div>

          <div className="dashboard-content__management-cinema-modal-body">
            <div className="dashboard-content__management-cinema-form-grid">
              {/* Tên loại ghế */}
              <div className="dashboard-content__management-cinema-form-group dashboard-content__management-cinema-form-group--full">
                <label className="dashboard-content__management-cinema-form-label">
                  Tên loại ghế <span>*</span>
                </label>
                <input
                  type="text"
                  className="dashboard-content__management-cinema-form-input"
                  placeholder="VD: Standard, VIP, Sweetbox, Premium"
                  value={state.name}
                  onChange={(e) =>
                    dispatch(setInfo(e.target.value, "SET_NAME"))
                  }
                />
              </div>

              {/* Hệ số giá */}
              <div className="dashboard-content__management-cinema-form-group">
                <label className="dashboard-content__management-cinema-form-label">
                  Hệ số giá <span>*</span>
                </label>
                <input
                  type="number"
                  className="dashboard-content__management-cinema-form-input"
                  placeholder="VD: 1, 1.5, 2..."
                  min="1"
                  step="0.1"
                  value={state.priceMultiplier}
                  onChange={(e) =>
                    dispatch(
                      setInfo(Number(e.target.value), "SET_PRICE_MULTIPLIER")
                    )
                  }
                />
                <span className="dashboard-content__management-cinema-form-hint">
                  Giá vé = Giá cơ bản × Hệ số giá
                </span>
              </div>

              {/* Preview giá */}
              <div className="dashboard-content__management-cinema-form-group">
                <label className="dashboard-content__management-cinema-form-label">
                  Màu hiển thị
                </label>
                <div className="dashboard-content__management-cinema-seattype-color-row">
                  <input
                    type="color"
                    value={state.color}
                    onChange={(e) =>
                      dispatch(setInfo(e.target.value, "SET_COLOR"))
                    }
                  />

                  <input
                    type="text"
                    className="color-input"
                    value={state.color}
                    onChange={(e) =>
                      dispatch(setInfo(e.target.value, "SET_COLOR"))
                    }
                    placeholder="Chưa chọn màu"
                  />
                </div>
                <span className="dashboard-content__management-cinema-form-hint">
                  Màu hiển thị trên sơ đồ ghế
                </span>
              </div>

              {/* Mô tả */}
              <div className="dashboard-content__management-cinema-form-group dashboard-content__management-cinema-form-group--full">
                <label className="dashboard-content__management-cinema-form-label">
                  Mô tả
                </label>
                <textarea
                  className="dashboard-content__management-cinema-form-input dashboard-content__management-cinema-form-textarea"
                  placeholder="VD: Ghế thường, phù hợp mọi đối tượng khán giả"
                  rows={3}
                  value={state.description}
                  onChange={(e) =>
                    dispatch(setInfo(e.target.value, "SET_DESCRIPTION"))
                  }
                />
              </div>
            </div>
          </div>

          <div className="dashboard-content__management-cinema-modal-footer">
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--secondary"
              onClick={() => setSeatModal(false)}
            >
              Hủy
            </button>
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--primary"
              onClick={handleButton}
            >
              💾 {isEdit ? "Cập nhật" : "Thêm loại ghế"}
            </button>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
}

function ManagementSeatTypeTab() {
  const [addSeatModal, setAddSeatModal] = useState(false);
  const [updateSeatModal, setUpdateSeatModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [listSeatType, setListSeatType] = useState([]);
  const [updateElement, setUpdateElement] = useState([]);

  useEffect(() => {
    const fetchSeatType = async () => {
      try {
        setLoading(true);
        const result = await seatTypeService.getListSeatType();
        if (result) {
          setListSeatType(result);
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Tải dữ liệu loại ghế thất bại");
        setLoading(false);
      }
    };
    fetchSeatType();
  }, []);

  const renderListSeatType = () => {
    return listSeatType?.map((item) => (
      <tr key={item.seatTypeID}>
        <td>
          <span className="dashboard-content__management-cinema-seat-type-tag">
            {item.name}
          </span>
        </td>
        <td>
          <span className="dashboard-content__management-cinema-seattype-multiplier">
            × {item.priceMultiplier}
          </span>
        </td>
        <td style={{ color: "#5a6078" }}>{item.description}</td>
        <td>
          <input
            type="color"
            value={item.color}
            disabled
            style={{ cursor: "default" }}
            className="dashboard-content__management-cinema-color-input"
          />
        </td>
        <td>
          <div className="dashboard-content__management-cinema-room-actions">
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--outline dashboard-content__management-cinema-btn--sm dashboard-content__management-cinema-btn--icon-only"
              title="Sửa"
              onClick={() => {
                setUpdateSeatModal(true);
                setUpdateElement(item);
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--danger dashboard-content__management-cinema-btn--sm dashboard-content__management-cinema-btn--icon-only"
              title="Xóa"
              onClick={async () => {
                if (window.confirm("Bạn có thật sự muốn xóa loại ghế này?")) {
                  try {
                    setLoading(true);
                    const result = await seatTypeService.deleteSeatType(
                      item.seatTypeID
                    );
                    if (result) {
                      alert("Xóa loại ghế thành công");
                      setListSeatType(
                        listSeatType.filter(
                          (it) => it.seatTypeID !== item.seatTypeID
                        )
                      );
                    }
                    setLoading(false);
                  } catch (error) {
                    alert(
                      error.response?.data?.message || "Xóa loại ghế thất bại"
                    );
                    setLoading(false);
                  }
                }
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className="dashboard-content__management-cinema-seattype-section">
        <div className="dashboard-content__management-cinema-seattype-header">
          <div>
            <h2 className="dashboard-content__management-cinema-seattype-title">
              Quản lý loại ghế
            </h2>
            <p className="dashboard-content__management-cinema-subtitle">
              Cấu hình các loại ghế và hệ số giá áp dụng toàn hệ thống
            </p>
          </div>
          <button
            className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--primary"
            onClick={() => setAddSeatModal(true)}
          >
            ➕ Thêm loại ghế
          </button>
        </div>

        <div className="dashboard-content__management-cinema-table-wrap">
          <table className="dashboard-content__management-cinema-table">
            <thead>
              <tr>
                <th>Loại ghế</th>
                <th>Hệ số giá</th>
                <th>Mô tả</th>
                <th>Màu sắc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>{renderListSeatType()}</tbody>
          </table>
        </div>
      </div>

      {addSeatModal && (
        <SeatTypeModal
          mode={"add"}
          setSeatModal={setAddSeatModal}
          initState={{
            name: "",
            priceMultiplier: "",
            description: "",
            color: "",
          }}
          listSeatType={listSeatType}
          setListSeatType={setListSeatType}
        />
      )}

      {updateSeatModal && (
        <SeatTypeModal
          mode={"edit"}
          setSeatModal={setUpdateSeatModal}
          initState={updateElement}
          listSeatType={listSeatType}
          setListSeatType={setListSeatType}
        />
      )}

      {loading && <Loading />}
    </>
  );
}

function ManagementCinemaModal({
  setManagementModal,
  initState,
  mode,
  listCinema,
  setListCinema,
}) {
  const isEdit = mode === "edit";

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_NAME":
        return {
          ...state,
          name: action.payload,
        };
      case "SET_ADDRESS":
        return {
          ...state,
          address: action.payload,
        };
      case "CLEAR":
        return {
          name: "",
          address: "",
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);
  const [loading, setLoading] = useState(false);

  const setInfo = (info, typeAction) => {
    return {
      type: typeAction,
      payload: info,
    };
  };

  const handleAddCinema = async () => {
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
      const result = await cinemaService.createCinema(state);
      if (result) {
        alert("Thêm rạp thành công");
        dispatch({ type: "CLEAR" });
        setListCinema([result, ...listCinema]);
      }
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Thêm rạp thất bại");
      setLoading(false);
    }
  };

  const handleUpdateCinema = async () => {
    const isChange =
      state.name !== initState.name || state.address !== initState.address;
    if (isChange) {
      try {
        setLoading(true);
        const { cinemaID, ...data } = state;
        const result = await cinemaService.updateCinema(cinemaID, data);
        if (result) {
          alert("Cập nhật rạp phim thành công");
          setListCinema(
            listCinema.map((item) => {
              if (item.cinemaID !== result.cinemaID) {
                return item;
              }
              return result;
            })
          );
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Cập nhập rạp phim thất bại");
        setLoading(false);
      }
    } else {
      alert("Thông tin hiện không có sự thay đổi");
    }
  };

  const handleButton = () => {
    if (isEdit) {
      handleUpdateCinema();
    } else {
      handleAddCinema();
    }
  };

  return (
    <>
      <div className="dashboard-content__management-cinema-modal-overlay">
        <div className="dashboard-content__management-cinema-modal">
          <div className="dashboard-content__management-cinema-modal-header">
            <div className="dashboard-content__management-cinema-modal-title">
              <span className="dashboard-content__management-cinema-modal-title-icon">
                🏢
              </span>
              {isEdit ? "Cập nhật rạp" : "Thêm rạp mới"}
            </div>
            <button
              className="dashboard-content__management-cinema-modal-close"
              onClick={() => setManagementModal(false)}
            >
              ✕
            </button>
          </div>

          <div className="dashboard-content__management-cinema-modal-body">
            <div className="dashboard-content__management-cinema-form-grid">
              {/* Tên rạp */}
              <div className="dashboard-content__management-cinema-form-group dashboard-content__management-cinema-form-group--full">
                <label className="dashboard-content__management-cinema-form-label">
                  Tên rạp <span>*</span>
                </label>
                <input
                  type="text"
                  className="dashboard-content__management-cinema-form-input"
                  placeholder="VD: CGV Vincom Center Bà Triệu"
                  value={state.name}
                  onChange={(e) =>
                    dispatch(setInfo(e.target.value, "SET_NAME"))
                  }
                />
              </div>

              {/* Địa chỉ */}
              <div className="dashboard-content__management-cinema-form-group dashboard-content__management-cinema-form-group--full">
                <label className="dashboard-content__management-cinema-form-label">
                  Địa chỉ <span>*</span>
                </label>
                <input
                  type="text"
                  className="dashboard-content__management-cinema-form-input"
                  placeholder="VD: 191 Bà Triệu, Hai Bà Trưng, Hà Nội"
                  value={state.address}
                  onChange={(e) =>
                    dispatch(setInfo(e.target.value, "SET_ADDRESS"))
                  }
                />
                <span className="dashboard-content__management-cinema-form-hint">
                  Nhập địa chỉ đầy đủ gồm số nhà, đường, quận/huyện, tỉnh/thành
                  phố
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-content__management-cinema-modal-footer">
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--secondary"
              onClick={() => setManagementModal(false)}
            >
              Hủy
            </button>
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--primary"
              onClick={handleButton}
            >
              💾 {isEdit ? "Cập nhật" : "Lưu"}
            </button>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
}

function ManagementCinemaTab({ paginationInfo, setPaginationInfo }) {
  const [loading, setLoading] = useState(false);
  const [listCinema, setListCinema] = useState([]);

  const [addCinemaModal, setAddCinemaModal] = useState(false);
  const [updateCinemaModal, setUpdateCinemaModal] = useState(false);
  const [elementUpdate, setElementUpdate] = useState({});

  const [choosingOpenAddRoomModal, setChoosingOpenAddRoomModal] = useState("");
  const [choosingOpenUpdateRoomModal, setChoosingOpenUpdateRoomModal] =
    useState("");
  const [elementRoomUpdate, setElementRoomUpdate] = useState({});

  const [choosingOpenSeatModal, setChoosingOpenSeatModal] = useState("");
  const [elementSeatModal, setElementSeatModal] = useState({});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [filter, setFilter] = useState({
    keyword: "",
  });

  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    fetchListCinema(1);
    setPage(1);
  }, [filter]);

  const fetchListCinema = async (pageChoose) => {
    try {
      setLoading(true);

      const [listCinema, paginationInfo] = await Promise.all([
        cinemaService.getListCinema(pageChoose, pageSize, filter),
        cinemaService.getPaginationInfo(pageSize, filter),
      ]);

      setListCinema(listCinema);
      setPaginationInfo(paginationInfo);

      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Tải danh sách rạp phim thất bại");
      setLoading(false);
    }
  };

  const handleSetPage = (page) => {
    setPage(page);
    fetchListCinema(page);
  };

  const renderRoomOfCinema = (cinema) => {
    return (
      <>
        <div className="dashboard-content__management-cinema-room-section">
          <div className="dashboard-content__management-cinema-room-section-header">
            <span className="dashboard-content__management-cinema-room-section-title">
              <i className="fa-solid fa-film"></i> Danh sách phòng chiếu
            </span>
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--primary dashboard-content__management-cinema-btn--sm"
              onClick={() => setChoosingOpenAddRoomModal(cinema.cinemaID)}
            >
              ➕ Thêm phòng
            </button>
          </div>

          <div className="dashboard-content__management-cinema-table-wrap">
            <table className="dashboard-content__management-cinema-table">
              <thead>
                <tr>
                  <th>Tên phòng</th>
                  <th>Tổng ghế</th>
                  <th>Chi tiết theo loại ghế</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cinema?.listRoom?.map((room) => (
                  <tr key={room.roomID}>
                    <td>
                      <span className="dashboard-content__management-cinema-room-name">
                        <i className="fa-solid fa-clapperboard"></i> {room.name}
                      </span>
                    </td>

                    <td>
                      <span className="dashboard-content__management-cinema-total-seat">
                        {room.seatCount} ghế
                      </span>
                    </td>

                    <td>
                      <div className="dashboard-content__management-cinema-seat-summary">
                        {room.listGroupSeatType.map((item) => (
                          <span
                            key={item.seatTypeID}
                            className={`dashboard-content__management-cinema-seat-type-tag ${renderSeatTypeTag(
                              item.name
                            )}`}
                          >
                            {item.name}: {item.total}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <div className="dashboard-content__management-cinema-room-actions">
                        <button
                          className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--outline dashboard-content__management-cinema-btn--sm"
                          onClick={() => {
                            setChoosingOpenSeatModal(cinema.cinemaID);
                            setElementSeatModal(room);
                          }}
                        >
                          <i className="fa-solid fa-border-all"></i> Sơ đồ ghế
                        </button>
                        <button
                          className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--outline dashboard-content__management-cinema-btn--sm dashboard-content__management-cinema-btn--icon-only"
                          title="Sửa phòng"
                          onClick={() => {
                            setChoosingOpenUpdateRoomModal(cinema.cinemaID);
                            setElementRoomUpdate({
                              name: room.name,
                              col: room.col,
                              row: room.row,
                              cinemaID: cinema.cinemaID,
                              roomID: room.roomID,
                            });
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--danger dashboard-content__management-cinema-btn--sm dashboard-content__management-cinema-btn--icon-only"
                          title="Xóa phòng"
                          onClick={() => handleDeleteRoom(room.roomID)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {choosingOpenAddRoomModal === cinema.cinemaID && (
          <ManagementRoomModal
            setManagementRoomModal={setChoosingOpenAddRoomModal}
            initState={{
              name: "",
              col: "",
              row: "",
              cinemaID: cinema.cinemaID,
            }}
            mode={"add"}
            listCinema={listCinema}
            setListCinema={setListCinema}
          />
        )}

        {choosingOpenUpdateRoomModal === cinema.cinemaID && (
          <ManagementRoomModal
            setManagementRoomModal={setChoosingOpenUpdateRoomModal}
            initState={elementRoomUpdate}
            mode={"edit"}
            listCinema={listCinema}
            setListCinema={setListCinema}
          />
        )}

        {choosingOpenSeatModal === cinema.cinemaID && (
          <SeatModal
            room={elementSeatModal}
            setSeatModal={setChoosingOpenSeatModal}
          />
        )}
      </>
    );
  };

  const renderListCinema = () => {
    return listCinema?.map((cinema) => (
      <div
        className="dashboard-content__management-cinema-card"
        key={cinema.cinemaID}
      >
        <div className="dashboard-content__management-cinema-card-header">
          <div className="dashboard-content__management-cinema-card-icon">
            <i className="fa-solid fa-building"></i>
          </div>
          <div className="dashboard-content__management-cinema-card-info">
            <div className="dashboard-content__management-cinema-card-name">
              {cinema.name}
            </div>
            <div className="dashboard-content__management-cinema-card-address">
              <i className="fa-solid fa-location-dot"></i>
              {cinema.address}
            </div>
          </div>
          <div className="dashboard-content__management-cinema-card-meta-inline">
            <span className="dashboard-content__management-cinema-badge dashboard-content__management-cinema-badge--blue">
              <i className="fa-solid fa-tv"></i> {cinema.roomCount} phòng
            </span>
            {/* <span className="dashboard-content__management-cinema-badge dashboard-content__management-cinema-badge--orange">
              <i className="fa-solid fa-couch"></i> unknown ghế
            </span> */}
          </div>

          <div className="dashboard-content__management-cinema-card-actions">
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--outline dashboard-content__management-cinema-btn--sm dashboard-content__management-cinema-btn--icon-only"
              title="Sửa rạp"
              onClick={() => {
                setUpdateCinemaModal(true);
                setElementUpdate(cinema);
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--danger dashboard-content__management-cinema-btn--sm dashboard-content__management-cinema-btn--icon-only"
              title="Xóa rạp"
              onClick={() => handleDeleteCinema(cinema.cinemaID)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        {renderRoomOfCinema(cinema)}
      </div>
    ));
  };

  const handleDeleteCinema = async (cinemaID) => {
    if (window.confirm("Bạn có thật sự muốn xóa rạp phim này?")) {
      try {
        setLoading(true);
        const result = await cinemaService.deleteCinema(cinemaID);
        if (result) {
          alert("Xóa rạp phim thành công");
          setListCinema(listCinema.filter((it) => it.cinemaID !== cinemaID));
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Xóa rạp phim thất bại");
        setLoading(false);
      }
    }
  };

  const renderSeatTypeTag = (name) => {
    switch (name) {
      case "Standard":
        return "dashboard-content__management-cinema-seat-type-tag--standard";

      case "Premium":
        return "dashboard-content__management-cinema-seat-type-tag--premium";

      case "VIP":
        return "dashboard-content__management-cinema-seat-type-tag--vip";

      case "Sweetbox":
        return "dashboard-content__management-cinema-seat-type-tag--sweetbox";

      default:
        return "";
    }
  };

  const handleDeleteRoom = async (roomID) => {
    if (window.confirm("Bạn có thật sự muốn xóa phòng này?")) {
      try {
        setLoading(true);
        const result = await roomService.deleteRoom(roomID);
        if (result) {
          alert("Xóa phòng thành công");
          setListCinema(
            listCinema.map((cinema) => {
              cinema.listRoom = cinema.listRoom.filter(
                (r) => r.roomID !== roomID
              );
              return cinema;
            })
          );
        }
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Xóa phòng thất bại");
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    if (inputSearch.trim() !== "") {
      setFilter({
        keyword: inputSearch,
      });
    } else {
      alert("Vui lòng nhập từ khóa tìm kiếm");
    }
  };

  console.log(listCinema);

  return (
    <>
      {/* ===== TOOLBAR ===== */}
      <div className="dashboard-content__management-cinema-toolbar">
        <div className="dashboard-content__management-cinema-search-wrap">
          <span className="dashboard-content__management-cinema-search-icon">
            🔍
          </span>
          <input
            type="text"
            className="dashboard-content__management-cinema-search"
            placeholder="Tìm kiếm tên rạp..."
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />
        </div>
        <button
          className="dashboard-content__management-cinema-search-button"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
        <button
          className="dashboard-content__management-cinema-clear-filter-button"
          onClick={() => {
            setInputSearch("");
            setFilter({
              keyword: "",
            });
          }}
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="d-flex mb-3">
        <button
          className="dashboard-content__management-cinema-btn dashboard-content__management-cinema-btn--primary"
          onClick={() => setAddCinemaModal(true)}
        >
          ➕ Thêm rạp mới
        </button>
      </div>

      {/* ===== CINEMA LIST ===== */}
      <div className="dashboard-content__management-cinema-list">
        {renderListCinema()}
      </div>

      {/* ===== PAGINATION ===== */}
      <Pagination
        currentPage={page}
        totalPage={paginationInfo.totalPage}
        totalItem={paginationInfo.totalCinema}
        pageSize={pageSize}
        onPageChange={handleSetPage}
        nameList={"rạp"}
      />

      {loading && <Loading />}

      {addCinemaModal && (
        <ManagementCinemaModal
          setManagementModal={setAddCinemaModal}
          initState={{
            name: "",
            address: "",
          }}
          mode={"add"}
          listCinema={listCinema}
          setListCinema={setListCinema}
        />
      )}

      {updateCinemaModal && (
        <ManagementCinemaModal
          setManagementModal={setUpdateCinemaModal}
          initState={elementUpdate}
          mode={"edit"}
          listCinema={listCinema}
          setListCinema={setListCinema}
        />
      )}
    </>
  );
}

function HeaderCinema() {
  return (
    <>
      <div className="dashboard-content__management-cinema-header">
        <div>
          <h1 className="dashboard-content__management-cinema-title">
            Quản Lý Rạp Phim
          </h1>
          <p className="dashboard-content__management-cinema-subtitle">
            Tổng hợp và quản lý toàn bộ hệ thống rạp, phòng chiếu và ghế ngồi
          </p>
        </div>
      </div>
    </>
  );
}

function CinemaStat({ paginationInfo }) {
  return (
    <>
      <HeaderCinema />

      {/* ===== STATS ===== */}
      <div className="dashboard-content__management-cinema-stats">
        <div className="dashboard-content__management-cinema-stat-card">
          <div className="dashboard-content__management-cinema-stat-icon dashboard-content__management-cinema-stat-icon--blue">
            <i className="fa-solid fa-building"></i>
          </div>
          <div>
            <div className="dashboard-content__management-cinema-stat-label">
              Tổng rạp
            </div>
            <div className="dashboard-content__management-cinema-stat-value">
              {paginationInfo.totalCinema}
            </div>
          </div>
        </div>
        <div className="dashboard-content__management-cinema-stat-card">
          <div className="dashboard-content__management-cinema-stat-icon dashboard-content__management-cinema-stat-icon--green">
            <i className="fa-solid fa-tv"></i>
          </div>
          <div>
            <div className="dashboard-content__management-cinema-stat-label">
              Tổng phòng chiếu
            </div>
            <div className="dashboard-content__management-cinema-stat-value">
              {paginationInfo.totalRoom}
            </div>
          </div>
        </div>
        <div className="dashboard-content__management-cinema-stat-card">
          <div className="dashboard-content__management-cinema-stat-icon dashboard-content__management-cinema-stat-icon--orange">
            <i className="fa-solid fa-couch"></i>
          </div>
          <div>
            <div className="dashboard-content__management-cinema-stat-label">
              Tổng ghế ngồi
            </div>
            <div className="dashboard-content__management-cinema-stat-value">
              {paginationInfo.totalSeat}
            </div>
          </div>
        </div>
        <div className="dashboard-content__management-cinema-stat-card">
          <div className="dashboard-content__management-cinema-stat-icon dashboard-content__management-cinema-stat-icon--purple">
            <i className="fa-solid fa-tags"></i>
          </div>
          <div>
            <div className="dashboard-content__management-cinema-stat-label">
              Loại ghế
            </div>
            <div className="dashboard-content__management-cinema-stat-value">
              {paginationInfo.totalSeatType}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ManagementCinema() {
  const [paginationInfo, setPaginationInfo] = useState({});

  return (
    <>
      <div className="dashboard-content__management-cinema">
        <CinemaStat paginationInfo={paginationInfo} />

        {/* ===== TAB BAR ===== */}
        <div className="dashboard-content__management-cinema-tabs">
          <NavLink
            to="/dashboard/managementCinema/managementCinemaTab"
            className="dashboard-sidebar__item"
            activeClassName="dashboard-content__management-cinema-tab-btn--active"
          >
            <i className="fa-solid fa-building"></i>
            Rạp & Phòng chiếu
          </NavLink>

          <NavLink
            to="/dashboard/managementCinema/managementSeatTypeTab"
            className="dashboard-sidebar__item"
            activeClassName="dashboard-content__management-cinema-tab-btn--active"
          >
            <i className="fa-solid fa-tags"></i>
            Loại ghế
          </NavLink>
        </div>

        <Switch>
          <Route path="/dashboard/managementCinema/managementCinemaTab">
            <ManagementCinemaTab
              paginationInfo={paginationInfo}
              setPaginationInfo={setPaginationInfo}
            />
          </Route>

          <Route
            path="/dashboard/managementCinema/managementSeatTypeTab"
            component={ManagementSeatTypeTab}
          />
        </Switch>
      </div>
    </>
  );
}

export default ManagementCinema;
