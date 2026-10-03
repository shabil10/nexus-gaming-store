import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async () => {
  const response = await axios.get(
    `${API_URL}/products`
  );

  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(
    `${API_URL}/products/${id}`
  );

  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(
    `${API_URL}/products`,
    productData
  );

  return response.data;
};

export const updateProduct = async (
  id,
  productData
) => {
  const response = await axios.patch(
    `${API_URL}/products/${id}`,
    productData
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(
    `${API_URL}/products/${id}`
  );

  return response.data;
};

