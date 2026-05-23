import loadingGif from "../image/loading.gif";
import "../css/loading.css";

function Loading() {
  return (
    <div className="loading">
      <img src={loadingGif} alt="" />
    </div>
  );
}

export default Loading;
