import axios from 'axios';

// On récupère l'URL, on enlève les espaces et les slashs à la fin
let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
backendUrl = backendUrl.trim().replace(/\/+$/, "");

// Si l'URL contient déjà /api, on l'enlève pour éviter le double /api/api
if (backendUrl.endsWith('/api')) {
    backendUrl = backendUrl.replace('/api', '');
}

console.log("DEBUG: Mon URL Backend est :", backendUrl);

const api = axios.create({
  baseURL: `${backendUrl}/api`, // On ajoute /api UNE SEULE FOIS ici
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
  // On affiche l'URL finale appelée dans la console pour vérifier
  console.log("Appel API vers :", config.baseURL + config.url);
  return config;
});

export default api;