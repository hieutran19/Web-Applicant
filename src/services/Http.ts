import axios from "axios";


const API_URL = import.meta.env.VITE_URL_LINKS; 
const Http = axios.create({
    baseURL: API_URL,
});

export default Http;
