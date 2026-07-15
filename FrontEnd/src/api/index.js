import axios from "axios";
import { message } from "antd";

// Auth is an httpOnly cookie set by the backend on login; the browser attaches
// it automatically (same origin via the Vite proxy), so no request interceptor
// or localStorage token handling is needed.
export const axiosInstance = axios.create({
  baseURL: "/bms",
  headers: {
    "Content-Type": "application/json",
  },
});

// 401s from these endpoints are contextual failures (wrong password, bad OTP…)
// that the calling component reports — not an expired session.
const AUTH_PATHS = [
  "/users/login",
  "/users/register",
  "/users/forgetPassword",
  "/users/resetPassword",
];

// Single global alert channel with a short de-dup window, so an interceptor
// toast and a component toast for the same failure don't stack.
let lastAlert = { text: null, ts: 0 };
export const showError = (text) => {
  if (!text) return;
  const now = Date.now();
  if (text === lastAlert.text && now - lastAlert.ts < 2000) return;
  lastAlert = { text, ts: now };
  message.error(text);
};

const handleExpiredSession = (navigate) => {
  const path = window.location.pathname;
  if (path !== "/login" && path !== "/reset" && path !== "/forget") {
    message.warning("Please log in to continue.");
    navigate("/login");
  }
};

export const setupAxiosInterceptors = (navigate) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error.config?.url || "";
      const isAuthPath = AUTH_PATHS.some((p) => url.includes(p));
      if (error.response?.status === 401 && !isAuthPath) {
        handleExpiredSession(navigate);
      } else if (!isAuthPath) {
        showError(error.response?.data?.message || error.message);
      }
      return Promise.reject(error);
    }
  );
};
