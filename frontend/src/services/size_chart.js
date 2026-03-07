import api from "./api";

const getall_size_chart=()=>api.get("/size_chart/getall_sizeCharts")

const get_chart=(id)=>api.get(`/size_chart/get_sizeChart/${id}`)

export default {getall_size_chart,get_chart}