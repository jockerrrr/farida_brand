import api from "./api";

const shipping=()=>api.get("/settings/getall_settings")


export default shipping