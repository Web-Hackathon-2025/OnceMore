import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/web/api", // Set your API base URL
});

// Automatically include token in every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("Sending Token:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;