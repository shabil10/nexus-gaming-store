import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getDashboardData = async () => {
  const productsResponse = await axios.get(
    `${API_URL}/products`
  );

  const usersResponse = await axios.get(
    `${API_URL}/users`
  );

  const ordersResponse = await axios.get(
    `${API_URL}/orders`
  );

  const products =
    productsResponse.data;

  const users =
    usersResponse.data;

  const orders =
    ordersResponse.data;

  const activeProducts =
    products.filter(
      (product) =>
        product.isDeleted !== true
    );

  const activeUsers =
    users.filter(
      (user) =>
        user.isDeleted !== true
    );

  const revenue = orders.reduce(
    (total, order) => {
      return (
        total +
        Number(order.total || 0)
      );
    },
    0
  );

  const lowStockProducts =
    activeProducts.filter(
      (product) =>
        Number(product.stock) <= 5
    );

  const recentOrders = [
    ...orders
  ]
    .sort(
      (a, b) =>
        new Date(b.orderDate) -
        new Date(a.orderDate)
    )
    .slice(0, 5);

  return {
    productsCount:
      activeProducts.length,

    usersCount:
      activeUsers.length,

    ordersCount:
      orders.length,

    revenue,

    lowStockProducts,

    recentOrders
  };
};