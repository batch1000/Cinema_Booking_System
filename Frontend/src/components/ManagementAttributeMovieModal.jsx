import { useState } from "react";
import "../css/managementMovie.css";

import Loading from "./Loading";

function ManagementAttributeMovieModal({ setOpenManagementInfoModal, action, list, setList, attributeList }) {
  const [button, setButton] = useState({
    text: "Lưu",
    icon: "💾 ",
  });

  const [input, setInput] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [choosingId, setChoosingId] = useState(null);


  const normalizeVietnamese = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD") // tách dấu ra
      .replace(/[\u0300-\u036f]/g, "") // xoá dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .trim();
  }

  const handleButton = async () => {
    if (button.text === "Lưu") {
      try {
        setLoading(true);

        const result = await action.payload.create({
          name: input.trim(),
        });

        if (result) {
          alert(`Thêm ${action.type} thành công`);
          setInput("");
          setList([result, ...list]);
        }

        setLoading(false);
      } catch (err) {
        alert(err.response?.data?.message || `Thêm ${action.type} thất bại`);
        setLoading(false);
      }
    }

    if (button.text === "Sửa") {
      try {
        setLoading(true);

        const result = await action.payload.update(choosingId, {
          name: input.trim(),
        });

        if (result) {
          alert(`Cập nhật ${action.type} thành công`);
          setList(
            list.map((item) =>
              item[attributeList.id] === result[attributeList.id] ? result : item
            )
          );
          setInput("");
          setChoosingId(null);
          setButton({
            text: "Lưu",
            icon: "💾 ",
          });
          setInput("");
        }
        console.log(result);
        setLoading(false);
      } catch (err) {
        alert(
          err.response?.data?.message || `Cập nhật ${action.type} thất bại`
        );
        setLoading(false);
      }
    }
  };

  const renderList = () => {
    return list
    .filter(item => normalizeVietnamese(item[attributeList.name]).includes(normalizeVietnamese(inputSearch)))
    .map((item) => {
      return (
        <li
          className={`attribute-list__item ${
            item[attributeList.id] === choosingId ? "attribute-list__item--choosing" : ""
          }`}
          key={item[attributeList.id]}
          onClick={() => {
            setInput(item[attributeList.name]);
            setChoosingId(item[attributeList.id]);
            setButton({
              text: "Sửa",
              icon: <i className="fa-solid fa-pen-to-square"></i>,
            });
          }}
        >
          <span className="attribute-list__name">{item[attributeList.name]}</span>
          <div className="attribute-list__actions">
            <button className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--outline dashboard-content__management-movie-btn--sm">
              <i className="fa-solid fa-pen-to-square"></i> Sửa
            </button>
            <button
              className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--danger dashboard-content__management-movie-btn--sm"
              onClick={ async(e) => {
                e.stopPropagation();

                if (window.confirm("Bạn có chắc muốn xoá không?")) {
                  try {
                    setLoading(true);
                    var result = await action.payload.delete(item[attributeList.id]);
                    if (result) {
                      alert("Đã xóa thành công");
                      setList(list.filter(item => item[attributeList.id] !== result[attributeList.id]));
                      setChoosingId(null);
                      setButton({
                        text: "Lưu",
                        icon: "💾 ",
                      });
                      setInput("");
                    }
                    setLoading(false);
                  } catch (err) {
                    alert(
                      err.response?.data?.message ||
                        `Xóa ${action.type} thất bại`
                    );
                    setLoading(false);
                  }
                }
              }}
            >
              <i className="fa-solid fa-trash"></i> Xóa
            </button>
          </div>
        </li>
      );
    });
  };

  return (
    <>
      <div id="modal-add-genre" className="multi-select-modal-overlay">
        <div className="multi-select-modal">
          {/* Header */}
          <div className="dashboard-content__management-movie-modal-header">
            <h2 className="dashboard-content__management-movie-modal-title">
              <span className="dashboard-content__management-movie-modal-title-icon">
                <i className="fa-solid fa-gear"></i>
              </span>
              Quản lý {action.type}
            </h2>
            <button
              className="dashboard-content__management-movie-modal-close"
              onClick={() => setOpenManagementInfoModal(false)}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="dashboard-content__management-movie-modal-body">
            {/* Form thêm / sửa */}
            <div className="dashboard-content__management-movie-form-group">
              <label className="dashboard-content__management-movie-form-label">
                Tên {action.type} <span>*</span>
              </label>
              <div className="attribute-input-row">
                <input
                  type="text"
                  className="dashboard-content__management-movie-form-input"
                  placeholder={`Nhập ${action.type}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--primary dashboard-content__management-movie-btn--sm"
                  onClick={() => handleButton()}
                >
                  {button.icon} {button.text}
                </button>

                {choosingId && (
                  <button
                    className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--danger dashboard-content__management-movie-btn--sm"
                    onClick={() => {
                      setChoosingId(null);
                      setButton({
                        text: "Lưu",
                        icon: "💾 ",
                      });
                      setInput("");
                    }}
                  >
                    <i className="fa-regular fa-circle-xmark"></i> Huỷ
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="attribute-divider"></div>

            <div className="attribute-search-wrap">
              <i className="fa-solid fa-magnifying-glass attribute-search-icon"></i>
              <input
                type="text"
                className="attribute-search"
                placeholder={`Tìm ${action.type}...`}
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </div>

            {/* Danh sách */}
            <div className="attribute-list-label">Danh sách {action.type}</div>
            <ul className="attribute-list">{renderList()}</ul>
          </div>

          {/* Footer */}
          {/* <div className="dashboard-content__management-movie-modal-footer">
            <button
              className="dashboard-content__management-movie-btn dashboard-content__management-movie-btn--outline"
              onClick={() => setOpenManagementInfoModal(false)}
            >
              Đóng
            </button>
          </div> */}
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
}

export default ManagementAttributeMovieModal;
