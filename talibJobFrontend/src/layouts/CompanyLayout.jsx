import { useState, useRef, useEffect } from "react";
import logo from "../img/logoFinalTalibJob-removebg-preview.png";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./CompanyLayout.css";

export default function CompanyLayout() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const entreprise = JSON.parse(localStorage.getItem("entreprise") || "{}");

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/company/dashboard",       icon: "bi-grid-1x2-fill",   label: "Tableau de Bord"   },
    { to: "/company/MesOffres",       icon: "bi-briefcase-fill",  label: "Mes Offres"        },
    { to: "/company/offres/nouvelle", icon: "bi-plus-square-fill",label: "Publier une Offre" },
    { to: "/company/parametres",      icon: "bi-gear-fill",       label: "Paramètres"        },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("entreprise");
    navigate("/company/login");
  };

  const initial = (entreprise.nom || "E")[0].toUpperCase();

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6fb" }}>

      {/* ── Sidebar ──────────────────────────────────── */}
      <div
        className="d-flex flex-column"
        style={{
          width: sidebarOpen ? "220px" : "70px",
          minWidth: sidebarOpen ? "220px" : "70px",
          background: "#fff",
          borderRight: "1px solid #e8eaf0",
          transition: "all 0.25s ease",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Toggle + Logo */}
        <div className="d-flex align-items-center p-3 border-bottom" style={{ minHeight: "64px" }}>
          {sidebarOpen && (
            <Link to="/company/dashboard" className="text-decoration-none d-flex align-items-center gap-2">
              <img src={logo} alt="Logo" style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
              <span className="fw-bold" style={{ color: "#007bff", fontSize: "15px", marginRight: "10px" }}>TALIB-JOB</span>
            </Link>
          )}
          <button className="btn btn-sm me-2" style={{ border: "none", background: "none", padding: "4px" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="bi bi-list text-muted" style={{ fontSize: "25px" }}></i>
          </button>
        </div>

        {/* Profil entreprise */}
        {sidebarOpen && (
          <div className="text-center p-3 border-bottom">
            <div className="mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #fefefe, #0f9cde)", fontSize: "20px" }}>
              {initial}
            </div>
            <div className="fw-semibold small text-truncate" style={{ maxWidth: "180px" }}>
              {entreprise.nom || "Entreprise"}
            </div>
            <small className="text-muted" style={{ fontSize: "11px" }}>
              Logo de {entreprise.nom || "votre entreprise"}
            </small>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-fill p-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className="d-flex align-items-center gap-2 text-decoration-none rounded mb-1 px-3 py-2"
                style={{
                  background: active ? "#eff6ff" : "transparent",
                  color: active ? "#2563eb" : "#5a6a85",
                  fontWeight: active ? "600" : "400",
                  fontSize: "14px",
                  transition: "all 0.15s",
                }}
                title={!sidebarOpen ? item.label : ""}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: "16px", minWidth: "18px" }}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-2 border-top">
          <button onClick={handleLogout}
            className="btn d-flex align-items-center gap-2 w-100 px-3 py-2 text-start"
            style={{ color: "#dc3545", fontSize: "14px", fontWeight: "500", background: "none", border: "none" }}>
            <i className="bi bi-box-arrow-right" style={{ fontSize: "16px" }}></i>
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────── */}
      <div className="flex-fill d-flex flex-column" style={{ minWidth: 0 }}>

        {/* Top navbar */}
        <nav className="d-flex align-items-center px-4"
          style={{ height: "71px", background: "#fff", borderBottom: "1px solid #e8eaf0" }}>

          <div style={{ flex: 1 }} />

          {/* Center links */}
          <div className="d-flex align-items-center gap-4 justify-content-center">
            <Link to="/company/dashboard" className="nav-link-custom d-flex align-items-center gap-2">
              <i className="bi bi-speedometer2"></i>
              Mon Tableau de Bord
            </Link>
            <Link to="/company/offres/nouvelle" className="nav-link-custom d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle"></i>
              Publier une offre
            </Link>
          </div>

          {/* Right side */}
          <div className="d-flex align-items-center gap-3 justify-content-end" style={{ flex: 1 }}>

            {/* ── Avatar + dropdown ── */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              {/* Avatar button */}
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 0.18s",
                  boxShadow: dropdownOpen ? "0 0 0 3px rgba(59,130,246,0.25)" : "none",
                }}
              >
                {initial}
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  minWidth: "220px",
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 10px 32px rgba(0,0,0,0.10)",
                  overflow: "hidden",
                  zIndex: 999,
                  animation: "dropdownFade 0.18s ease",
                }}>
                  {/* User info */}
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
                        color: "#fff", fontWeight: 700, fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {initial}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {entreprise.nom || "Entreprise"}
                        </div>
                        <div style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {entreprise.email || "email@exemple.com"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "6px" }}>
                    <Link
                      to="/company/parametres"
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
            {/* ── end dropdown ── */}

            <button onClick={handleLogout} className="logout-btn">
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </nav>

        {/* Page content */}
        <div className="flex-fill p-4" style={{ overflow: "auto" }}>
          <Outlet />
        </div>

        <footer className="text-center"
          style={{ fontSize: "12px", color: "#9ca3af", borderTop: "1px solid #e8eaf0", background: "#fff", height: "54px", paddingTop: "20px" }}>
          © 2025 TALIB-JOB. Tous droits réservés.
        </footer>
      </div>

      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
