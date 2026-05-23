import * as signalR from "@microsoft/signalr";

export const createConnection = (url) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(url)
    .withAutomaticReconnect()
    .build();

  let startingPromise = null;

  // ===== START =====
  const start = async () => {
    if (connection.state === "Connected") return;
    if (connection.state === "Connecting" || startingPromise) return startingPromise;

    startingPromise = connection.start()
      .then(() => console.log(`✅ Connected to ${url}`))
      .catch((err) => {
        console.error(`❌ Connect fail ${url}:`, err);
        throw err; // ⬆️ để invoke biết mà không gọi tiếp
      })
      .finally(() => {
        startingPromise = null;
      });

    return startingPromise;
  };

  // ===== STOP =====
  const stop = async () => {
    if (connection.state === "Disconnected") return;
    await connection.stop();
    console.log("⛔ Disconnected");
  };

  // ===== LISTEN EVENT =====
  const on = (eventName, callback) => {
    connection.off(eventName);
    connection.on(eventName, callback);
  };

  // ===== REMOVE EVENT =====
  const off = (eventName) => {
    connection.off(eventName);
  };

  // ===== CALL SERVER =====
  const invoke = async (method, ...args) => {
    if (connection.state !== "Connected") {
      await start(); // nếu start() throw thì invoke dừng luôn
    }
    return connection.invoke(method, ...args);
  };

  // ===== RECONNECT LOG =====
  connection.onreconnecting(() => console.warn("⚠️ Reconnecting..."));
  connection.onreconnected(() => console.log("🔄 Reconnected"));
  connection.onclose(() => console.log("❌ Connection closed"));

  return { connection, start, stop, on, off, invoke };
};