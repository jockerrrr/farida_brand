import api from "./api";

const createOrder = (data) => api.post("/orders/create_order", data);

const verifyOrder = (order_number) => api.post("/orders/verify_order", { order_number });

const returnPolicy = (order_number, phone_number, items) => api.post("/orders/return_order", { order_number, phone_number, items });


export default {createOrder,returnPolicy,verifyOrder}