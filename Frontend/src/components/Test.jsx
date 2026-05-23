import { useEffect } from "react";
import { seatHubService } from "../services/hub/seatHubService";

function Test() {
  useEffect(() => {
    // start connect
    seatHubService.start();

    // lắng nghe event
    seatHubService.onSeatHold((seatId) => {
      console.log("🔥 Nhận từ server:", seatId);
    });

    return () => {
      seatHubService.stop();
    };
  }, []);

  const handleClick = () => {
    seatHubService.sendSeatHold("A1");
  };

  return (
    <div>
      <button onClick={handleClick}>Test giữ ghế A1</button>
    </div>
  );
}

export default Test;