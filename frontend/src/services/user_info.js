import api from "./api";

const create_userINFO=(data)=>api.post("/users/create_UserInfo",data)

export default create_userINFO