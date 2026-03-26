import axios from 'axios';

// 1. On récupère l'URL (ex: https://talibjob-backend.up.railway.app/api)
let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 2. NETTOYAGE RADICAL : On enlève les espaces et les "/" à la fin
backendUrl = backendUrl.trim().replace(/\/+$/, "");

// 3. Si l'URL finit déjà par "/api", on le supprime (pour éviter le double /api/api)
if (backendUrl.endsWith('/api')) {
    backendUrl = backendUrl.substring(0, backendUrl.length - 4);
}

// 4. Maintenant on crée l'instance avec UNE SEULE FOIS /api
const api = axios.create({
  baseURL: `${backendUrl}/api`, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;