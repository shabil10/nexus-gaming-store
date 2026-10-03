import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCouponByCode = async (code) => {
  const response = await axios.get(
    `${API_URL}/coupons`,
    {
      params: {
        code
      }
    }
  );

  return response.data;
};