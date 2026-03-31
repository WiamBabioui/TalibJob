import axios from 'axios';

// Détection automatique de l'URL
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const api = axios.create({
  // Si local -> localhost, sinon -> URL actuelle de Railway
  baseURL: isLocal ? 'http://localhost:8000/api' : '/api',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Nécessaire pour Sanctum
});

// Ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;