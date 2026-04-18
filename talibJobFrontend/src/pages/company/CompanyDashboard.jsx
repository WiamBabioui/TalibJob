import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import '../../components/App.css'
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
  const handleDelete = async (id) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

  try {
    await api.delete(`/entreprise/missions/${id}`);
    setData((prev) => ({
      ...prev,
      offres: prev.offres.filter((o) => o.id !== id)
    }));
  } catch (error) {
    console.error("Erreur suppression", error);
  }
};

  useEffect(() => {
    api.get("/entreprise/dashboard")
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
    <div className="container-fluid px-3 px-md-4">

      {/* Header */}
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h3 className="fw-bold mb-1">Bienvenue, {entreprise.nom || "Entreprise"} !</h3>
          <p className="text-muted mb-0">Voici un aperçu de votre activité de recrutement.</p>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          <Link to="/company/offres/nouvelle" className="btn btn-primary w-100 w-sm-auto">
            <i className="bi bi-plus-circle-fill me-2"></i> Publier
          </Link>

          <Link to="/company/candidatures" className="btn btn-outline-primary w-100 w-sm-auto">
            <i className="bi bi-people me-2"></i> Candidatures
          </Link>

          <Link to="/company/MesOffres" className="btn btn-outline-primary w-100 w-sm-auto">
            <i className="bi bi-briefcase me-2"></i> Offres
          </Link>
        </div>
      </div>

      {/* Stats */}
      <h6 className="fw-bold mb-3 text-secondary text-uppercase" style={{ fontSize: "12px" }}>
        Vos statistiques clés
      </h6>

      <div className="row g-3 mb-4">
        {[
          { label: "Applications", value: stats.candidatures_totales || 0, icon: "bi-send-fill", color: "#2563eb", bg: "#eff6ff" },
          { label: "Vues", value: stats.vues_totales || 0, icon: "bi-eye-fill", color: "#0891b2", bg: "#ecfeff" },
          { label: "Offres", value: stats.offres_actives || 0, icon: "bi-check-circle-fill", color: "#059669", bg: "#ecfdf5" },
          { label: "Candidats", value: stats.nouveaux_candidats || 0, icon: "bi-person-plus-fill", color: "#d97706", bg: "#fffbeb" },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-4 col-xl-3">
            <div className="card border-0 shadow-sm h-100 p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div style={{ background: s.bg, padding: "8px", borderRadius: "8px" }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
                </div>
              </div>

              <small className="text-muted">{s.label}</small>
              <h5 className="fw-bold mb-0">{Number(s.value).toLocaleString()}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="row g-4">

        {/* Offres */}
        <div className="col-12 col-lg-8">
          <div className="card p-3">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Mes Offres</h5>
              <Link to="/company/MesOffres">Voir toutes</Link>
            </div>

            {offres.length === 0 ? (
              <p className="text-muted text-center">Aucune offre</p>
            ) : (
              offres.map((o) => {
                const cfg = statusConfig[o.statut] || statusConfig.brouillon;

                return (
                  <div
                    key={o.id}
                    className="d-flex flex-column flex-md-row justify-content-between gap-3 p-3 mb-2 border rounded"
                  >
                    <div>
                      <h6 className="mb-1">{o.titre}</h6>
                      <small className="text-muted">
                        {o.nombreCandidatures} candidatures
                      </small>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-2">

  <Link
    to={`/company/offres/${o.id}/modifier`}
    className="btn btn-sm btn-warning"
    style={{ width: "110px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
  >
    Modifier
  </Link>

  <button
    className="btn btn-sm btn-danger"
    onClick={() => handleDelete(o.id)}
    style={{ width: "110px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    Supprimer
  </button>

  <Link
    to={`/company/offres/${o.id}/candidatures`}
    className="btn btn-sm btn-primary"
    style={{ width: "110px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    Voir
  </Link>

</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activités */}
        <div className="col-12 col-lg-4">
          <div className="card p-3">
            <h6 className="fw-bold mb-3">Activités</h6>

            {activites.length === 0 ? (
              <p className="text-muted text-center">Aucune activité</p>
            ) : (
              activites.map((a, i) => (
                <div key={i} className="mb-3">
                  <p className="mb-1 small">{a.texte}</p>
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