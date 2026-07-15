import { axiosInstance } from ".";

export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get("/bookings/getAllBookings");
    return response.data;
  } catch (err) {
    return err.response?.data || { success: false, message: err.message };
  }
};

// Hosted Stripe Checkout
export const createCheckoutSession = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/bookings/createCheckoutSession",
      payload
    );
    return response.data;
  } catch (err) {
    return err.response?.data || { success: false, message: err.message };
  }
};

export const confirmBooking = async (sessionId) => {
  try {
    const response = await axiosInstance.post("/bookings/confirmBooking", {
      sessionId,
    });
    return response.data;
  } catch (err) {
    return err.response?.data || { success: false, message: err.message };
  }
};
