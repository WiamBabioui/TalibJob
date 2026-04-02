import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function avatarColor(name = "") {
  const colors = [
    ["#dbeafe", "#1d4ed8"], ["#dcfce7", "#15803d"], ["#f3e8ff", "#7c3aed"],
    ["#ffedd5", "#c2410c"], ["#fce7f3", "#be185d"], ["#e0f2fe", "#0369a1"],
  ];
  const i = (name.charCodeAt(0) || 0) % colors.length;
  return colors[i];
}

const statutConfig = {
  en_attente: { label: "En attente", bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  vue:        { label: "Vue",        bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  acceptee:   { label: "Acceptée",   bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  refusee:    { label: "Rejetée",    bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
};

const STATUTS = Object.keys(statutConfig);

export default function CandidaturesEntreprise() {
  const { id } = useParams();           // id de l'offre
  const navigate = useNavigate();

  const [offre, setOffre]               = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filtre, setFiltre]             = useState("tous");
  const [recherche, setRecherche]       = useState("");
  const [updatingId, setUpdatingId]     = useState(null);
  const [selected, setSelected]         = useState(null); // candidature détail
  const [message, setMessage]           = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`/entreprise/missions/${id}`),
      api.get(`/entreprise/missions/${id}/candidatures`),
    ])
      .then(([offreRes, candRes]) => {
        setOffre(offreRes.data);
        setCandidatures(candRes.data);
      })
      .catch(e => {
        if (e.response?.status === 401) navigate("/company/login");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Changer le statut d'une candidature
  const handleStatut = async (candidatureId, newStatut) => {
    setUpdatingId(candidatureId);
    setMessage(null);
    try {
      await api.put(`/entreprise/candidatures/${candidatureId}/statut`, { statut: newStatut });
      setCandidatures(prev =>
        prev.map(c => c.id === candidatureId ? { ...c, statut: newStatut } : c)
      );
      if (selected?.id === candidatureId) setSelected(prev => ({ ...prev, statut: newStatut }));
      setMessage({ type: "success", text: "Statut mis à jour ✅" });
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.error || "Erreur lors de la mise à jour." });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtrees = candidatures.filter(c => {
    const matchFiltre    = filtre === "tous" || c.statut === filtre;
    const matchRecherche = (c.etudiant?.nom || "").toLowerCase().includes(recherche.toLowerCase()) ||
                           (c.etudiant?.prenom || "").toLowerCase().includes(recherche.toLowerCase()) ||
                           (c.etudiant?.email || "").toLowerCase().includes(recherche.toLowerCase());
    return matchFiltre && matchRecherche;
  });

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  const counts = STATUTS.reduce((acc, k) => {
    acc[k] = candidatures.filter(c => c.statut === k).length;
    return acc;
  }, {});

  return (
    <div>

      {/* ── Breadcrumb ── */}
      <div className="d-flex align-items-center gap-2 mb-4 text-muted small">
        <Link to="/company/MesOffres" style={{ color: "#6b7280", textDecoration: "none" }}>
          <i className="bi bi-briefcase me-1" />Mes Offres
        </Link>
        <i className="bi bi-chevron-right" style={{ fontSize: 11 }} />
        <span style={{ color: "#111827", fontWeight: 600 }}>
          {offre?.titre || "Candidatures"}
        </span>
      </div>

      {/* ── Header offre ── */}
      {offre && (
        <div className="card p-4 mb-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
          <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
                color: "#fff", fontWeight: 800, fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {(offre.titre || "O")[0].toUpperCase()}
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ fontSize: 17 }}>{offre.titre}</h5>
                <div className="d-flex flex-wrap gap-3 mt-1" style={{ fontSize: 13, color: "#6b7280" }}>
                  {offre.lieu && <span><i className="bi bi-geo-alt me-1" />{offre.lieu}</span>}
                  {offre.type && (
                    <span className="badge" style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6 }}>
                      {offre.type}
                    </span>
                  )}
                  {offre.remuneration && (
                    <span style={{ color: "#059669", fontWeight: 600 }}>
                      <i className="bi bi-currency-dollar me-1" />
                      {Number(offre.remuneration).toLocaleString()} MAD / mois
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-end">
              <div className="fw-bold" style={{ fontSize: 26, color: "#6366f1", lineHeight: 1 }}>
                {candidatures.length}
              </div>
              <small className="text-muted">candidature{candidatures.length !== 1 ? "s" : ""}</small>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`alert alert-${message.type} alert-dismissible mb-4`} style={{ borderRadius: 10 }}>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage(null)} />
        </div>
      )}

      {/* ── Stats rapides ── */}
      <div className="row g-3 mb-4">
        {STATUTS.map(k => {
          const cfg = statutConfig[k];
          return (
            <div key={k} className="col-6 col-md-3">
              <div className="card p-3 text-center h-100"
                style={{
                  borderRadius: 12, background: filtre === k ? cfg.bg : "#fff",
                  border: `1.5px solid ${filtre === k ? cfg.dot : "#e8eaf0"}`,
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onClick={() => setFiltre(filtre === k ? "tous" : k)}>
                <div className="fw-bold" style={{ fontSize: 24, color: cfg.color, lineHeight: 1 }}>
                  {counts[k] || 0}
                </div>
                <small style={{ color: cfg.color, fontSize: 11, fontWeight: 600 }}>{cfg.label}</small>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-4">

        {/* ── Liste candidatures ── */}
        <div className={selected ? "col-lg-6" : "col-12"}>

          {/* Filtres */}
          <div className="card p-3 mb-3" style={{ borderRadius: 12, border: "1px solid #e8eaf0" }}>
            <div className="row g-2 align-items-center">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted" />
                  </span>
                  <input type="text" className="form-control border-start-0"
                    placeholder="Rechercher un candidat..."
                    value={recherche} onChange={e => setRecherche(e.target.value)} />
                </div>
              </div>
              <div className="col-md-4">
                <select className="form-select" value={filtre} onChange={e => setFiltre(e.target.value)}>
                  <option value="tous">Tous ({candidatures.length})</option>
                  {STATUTS.map(k => (
                    <option key={k} value={k}>{statutConfig[k].label} ({counts[k] || 0})</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 text-muted small text-end">
                {filtrees.length} résultat{filtrees.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Liste */}
          {filtrees.length === 0 ? (
            <div className="card p-5 text-center" style={{ borderRadius: 14, border: "1.5px dashed #e5e7eb" }}>
              <i className="bi bi-people text-muted" style={{ fontSize: 48 }} />
              <p className="text-muted mt-3 mb-0">
                {candidatures.length === 0
                  ? "Aucune candidature reçue pour cette offre."
                  : "Aucun candidat ne correspond à votre recherche."}
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {filtrees.map(c => {
                const fullName = `${c.etudiant?.prenom || ""} ${c.etudiant?.nom || ""}`.trim() || "Candidat";
                const initial  = fullName[0]?.toUpperCase() || "C";
                const [abg, atc] = avatarColor(fullName);
                const cfg = statutConfig[c.statut] || statutConfig.en_attente;
                const isSelected = selected?.id === c.id;

                return (
                  <div key={c.id}
                    className="card p-3"
                    style={{
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected ? "#6366f1" : "#e8eaf0"}`,
                      background: isSelected ? "#f5f3ff" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onClick={() => setSelected(isSelected ? null : c)}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "#c7d2fe"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "#e8eaf0"; }}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-3">

                      {/* Avatar + nom */}
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          width: 42, height: 42, borderRadius: "50%",
                          background: abg, color: atc,
                          fontWeight: 700, fontSize: 17,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {initial}
                        </div>
                        <div>
                          <div className="fw-bold" style={{ fontSize: 14, color: "#111827" }}>{fullName}</div>
                          <div style={{ fontSize: 12, color: "#9ca3af" }}>{c.etudiant?.email}</div>
                        </div>
                      </div>

                      {/* Statut + date */}
                      <div className="d-flex flex-column align-items-end gap-1 flex-shrink-0">
                        <span className="badge d-flex align-items-center gap-1" style={{
                          background: cfg.bg, color: cfg.color,
                          padding: "4px 9px", borderRadius: 7, fontSize: 11, fontWeight: 600,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />
                          {cfg.label}
                        </span>
                        <small style={{ fontSize: 11, color: "#9ca3af" }}>{c.date}</small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Panneau détail candidat ── */}
        {selected && (() => {
          const fullName = `${selected.etudiant?.prenom || ""} ${selected.etudiant?.nom || ""}`.trim() || "Candidat";
          const initial  = fullName[0]?.toUpperCase() || "C";
          const [abg, atc] = avatarColor(fullName);
          const cfg = statutConfig[selected.statut] || statutConfig.en_attente;

          return (
            <div className="col-lg-6">
              <div className="card" style={{ borderRadius: 14, border: "1px solid #e8eaf0", position: "sticky", top: 20, overflow: "hidden" }}>

                {/* Header */}
                <div style={{ background: "linear-gradient(135deg, #6366f1, #0ea5e9)", padding: "20px 24px" }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: 52, height: 52, borderRadius: "50%",
                        background: "rgba(255,255,255,0.25)", color: "#fff",
                        fontWeight: 800, fontSize: 22,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {initial}
                      </div>
                      <div>
                        <div className="fw-bold text-white" style={{ fontSize: 16 }}>{fullName}</div>
                        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{selected.etudiant?.email}</div>
                      </div>
                    </div>
                    <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8 }}
                      onClick={() => setSelected(null)}>
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>
                </div>

                <div className="p-4">

                  {/* Infos étudiant */}
                  <h6 className="fw-bold mb-3" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9ca3af" }}>
                    Informations
                  </h6>
                  <div className="d-flex flex-column gap-2 mb-4">
                    {[
                      { icon: "bi-envelope",   value: selected.etudiant?.email     },
                      { icon: "bi-telephone",  value: selected.etudiant?.telephone },
                      { icon: "bi-mortarboard",value: selected.etudiant?.filiere   },
                      { icon: "bi-calendar3",  value: `Postulé le ${selected.date}`},
                    ].filter(f => f.value).map((f, i) => (
                      <div key={i} className="d-flex align-items-center gap-2" style={{ fontSize: 13.5, color: "#374151" }}>
                        <i className={`bi ${f.icon}`} style={{ color: "#6b7280", width: 16 }} />
                        {f.value}
                      </div>
                    ))}
                  </div>

                  {/* Compétences */}
                  {(selected.etudiant?.competences || []).length > 0 && (
                    <>
                      <h6 className="fw-bold mb-2" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9ca3af" }}>
                        Compétences
                      </h6>
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {selected.etudiant.competences.map((comp, i) => (
                          <span key={i} className="badge" style={{
                            background: "#eff6ff", color: "#1d4ed8",
                            fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
                          }}>
                            {comp}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Lettre de motivation */}
                  {selected.lettreMotivation && (
                    <>
                      <h6 className="fw-bold mb-2" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9ca3af" }}>
                        Lettre de motivation
                      </h6>
                      <div className="p-3 rounded mb-4" style={{ background: "#f8fafc", border: "1px solid #e8eaf0", fontSize: 13.5, color: "#374151", lineHeight: 1.7 }}>
                        {selected.lettreMotivation}
                      </div>
                    </>
                  )}

                  {/* CV */}
                  {selected.etudiant?.cv && (
                    <a
                      href={`http://localhost:8000/storage/${selected.etudiant.cv}`}
                      className="btn btn-outline-primary btn-sm w-100 mb-4"
                      style={{ borderRadius: 8 }}
                      target="_blank" rel="noreferrer"
                    >
                      <i className="bi bi-download me-2" />Télécharger le CV
                    </a>
                  )}

                  {/* ── Changer le statut ── */}
                  <h6 className="fw-bold mb-2" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9ca3af" }}>
                    Changer le statut
                  </h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {STATUTS.filter(k => k !== selected.statut).map(k => {
                      const s = statutConfig[k];
                      return (
                        <button key={k}
                          className="btn btn-sm fw-semibold"
                          style={{
                            borderRadius: 8, background: s.bg, color: s.color,
                            border: `1.5px solid ${s.dot}`, fontSize: 12,
                          }}
                          disabled={updatingId === selected.id}
                          onClick={() => handleStatut(selected.id, k)}
                        >
                          {updatingId === selected.id
                            ? <span className="spinner-border spinner-border-sm" />
                            : <><span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block", marginRight: 5 }} />{s.label}</>
                          }
                        </button>
                      );
                    })}
                  </div>

                  {/* Statut actuel */}
                  <div className="mt-3 d-flex align-items-center gap-2" style={{ fontSize: 13, color: "#6b7280" }}>
                    Statut actuel :
                    <span className="badge" style={{ background: cfg.bg, color: cfg.color, padding: "4px 10px", borderRadius: 7, fontSize: 12, fontWeight: 600 }}>
                      {cfg.label}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}