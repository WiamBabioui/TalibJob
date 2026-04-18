import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export default function Jobs() {
  const navigate = useNavigate();
  const [missions, setMissions]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [total, setTotal]             = useState(0);
  const [recherche, setRecherche]     = useState("");
  const [ville, setVille]             = useState("");
  const [type, setType]               = useState("");
  const [modal, setModal]             = useState(null);
  const [lettre, setLettre]           = useState("");
  const [postulating, setPostulating] = useState(false);
  const [alertMsg, setAlertMsg]       = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  const fetchMissions = (params = {}) => {
    setLoading(true);
    api.get("/missions", {
      params: { page: params.page ?? 1, q: params.q ?? "", ville: params.ville ?? "", type: params.type ?? "" }
    })
      .then(r => {
        setMissions(Array.isArray(r.data.data) ? r.data.data : []);
        setTotal(r.data.total ?? 0);
        setLastPage(r.data.last_page ?? 1);
        setPage(r.data.current_page ?? 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMissions(); }, []);

  const handleSearch = () => fetchMissions({ q: recherche, ville, type, page: 1 });
  const handleKeyDown = e => { if (e.key === "Enter") handleSearch(); };

  const openModal = (mission) => {
    if (!isLoggedIn) { navigate("/student/login"); return; }
    setModal(mission);
    setLettre("");
    setAlertMsg(null);
  };

  const handlePostuler = async () => {
    setPostulating(true);
    try {
      await api.post(`/etudiant/missions/${modal.id}/postuler`, { lettreMotivation: lettre });
      setAlertMsg({ type: "success", text: `Candidature envoyée pour "${modal.titre}" ✅` });
      setModal(null);
      setLettre("");
    } catch (err) {
      setAlertMsg({ type: "danger", text: err.response?.data?.error || "Erreur lors de l'envoi." });
      setModal(null);
    } finally {
      setPostulating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)", padding: "40px 0 32px" }}>
        <div className="container">
          <h2 className="text-white fw-bold text-center mb-1" style={{ fontSize: 26 }}>
            Trouvez votre job étudiant idéal
          </h2>
          <p className="text-center mb-4" style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
            Des opportunités flexibles adaptées à votre emploi du temps
          </p>

          <div className="card p-3 mx-auto" style={{ maxWidth: 860, borderRadius: 14, border: "none" }}>
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted" />
                  </span>
                  <input type="text" className="form-control border-start-0"
                    placeholder="Développeur, Marketing..."
                    value={recherche} onChange={e => setRecherche(e.target.value)} onKeyDown={handleKeyDown} />
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={ville} onChange={e => setVille(e.target.value)}>
                  <option value="">Toutes les villes</option>
                  {["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Télétravail"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="">Tous les types</option>
                  {["Stage","CDD","CDI","Freelance","Alternance","Temps partiel"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100 fw-semibold" onClick={handleSearch}
                  style={{ borderRadius: 8 }}>
                  <i className="bi bi-search me-1" />Chercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="container py-4">

        {alertMsg && (
          <div className={`alert alert-${alertMsg.type} alert-dismissible mb-4`}>
            {alertMsg.text}
            <button type="button" className="btn-close" onClick={() => setAlertMsg(null)} />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0" style={{ color: "#111827" }}>
            {loading ? "Chargement..." : (
              <><span style={{ color: "#1d4ed8" }}>{total}</span> offre{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}</>
            )}
          </h5>
          {(recherche || ville || type) && (
            <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8 }}
              onClick={() => { setRecherche(""); setVille(""); setType(""); fetchMissions({ page: 1 }); }}>
              <i className="bi bi-x me-1" />Effacer les filtres
            </button>
          )}
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : missions.length === 0 ? (
          <div className="card p-5 text-center" style={{ borderRadius: 14 }}>
            <i className="bi bi-briefcase text-muted" style={{ fontSize: 48 }} />
            <p className="text-muted mt-3 mb-0">Aucune offre disponible pour le moment.</p>
          </div>
        ) : (
          <div className="row g-4">
            {missions.map(m => {
              const tc = typeColors[m.type] || { bg: "#f3f4f6", color: "#374151" };
              const nomEnt = m.entreprise?.nom || "?";
              const [abg, atc] = avatarColor(nomEnt);
              return (
                <div key={m.id} className="col-md-6 col-xl-4">
                  <div
                    className="card h-100 d-flex flex-column"
                    style={{ borderRadius: 16, border: "1px solid #e8eaf0", overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ height: 4, background: "linear-gradient(90deg, #1d4ed8, #0ea5e9)" }} />
                    <div className="p-4 d-flex flex-column flex-fill">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        {m.entreprise?.logo ? (
                          <img src={m.entreprise.logo} alt={nomEnt}
                            style={{ width: 46, height: 46, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: "1px solid #e8eaf0" }} />
                        ) : (
                          <div style={{
                            width: 46, height: 46, borderRadius: 12,
                            background: abg, color: atc,
                            fontWeight: 700, fontSize: 19,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            {nomEnt[0].toUpperCase()}
                          </div>
                        )}
                        <div className="overflow-hidden flex-fill">
                          <div className="fw-semibold text-truncate" style={{ fontSize: 14, color: "#374151" }}>
                            {nomEnt}
                          </div>
                          <div className="d-flex align-items-center gap-1" style={{ fontSize: 12, color: "#9ca3af" }}>
                            <i className="bi bi-geo-alt" />
                            <span>{m.lieu || "—"}</span>
                          </div>
                        </div>
                        <span className="badge flex-shrink-0" style={{
                          background: tc.bg, color: tc.color,
                          fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
                        }}>
                          {m.type}
                        </span>
                      </div>

                      <h6 className="fw-bold mb-2" style={{ fontSize: 15, lineHeight: 1.4, color: "#111827" }}>
                        {m.titre}
                      </h6>

                      {m.remuneration && (
                        <div className="d-flex align-items-center gap-1 mb-2" style={{ fontSize: 13.5, color: "#059669", fontWeight: 600 }}>
                          <i className="bi bi-currency-dollar" />
                          {Number(m.remuneration).toLocaleString()} MAD / mois
                        </div>
                      )}

                      <div className="flex-fill" />

                      <div className="d-flex align-items-center justify-content-between mt-3 pt-3"
                        style={{ borderTop: "1px solid #f3f4f6" }}>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <i className="bi bi-clock" />{m.datePublication}
                        </small>
                        <div className="d-flex gap-2">
                          <Link to={`/jobs/${m.id}`}
                            className="btn btn-sm btn-outline-secondary"
                            style={{ borderRadius: 7, fontSize: 12 }}>
                            Détails
                          </Link>
                          <button
                            className="btn btn-sm btn-primary fw-semibold"
                            style={{ borderRadius: 7, fontSize: 12, padding: "5px 14px" }}
                            onClick={() => openModal(m)}
                          >
                            <i className="bi bi-send-fill me-1" />Postuler
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {lastPage > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-5">
            <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1}
              onClick={() => fetchMissions({ q: recherche, ville, type, page: page - 1 })}
              style={{ borderRadius: 8 }}>
              <i className="bi bi-chevron-left" /> Précédent
            </button>
            {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
              <button key={p}
                className={`btn btn-sm ${p === page ? "btn-primary" : "btn-outline-secondary"}`}
                style={{ borderRadius: 8, minWidth: 36 }}
                onClick={() => fetchMissions({ q: recherche, ville, type, page: p })}>
                {p}
              </button>
            ))}
            <button className="btn btn-outline-secondary btn-sm" disabled={page >= lastPage}
              onClick={() => fetchMissions({ q: recherche, ville, type, page: page + 1 })}
              style={{ borderRadius: 8 }}>
              Suivant <i className="bi bi-chevron-right" />
            </button>
          </div>
        )}
      </div>

      {modal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
        >
          <div className="card" style={{ width: "100%", maxWidth: 500, borderRadius: 16, border: "none", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)", padding: "20px 24px" }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold text-white mb-1">{modal.titre}</h5>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }} className="d-flex align-items-center gap-2">
                    <i className="bi bi-building" />{modal.entreprise?.nom}
                    {modal.lieu && <><span>·</span><i className="bi bi-geo-alt" />{modal.lieu}</>}
                  </div>
                </div>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8 }}
                  onClick={() => setModal(null)}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <label className="form-label fw-semibold mb-1">
                Lettre de motivation <small className="text-muted fw-normal">(optionnel)</small>
              </label>
              <textarea className="form-control" rows={5}
                placeholder="Présentez-vous et expliquez pourquoi cette offre vous intéresse..."
                value={lettre} onChange={e => setLettre(e.target.value)}
                style={{ borderRadius: 10, resize: "vertical", fontSize: 14 }} />
              <small className="text-muted d-block mt-1">
                <i className="bi bi-info-circle me-1" />Votre profil et CV seront automatiquement joints.
              </small>
            </div>
            <div className="d-flex gap-2 p-4 pt-0">
              <button className="btn btn-outline-secondary flex-fill" style={{ borderRadius: 8 }}
                onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary flex-fill fw-semibold" style={{ borderRadius: 8 }}
                onClick={handlePostuler} disabled={postulating}>
                {postulating
                  ? <><span className="spinner-border spinner-border-sm me-2" />Envoi...</>
                  : <><i className="bi bi-send-fill me-2" />Envoyer ma candidature</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}