import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../img/logoFinalTalibJob.png";

function avatarColor(name = "") {
  const colors = [
    ["#dbeafe", "#1d4ed8"],
    ["#dcfce7", "#15803d"],
    ["#f3e8ff", "#7c3aed"],
    ["#ffedd5", "#c2410c"],
    ["#fce7f3", "#be185d"],
    ["#e0f2fe", "#0369a1"],
  ];
  const i = (name.charCodeAt(0) || 0) % colors.length;
  return colors[i];
}

function getEtudiant() {
  try {
    return JSON.parse(localStorage.getItem("etudiant") || "{}");
  } catch {
    return {};
  }
}

const BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : "";

function normalizePhoto(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  // chemin relatif stocké comme "photos/xxx.jpg"
  return `${BASE}/storage/${url}`;
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [etudiant, setEtudiant] = useState(getEtudiant);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const sync = () => setEtudiant(getEtudiant());
    window.addEventListener("storage", sync);
    window.addEventListener("etudiant-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("etudiant-updated", sync);
    };
  }, []);

  // Rafraîchir les données depuis l'API au montage pour récupérer la photo à jour
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch((window.location.hostname === "localhost" ? "http://localhost:8000" : "") + "/api/etudiant/me", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const updated = {
          ...getEtudiant(),
          photoProfil: data.photoProfil || getEtudiant().photoProfil,
          nom: data.nom || getEtudiant().nom,
          prenom: data.prenom || getEtudiant().prenom,
          email: data.email || getEtudiant().email,
        };
        localStorage.setItem("etudiant", JSON.stringify(updated));
        setEtudiant(updated);
      })
      .catch(() => {});
  }, []);

  const fullName =
    `${etudiant.prenom || ""} ${etudiant.nom || ""}`.trim() || "Étudiant";
  const initial = fullName[0]?.toUpperCase() || "E";
  const [bgColor, textColor] = avatarColor(fullName);
  const photoUrl = normalizePhoto(etudiant.photoProfil);

  const isActive = (path) => location.pathname === `/${path}`;

  const menuItems = [
    { path: "Dashboard", icon: "bi-speedometer2", label: "Tableau de Bord" },
    { path: "profil", icon: "bi-person", label: "Mon Profil" },
    // { path: "candidatures", icon: "bi-file-earmark-text", label: "Mes Candidatures" },
    { path: "jobs", icon: "bi-briefcase", label: "Offres d'emploi" },
    { path: "parametres", icon: "bi-gear", label: "Paramètres" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("etudiant");
    navigate("/student/login");
  };

  const navLinks = [
    { to: "/Dashboard", icon: "bi-speedometer2", label: "Tableau de Bord" },
    { to: "/jobs", icon: "bi-briefcase", label: "Offres d'emploi" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── SIDEBAR ── */}
      <div
        className="bg-white border-end d-flex flex-column"
        style={{
          width: sidebarOpen ? "220px" : "60px",
          minWidth: sidebarOpen ? "220px" : "6px",
          transition: "width 0.3s, min-width 0.3s",
          overflow: "hidden",
        }}
      >
        {/* Logo + toggle */}
        <div
          className="d-flex align-items-center p-3 border-bottom"
          style={{ cursor: "pointer", gap: "15px", minHeight: "64px" }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          {sidebarOpen && (
            <span
              className="fw-bold"
              style={{
                color: "#007bff",
                fontSize: "15px",
                whiteSpace: "nowrap",
              }}
            >
              TALIB-JOB
            </span>
          )}
          <i
            className={`bi ms-auto ${sidebarOpen ? "bi-chevron-left" : "bi-chevron-right"}`}
            style={{ color: "#6c757d", flexShrink: 0 }}
          />
        </div>

        {/* Avatar */}
        <div
          className={`d-flex align-items-center p-3 border-bottom ${!sidebarOpen ? "justify-content-center" : ""}`}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="avatar"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: bgColor,
                  color: textColor,
                  fontWeight: 700,
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {initial}
              </div>
            )}
            <span
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 10,
                height: 10,
                background: "#22c55e",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
          </div>
          {sidebarOpen && (
            <div className="ms-2 overflow-hidden">
              <div
                className="fw-semibold"
                style={{
                  fontSize: "13.5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 130,
                }}
              >
                {fullName}
              </div>
              <small
                className="text-muted"
                style={{ whiteSpace: "nowrap", fontSize: "11.5px" }}
              >
                {etudiant.email || "Étudiant"}
              </small>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-fill p-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={`/${item.path}`}
                className="d-flex align-items-center rounded p-2 mb-1 text-decoration-none"
                style={{
                  color: active ? "#fff" : "#495057",
                  background: active ? "#3b82f6" : "transparent",
                  gap: "10px",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 400,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <i
                  className={`bi ${item.icon}`}
                  style={{ fontSize: "17px", flexShrink: 0 }}
                />
                {sidebarOpen && (
                  <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-2 border-top">
          <button
            onClick={handleLogout}
            className="btn d-flex align-items-center w-100"
            style={{
              gap: "10px",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              background: "transparent",
              border: "none",
              color: "#ef4444",
              fontSize: "14px",
            }}
          >
            <i
              className="bi bi-box-arrow-right"
              style={{ fontSize: "17px", flexShrink: 0 }}
            />
            {sidebarOpen && (
              <span style={{ whiteSpace: "nowrap" }}>Déconnexion</span>
            )}
          </button>
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="flex-fill d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Navbar */}
        <nav
          className="bg-white border-bottom px-4 d-flex align-items-center"
          style={{ height: "69px", flexShrink: 0, position: "relative" }}
        >
          {/* Espace gauche */}
          <div style={{ flex: 1 }} />

          {/* ✅ Links centrés */}
          <div
            className="d-flex align-items-center gap-4"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {navLinks.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-decoration-none fw-semibold small d-flex align-items-center gap-1"
                  style={{
                    color: active ? "#3b82f6" : "#6b7280",
                    paddingBottom: "2px",
                    borderBottom: active
                      ? "2px solid #ff9800"
                      : "2px solid transparent",
                    transition: "color 0.15s",
                  }}
                >
                  <i className={`bi ${l.icon}`} />
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Avatar droite + dropdown */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <div ref={dropdownRef} style={{ position: "relative" }}>
              {/* Bouton avatar */}
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: bgColor, color: textColor,
                  fontWeight: 700, fontSize: 14,
                  border: "2px solid #e8eaf0",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", padding: 0,
                  boxShadow: dropdownOpen ? "0 0 0 3px rgba(59,130,246,0.25)" : "none",
                  transition: "box-shadow 0.18s",
                }}
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : initial}
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  minWidth: "220px", background: "#fff", borderRadius: "12px",
                  border: "1px solid #e5e7eb", boxShadow: "0 10px 32px rgba(0,0,0,0.10)",
                  overflow: "hidden", zIndex: 999,
                  animation: "dropdownFade 0.18s ease",
                }}>
                  {/* Infos utilisateur */}
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: bgColor, color: textColor,
                        fontWeight: 700, fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, overflow: "hidden",
                      }}>
                        {photoUrl
                          ? <img src={photoUrl} alt="avatar"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : initial}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {fullName}
                        </div>
                        <div style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {etudiant.email || "email@exemple.com"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "6px" }}>
                    <Link
                      to="/parametres"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: 9,
                        padding: "9px 12px", borderRadius: 8,
                        color: "#374151", fontSize: 13.5, fontWeight: 500,
                        textDecoration: "none", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <i className="bi bi-gear" style={{ fontSize: 15, color: "#6b7280" }}></i>
                      Paramètres
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex", alignItems: "center", gap: 9,
                        padding: "9px 12px", borderRadius: 8,
                        color: "#ef4444", fontSize: 13.5, fontWeight: 500,
                        background: "none", border: "none", width: "100%",
                        cursor: "pointer", transition: "background 0.15s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <i className="bi bi-box-arrow-right" style={{ fontSize: 15 }}></i>
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes dropdownFade {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </nav>

        {/* Page content */}
        <main
          className="flex-fill p-4"
          style={{ background: "#f8fafc", overflow: "auto" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}