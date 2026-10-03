import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAdminUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users`
  );

  return response.data;
};

export const getAdminUserById = async (id) => {
  const response = await axios.get(
    `${API_URL}/users/${id}`
  );

  return response.data;
};

export const updateAdminUser = async (
  id,
  userData
) => {
  const response = await axios.patch(
    `${API_URL}/users/${id}`,
    userData
  );

  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await axios.delete(
    `${API_URL}/users/${id}`
  );

  return response.data;
};