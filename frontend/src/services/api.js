import axios from 'axios'


const api = axios.create({
  baseURL: "https://farida-sbrand-production.up.railway.app/api",
});


export default api