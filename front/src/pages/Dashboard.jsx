import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function avatarColor(name = "") {
  const colors = [
    ["#dbeafe", "#1d4ed8"], ["#dcfce7", "#15803d"], ["#f3e8ff", "#7c3aed"],
    ["#ffedd5", "#c2410c"], ["#fce7f3", "#be185d"], ["#e0f2fe", "#0369a1"],
  ];
  const i = (name.charCodeAt(0) || 0) % colors.length;
  return colors[i];
}

const typeColors = {
  Stage:           { bg: "#eff6ff", color: "#1d4ed8" },
  CDD:             { bg: "#f0fdf4", color: "#16a34a" },
  CDI:             { bg: "#f5f3ff", color: "#7c3aed" },
  Freelance:       { bg: "#fff7ed", color: "#d97706" },
  Alternance:      { bg: "#fdf2f8", color: "#9d174d" },
  "Temps partiel": { bg: "#f0fdfa", color: "#0f766e" },
};

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const etudiant  = JSON.parse(localStorage.getItem("etudiant") || "{}");
  const fullName  = `${etudiant.prenom || ""} ${etudiant.nom || ""}`.trim() || "Étudiant";
  const initial   = fullName[0]?.toUpperCase() || "E";
  const [bgColor, textColor] = avatarColor(fullName);

  useEffect(() => {
    api.get("/api/etudiant/dashboard")
      .then(r => setData(r.data.data))
      .catch(e => { if (e.response?.status === 401) navigate("/student/login"); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  const profil      = data?.profil      || {};
  const offres      = data?.offres      || [];
  const activite    = data?.activite    || [];
  const progression = data?.progression ?? 0;
  const stats       = data?.stats       || {};

  const profilName  =  fullName;
  const profilInit  = profilName[0]?.toUpperCase() || "E";
  const [pbg, ptc]  = avatarColor(profilName);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: 22 }}>
            Bonjour, {etudiant.prenom || profil.prenom || "Étudiant"} 👋
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>Bienvenue sur votre tableau de bord</p>
        </div>
        <Link to="/jobs" className="btn btn-primary d-flex align-items-center gap-2"
          style={{ borderRadius: 8, fontSize: 13 }}>
          <i className="bi bi-search" />
          Chercher des offres
        </Link>
      </div>

      <div className="row g-4">
        {/* ── GAUCHE ── */}
        <div className="col-lg-8">

          {/* Profil card */}
          <div className="card p-4 mb-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Mon Profil</h5>
              <Link to="/profil" className="text-decoration-none small" style={{ color: "#3b82f6" }}>
                <i className="bi bi-pencil me-1" />Modifier
              </Link>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-3">
              {/* Avatar initiale */}
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: pbg, color: ptc,
                fontWeight: 800, fontSize: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {profilInit}
              </div>
              <div>
                <h6 className="mb-0 fw-bold">{profilName}</h6>
                <small className="text-muted">{profil.email || etudiant.email}</small>
                <p className="mb-2 mt-1" style={{ color: "#3b82f6", fontSize: 13 }}>
                  {profil.filiere || "—"} · {profil.telephone || "—"}
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  {(profil.competences || []).map(s => (
                    <span key={s} className="badge" style={{ background: "#eff6ff", color: "#1d4ed8", fontWeight: 600, fontSize: 11 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="row g-3 mb-4">
            {[
              { label: "Total",      value: stats.total      || 0, bg: "#eff6ff", color: "#1d4ed8", icon: "bi-send"              },
              { label: "Acceptées",  value: stats.acceptees  || 0, bg: "#f0fdf4", color: "#16a34a", icon: "bi-check-circle"      },
              { label: "En attente", value: stats.en_attente || 0, bg: "#fffbeb", color: "#d97706", icon: "bi-hourglass-split"   },
              { label: "Refusées",   value: stats.refusees   || 0, bg: "#fef2f2", color: "#dc2626", icon: "bi-x-circle"         },
            ].map(s => (
              <div key={s.label} className="col-6 col-md-3">
                <div className="card text-center p-3 h-100" style={{ borderRadius: 12, border: `1px solid ${s.bg}`, background: s.bg }}>
                  <i className={`bi ${s.icon} mb-1`} style={{ fontSize: 22, color: s.color }} />
                  <h4 className="fw-bold mb-0" style={{ color: s.color }}>{s.value}</h4>
                  <small style={{ color: s.color, opacity: 0.8, fontSize: 11 }}>{s.label}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Offres recommandées */}
          <div className="card p-4 mb-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Offres Recommandées</h5>
              <Link to="/jobs" className="text-decoration-none small" style={{ color: "#3b82f6" }}>
                <i className="bi bi-eye me-1" />Voir toutes
              </Link>
            </div>
            {offres.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-briefcase text-muted" style={{ fontSize: 36 }} />
                <p className="text-muted mt-2 mb-0 small">Aucune offre disponible pour le moment.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {offres.map(o => {
                  const tc = typeColors[o.type] || { bg: "#f3f4f6", color: "#374151" };
                  const [obg, otc] = avatarColor(o.entreprise || "");
                  return (
                    <div key={o.id} className="d-flex justify-content-between align-items-center p-3 rounded"
                      style={{ border: "1px solid #f0f0f0", background: "#fafafa" }}>
                      <div className="d-flex align-items-center gap-3">
                        {/* Avatar entreprise */}
                        <div style={{
                          width: 38, height: 38, borderRadius: 10,
                          background: obg, color: otc,
                          fontWeight: 700, fontSize: 15,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {(o.entreprise || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: 14 }}>{o.titre}</div>
                          <small className="text-muted">{o.entreprise} · {o.lieu}</small>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end gap-1">
                        <span className="badge" style={{ background: tc.bg, color: tc.color, fontSize: 11, fontWeight: 600 }}>{o.type}</span>
                        {o.remuneration && (
                          <small style={{ color: "#059669", fontWeight: 600 }}>{Number(o.remuneration).toLocaleString()} MAD</small>
                        )}
                        <Link to={`/jobs/${o.id}`}
                          className="btn btn-sm"
                          style={{ fontSize: 11, padding: "2px 10px", borderRadius: 6, background: "#eff6ff", color: "#1d4ed8", border: "none", fontWeight: 600 }}>
                          Postuler →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions rapides */}
          <div className="card p-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
            <h5 className="fw-bold mb-4">Actions Rapides</h5>
            <div className="row g-3">
              {[
                { to: "/candidatures", icon: "bi-folder-check", label: "Mes candidatures", color: "#3b82f6" },
                { to: "/profil",       icon: "bi-person",        label: "Mon profil",        color: "#8b5cf6" },
                { to: "/jobs",         icon: "bi-search",        label: "Chercher des jobs", color: "#10b981" },
                { to: "/parametres",   icon: "bi-gear",          label: "Paramètres",        color: "#f59e0b" },
              ].map(a => (
                <div key={a.to} className="col-6">
                  <Link to={a.to} className="text-decoration-none">
                    <div className="border rounded p-3 text-center h-100"
                      style={{ borderRadius: 12, transition: "box-shadow 0.18s, transform 0.18s", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                      <i className={`bi ${a.icon} fs-4`} style={{ color: a.color }} />
                      <p className="mt-2 mb-0 fw-semibold small">{a.label}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DROITE ── */}
        <div className="col-lg-4">

          {/* Profil complété */}
          <div className="card p-4 mb-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
            <h5 className="fw-bold text-center mb-2">Profil Complété</h5>
            <p className="display-6 fw-bold text-center mb-1" style={{ color: "#3b82f6" }}>{progression}%</p>
            <p className="text-muted text-center small mb-3">de votre profil est complété</p>
            <div className="progress mb-4" style={{ height: 8, borderRadius: 8 }}>
              <div className="progress-bar" style={{ width: `${progression}%`, background: "#3b82f6", borderRadius: 8 }} />
            </div>
            <Link to="/profil" className="btn btn-outline-primary btn-sm w-100" style={{ borderRadius: 8 }}>
              <i className="bi bi-pencil me-2" />Compléter mon profil
            </Link>
          </div>

          {/* Activité récente */}
          <div className="card p-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
            <h6 className="fw-bold mb-3">Activité Récente</h6>
            {activite.length === 0 ? (
              <div className="text-center py-3">
                <i className="bi bi-clock-history text-muted" style={{ fontSize: 28 }} />
                <p className="text-muted small mt-2 mb-0">Aucune activité récente.</p>
              </div>
            ) : (
              activite.map((a, i) => (
                <div key={i}>
                  {i > 0 && <hr className="my-2" />}
                  <p className="mb-0 small fw-semibold">{a.action}</p>
                  <small className="text-muted">{a.date}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}