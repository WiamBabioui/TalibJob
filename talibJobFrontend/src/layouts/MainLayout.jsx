import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../img/logotalibo.jpeg";

function avatarColor(name = "") {
  const colors = [
    ["#dbeafe", "#1d4ed8"], ["#dcfce7", "#15803d"], ["#f3e8ff", "#7c3aed"],
    ["#ffedd5", "#c2410c"], ["#fce7f3", "#be185d"], ["#e0f2fe", "#0369a1"],
  ];
  const i = (name.charCodeAt(0) || 0) % colors.length;
  return colors[i];
}

function getEtudiant() {
  try { return JSON.parse(localStorage.getItem("etudiant") || "{}"); }
  catch { return {}; }
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [etudiant, setEtudiant] = useState(getEtudiant);

  useEffect(() => {
    const sync = () => setEtudiant(getEtudiant());
    window.addEventListener("storage", sync);
    window.addEventListener("etudiant-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("etudiant-updated", sync);
    };
  }, []);

  const fullName = `${etudiant.prenom || ""} ${etudiant.nom || ""}`.trim() || "Étudiant";
  const initial  = fullName[0]?.toUpperCase() || "E";
  const [bgColor, textColor] = avatarColor(fullName);

  const isActive = (path) => location.pathname === `/${path}`;

  const menuItems = [
    { path: "Dashboard",    icon: "bi-speedometer2",      label: "Tableau de Bord"  },
    { path: "profil",       icon: "bi-person",            label: "Mon Profil"       },
    // { path: "candidatures", icon: "bi-file-earmark-text", label: "Mes Candidatures" },
    { path: "jobs",         icon: "bi-briefcase",         label: "Offres d'emploi"  },
    { path: "parametres",   icon: "bi-gear",              label: "Paramètres"       },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("etudiant");
    navigate("/student/login");
  };

  const navLinks = [
    { to: "/Dashboard", icon: "bi-speedometer2", label: "Tableau de Bord" },
    { to: "/jobs",      icon: "bi-briefcase",    label: "Offres d'emploi" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <div className="bg-white border-end d-flex flex-column"
        style={{
          width: sidebarOpen ? "220px" : "68px",
          minWidth: sidebarOpen ? "220px" : "68px",
          transition: "width 0.3s, min-width 0.3s",
          overflow: "hidden",
        }}>

        {/* Logo + toggle */}
        <div className="d-flex align-items-center p-3 border-bottom"
          style={{ cursor: "pointer", gap: "10px", minHeight: "64px" }}
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          <img src={logo} alt="Logo"
            style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
          {sidebarOpen && (
            <span className="fw-bold" style={{ color: "#007bff", fontSize: "15px", whiteSpace: "nowrap" }}>
              TALIB-JOB
            </span>
          )}
          <i className={`bi ms-auto ${sidebarOpen ? "bi-chevron-left" : "bi-chevron-right"}`}
            style={{ color: "#6c757d", flexShrink: 0 }} />
        </div>

        {/* Avatar */}
        <div className={`d-flex align-items-center p-3 border-bottom ${!sidebarOpen ? "justify-content-center" : ""}`}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: bgColor, color: textColor,
              fontWeight: 700, fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {initial}
            </div>
            <span style={{
              position: "absolute", bottom: 2, right: 2,
              width: 10, height: 10, background: "#22c55e",
              borderRadius: "50%", border: "2px solid white",
            }} />
          </div>
          {sidebarOpen && (
            <div className="ms-2 overflow-hidden">
              <div className="fw-semibold" style={{ fontSize: "13.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
                {fullName}
              </div>
              <small className="text-muted" style={{ whiteSpace: "nowrap", fontSize: "11.5px" }}>
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
              <Link key={item.path} to={`/${item.path}`}
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
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f1f5f9"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: "17px", flexShrink: 0 }} />
                {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-2 border-top">
          <button onClick={handleLogout}
            className="btn d-flex align-items-center w-100"
            style={{ gap: "10px", justifyContent: sidebarOpen ? "flex-start" : "center", background: "transparent", border: "none", color: "#ef4444", fontSize: "14px" }}>
            <i className="bi bi-box-arrow-right" style={{ fontSize: "17px", flexShrink: 0 }} />
            {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="flex-fill d-flex flex-column" style={{ minWidth: 0 }}>

        {/* Navbar */}
        <nav className="bg-white border-bottom px-4 d-flex align-items-center"
          style={{ height: "64px", flexShrink: 0, position: "relative" }}>

          {/* Espace gauche */}
          <div style={{ flex: 1 }} />

          {/* ✅ Links centrés */}
          <div className="d-flex align-items-center gap-4"
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {navLinks.map(l => {
              const active = location.pathname === l.to;
              return (
                <Link key={l.to} to={l.to}
                  className="text-decoration-none fw-semibold small d-flex align-items-center gap-1"
                  style={{
                    color: active ? "#3b82f6" : "#6b7280",
                    paddingBottom: "2px",
                    borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
                    transition: "color 0.15s",
                  }}>
                  <i className={`bi ${l.icon}`} />
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Avatar droite */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <div onClick={() => navigate("/profil")} title={fullName}
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: bgColor, color: textColor,
                fontWeight: 700, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
              {initial}
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-fill p-4" style={{ background: "#f8fafc", overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}