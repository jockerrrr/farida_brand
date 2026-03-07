import api from "./api";


const getAllProducts = () => api.get("/products/get_products");
const getProductById = (id) => api.get(`/products/get_product/${id}`);
const getNewCollection = () => api.get("/products/get_products?newCollection=true");

export default {getAllProducts,getNewCollection,getProductById}