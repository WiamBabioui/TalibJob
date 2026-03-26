import axios from "axios";

const API = axios.create({
  baseURL: "https://talibjob-backend.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter automatiquement le token si connecté
API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -------------------- ETUDIANT --------------------

export const registerStudent = (data) => {
  return API.post("/etudiant/register", data);
};

export const loginStudent = (data) => {
  return API.post("/etudiant/login", data);
};

export const getStudentProfile = () => {
  return API.get("/etudiant/me");
};

export const logoutStudent = () => {
  return API.post("/etudiant/logout");
};

// -------------------- MISSIONS --------------------

export const getMissions = () => {
  return API.get("/missions");
};

export const getMission = (id) => {
  return API.get(`/missions/${id}`);
};

export default API;