import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const statutOptions = [
  { value: "vue",      label: "Marquer comme vue" },
  { value: "acceptee", label: "Accepter" },
  { value: "refusee",  label: "Refuser" },
];

const statutConfig = {
  en_attente: { label: "En attente", bg: "#f3f4f6", color: "#374151" },
  vue:        { label: "Vue",        bg: "#dbeafe", color: "#1d4ed8" },
  acceptee:   { label: "Acceptée",   bg: "#dcfce7", color: "#16a34a" },
  refusee:    { label: "Refusée",    bg: "#fee2e2", color: "#dc2626" },
};

export default function CandidaturesMission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchData = () => {
    api.get(`/api/entreprise/missions/${id}/candidatures`)
      .then(r => setData(r.data))
      .catch(e => { if (e.response?.status === 401) navigate("/company/login"); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleStatut = async (candidatureId, statut) => {
    setUpdating(candidatureId);
    try {
      await api.put(`/api/entreprise/candidatures/${candidatureId}/statut`, { statut });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  const candidatures = data?.candidatures || [];

  return (
    <div>
      <div className="mb-4">
        <Link to="/company/offres" className="text-decoration-none text-muted small">
          <i className="bi bi-arrow-left me-1"></i> Mes offres
        </Link>
        <h3 className="fw-bold mt-2 mb-1">{data?.mission?.titre}</h3>
        <p className="text-muted">{candidatures.length} candidature{candidatures.length > 1 ? "s" : ""} reçue{candidatures.length > 1 ? "s" : ""}</p>
      </div>

      {candidatures.length === 0 ? (
        <div className="card p-5 text-center" style={{ borderRadius: "12px" }}>
          <i className="bi bi-people text-muted" style={{ fontSize: "48px" }}></i>
          <p className="text-muted mt-3">Aucune candidature reçue pour le moment.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {candidatures.map(c => {
            const cfg = statutConfig[c.statut] || statutConfig.en_attente;
            return (
              <div key={c.id} className="card p-4" style={{ borderRadius: "12px", border: "1px solid #e8eaf0" }}>
                <div className="row align-items-start g-3">
                  {/* Info étudiant */}
                  <div className="col-md-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                        style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #1a56db, #0ea5e9)", fontSize: "18px" }}
                      >
                        {(c.etudiant.prenom || "?")[0]}
                      </div>
                      <div>
                        <div className="fw-bold">{c.etudiant.prenom} {c.etudiant.nom}</div>
                        <small className="text-muted">{c.etudiant.email}</small>
                        {c.etudiant.telephone && <div><small className="text-muted"><i className="bi bi-telephone me-1"></i>{c.etudiant.telephone}</small></div>}
                      </div>
                    </div>
                  </div>

                  {/* Compétences */}
                  <div className="col-md-3">
                    <small className="text-muted d-block mb-1">Compétences</small>
                    <div className="d-flex gap-1 flex-wrap">
                      {(c.etudiant.competences || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="badge" style={{ background: "#f3f4f6", color: "#374151", fontSize: "11px" }}>{s}</span>
                      ))}
                      {(c.etudiant.competences || []).length > 3 && (
                        <span className="badge" style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: "11px" }}>+{c.etudiant.competences.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* Statut + date */}
                  <div className="col-md-2">
                    <small className="text-muted d-block mb-1">Statut</small>
                    <span className="badge" style={{ background: cfg.bg, color: cfg.color, padding: "5px 10px", fontSize: "12px", fontWeight: "600", borderRadius: "6px" }}>
                      {cfg.label}
                    </span>
                    <div className="mt-1"><small className="text-muted">{c.dateEnvoi}</small></div>
                  </div>

                  {/* Actions */}
                  <div className="col-md-3">
                    <small className="text-muted d-block mb-1">Changer le statut</small>
                    <div className="d-flex gap-2 flex-wrap">
                      {statutOptions.map(opt => (
                        <button
                          key={opt.value}
                          className={`btn btn-sm ${
                            opt.value === "acceptee" ? "btn-success" :
                            opt.value === "refusee"  ? "btn-outline-danger" :
                            "btn-outline-primary"
                          }`}
                          style={{ fontSize: "11px" }}
                          disabled={c.statut === opt.value || updating === c.id}
                          onClick={() => handleStatut(c.id, opt.value)}
                        >
                          {updating === c.id ? <span className="spinner-border spinner-border-sm" /> : opt.label}
                        </button>
                      ))}
                    </div>

                    {c.etudiant.cv && (
                      <a
                        href={`http://localhost:8000/storage/${c.etudiant.cv}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-secondary mt-2 w-100"
                        style={{ fontSize: "11px" }}
                      >
                        <i className="bi bi-file-earmark-pdf me-1"></i> Voir CV
                      </a>
                    )}
                  </div>
                </div>

                {/* Lettre de motivation */}
                {c.lettreMotivation && (
                  <div className="mt-3 p-3 rounded" style={{ background: "#f9fafb", borderLeft: "3px solid #1a56db" }}>
                    <small className="text-muted fw-semibold d-block mb-1">Lettre de motivation</small>
                    <p className="mb-0 small" style={{ lineHeight: "1.6" }}>{c.lettreMotivation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
