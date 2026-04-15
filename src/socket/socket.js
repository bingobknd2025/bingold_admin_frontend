import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
};

const createSocket = () => {
  const token = sessionStorage.getItem("accessToken");

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      "x-api-key": import.meta.env.VITE_API_KEY,
    },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.warn("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("🔴 Socket connection error:", err.message);
  });

  return socket;
};

export const reconnectSocket = (newToken) => {
  if (socket) {
    socket.auth = { token: newToken };
    socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${newToken}`,
      "x-api-key": import.meta.env.VITE_API_KEY,
    };
    socket.disconnect().connect(); // ✅ reconnect with new token
  }
};
