import axios from "axios";

export const cancelOrder = async (orderId, token) => {
  const url = `/api/orders/${orderId}/cancel`;
  try {
    const response = await axios.post(url, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};
