// const BASE_URL = "http://localhost:4000";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const JSON_URL = "https://dummyjson.com";

export const API = {
  ADDRESS : `${BASE_URL}/addresses`,
  ORDERS: `${BASE_URL}/orders`,
  CARTS : `${BASE_URL}/carts`,

  PRODUCTS : `${JSON_URL}/products`
};