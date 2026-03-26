import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const statusConfig = {
  active:    { label: "Active",    bg: "#dcfce7", color: "#16a34a" },
  brouillon: { label: "Brouillon", bg: "#fef9c3", color: "#ca8a04" },
  fermee:    { label: "Fermée",    bg: "#fee2e2", color: "#dc2626" },
  pourvue:   { label: "Pourvue",   bg: "#f3e8ff", color: "#7c3aed" },
};

export default function CompanyDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const entreprise = JSON.parse(localStorage.getItem("entreprise") || "{}");

  useEffect(() => {
    api.get("/api/entreprise/dashboard")
      .then(r => setData(r.data))
      .catch(e => { if (e.response?.status === 401) navigate("/company/login"); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  const stats     = data?.stats     || {};
  const offres    = data?.offres    || [];
  const activites = data?.activites || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Bienvenue, {entreprise.nom || "Entreprise"} !</h3>
        <p className="text-muted mb-3">Voici un aperçu de votre activité de recrutement.</p>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/company/offres/nouvelle" className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle-fill"></i> Publier une nouvelle offre
          </Link>
          <Link to="/company/candidatures" className="btn btn-outline-primary d-flex align-items-center gap-2">
            <i className="bi bi-people"></i> Voir les candidatures
          </Link>
          <Link to="/company/MesOffres" className="btn btn-outline-primary d-flex align-items-center gap-2">
            <i className="bi bi-briefcase"></i> Gérer les offres
          </Link>
        </div>
      </div>

      {/* Stats */}
      <h6
  className="fw-bold mb-3 text-secondary text-uppercase"
  style={{ fontSize: "12px", letterSpacing: "1px" }}
>
  Vos statistiques clés
</h6>

<div className="row g-4 mb-4">
  {[
    {
      label: "Applications totales",
      value: stats.candidatures_totales || 0,
      sub: "+20% ce mois",
      icon: "bi-send-fill",
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Vues des offres",
      value: stats.vues_totales || 0,
      sub: "+15% cette semaine",
      icon: "bi-eye-fill",
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      label: "Offres actives",
      value: stats.offres_actives || 0,
      sub: "1 nouvelle offre en ligne",
      icon: "bi-check-circle-fill",
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "Nouveaux candidats",
      value: stats.nouveaux_candidats || 0,
      sub: "cette semaine",
      icon: "bi-person-plus-fill",
      color: "#d97706",
      bg: "#fffbeb",
    },
  ].map((s) => (
    <div key={s.label} className="col-6 col-xl-3">
      <div
        className="card border-0 shadow-sm h-100 p-4"
        style={{ borderRadius: "16px" }}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: s.bg,
            }}
          >
            <i
              className={`bi ${s.icon}`}
              style={{ color: s.color, fontSize: "18px" }}
            ></i>
          </div>

        </div>

        <small className="text-muted">{s.label}</small>

        <div
          className="fw-bold mt-1"
          style={{ fontSize: "30px", color: "#111827" }}
        >
          {Number(s.value).toLocaleString()}
        </div>

        <small className="text-success">{s.sub}</small>
      </div>
    </div>
  ))}
</div>

      {/* Offres + Activité */}
      <div className="row g-4">

        {/* Mes Offres */}
        <div className="col-lg-8">
  <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "14px" }}>
    
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h5 className="fw-semibold mb-0">Mes Offres Publiées</h5>

      <Link
        to="/company/Mesoffres"
        className="small text-decoration-none fw-medium"
        style={{ color: "#2563eb" }}
      >
        Voir toutes →
      </Link>
    </div>

    {offres.length === 0 ? (
      <div className="text-center py-5">
        <i className="bi bi-folder2-open text-muted" style={{ fontSize: "42px" }}></i>
        <p className="text-muted mt-3 mb-3">
          Vous n'avez pas encore publié d'offres.
        </p>

        <Link
          to="/company/offres/nouvelle"
          className="btn btn-primary btn-sm px-3"
        >
          Publier une offre
        </Link>
      </div>
    ) : (
      <div className="d-flex flex-column gap-3">
        {offres.map((o) => {
          const cfg = statusConfig[o.statut] || statusConfig.brouillon;

          return (
            <div
              key={o.id}
              className="d-flex align-items-center justify-content-between p-3"
              style={{
                borderRadius: "12px",
                border: "1px solid #eef0f4",
                borderLeft: `4px solid ${cfg.color}`,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "white")
              }
            >
              <div className="flex-grow-1">
                <h6 className="fw-semibold mb-1" style={{ fontSize: "14px" }}>
                  {o.titre}
                </h6>

                <div className="text-muted small">
                  <i className="bi bi-people me-1"></i>
                  {o.nombreCandidatures} candidatures
                  <span className="mx-2">•</span>
                  <i className="bi bi-clock me-1"></i>
                  {o.derniereMaj || "—"}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge"
                  style={{
                    background: cfg.bg,
                    color: cfg.color,
                    fontSize: "11px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {cfg.label}
                </span>

                <Link
                  to={`/company/offres/${o.id}/candidatures`}
                  className="btn btn-sm btn-primary"
                >
                  Candidatures
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
        </div>

        {/* Activités récentes */}
        <div className="col-lg-4">
  <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
    
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h5 className="fw-semibold mb-0">Activités Récentes</h5>
      <i className="bi bi-clock-history text-muted"></i>
    </div>

    {activites.length === 0 ? (
      <div className="text-center py-4">
        <i className="bi bi-bell text-muted" style={{ fontSize: "36px" }}></i>
        <p className="text-muted small mt-2 mb-0">
          Aucune activité récente
        </p>
      </div>
    ) : (
      <div className="d-flex flex-column gap-4 position-relative">

        {activites.map((a, i) => {
          const icons = {
            candidature: { icon: "bi-person-fill-add", bg: "#eef2ff", color: "#4f46e5" },
            vue:         { icon: "bi-eye-fill",         bg: "#ecfdf5", color: "#059669" },
            offre:       { icon: "bi-briefcase-fill",   bg: "#fff7ed", color: "#ea580c" },
            defaut:      { icon: "bi-bell-fill",        bg: "#f3f4f6", color: "#6b7280" },
          };

          const cfg = icons[a.type] || icons.defaut;

          return (
            <div key={i} className="d-flex gap-3">

              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: cfg.bg,
                }}
              >
                <i
                  className={`bi ${cfg.icon}`}
                  style={{ color: cfg.color, fontSize: "16px" }}
                ></i>
              </div>

              <div>
                <p
                  className="mb-1 small fw-medium"
                  style={{ color: "#374151", lineHeight: "1.4" }}
                >
                  {a.texte}
                </p>

                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {a.date}
                </small>
              </div>

            </div>
          );
        })}

      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
}
