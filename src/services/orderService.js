import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (orderData) => {
  const response = await axios.post(
    `${API_URL}/orders`,
    orderData
  );

  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(
    `${API_URL}/orders`
  );

  return response.data;
};

export const updateOrderStatus = async (
  id,
  status
) => {
  const response = await axios.patch(
    `${API_URL}/orders/${id}`,
    {
      status
    }
  );

  return response.data;
};