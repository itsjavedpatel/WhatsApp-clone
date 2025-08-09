// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add initialization endpoint
export const initializeData = () => api.post("/init/initialize");
export const getConversations = () => api.get("/conversations");
export const getMessages = (wa_id) => api.get(`/messages/${wa_id}`);
export const sendMessage = (data) => api.post("/send", data);

export default api;
