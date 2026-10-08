import API from "../../api/axios";

export const getProducts = (params) => API.get("/product/all-products", { params });
export const getProduct = (id) => API.get(`/product/single-product/${id}`);
export const getFeaturedProducts = () => API.get("/product/featured-products");
export const getNewArrivals = () => API.get("/product/new-arrivals");
export const getRelatedProducts = (id) => API.get(`/product/related-products/${id}`);
