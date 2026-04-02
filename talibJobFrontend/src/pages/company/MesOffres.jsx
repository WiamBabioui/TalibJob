import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const statusConfig = {
  active:    { label: "Active",    bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  brouillon: { label: "Brouillon", bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  fermee:    { label: "Fermée",    bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
  pourvue:   { label: "Pourvue",   bg: "#f5f3ff", color: "#7c3aed", dot: "#8b5cf6" },
};

const typeConfig = {
  Stage:           "#3b82f6",
  CDD:             "#10b981",
  CDI:             "#8b5cf6",
  Freelance:       "#f97316",
  Alternance:      "#ec4899",
  "Temps partiel": "#14b8a6",
};

const FILTERS = ["tous", "active", "brouillon", "fermee", "pourvue"];

export default function MesOffres() {
  const [offres, setOffres]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filtre, setFiltre]       = useState("tous");
  const [recherche, setRecherche] = useState("");
  const navigate = useNavigate();
  const entreprise = JSON.parse(localStorage.getItem("entreprise") || "{}");

  useEffect(() => {
    api.get("/entreprise/missions")
      .then(r => setOffres(Array.isArray(r.data) ? r.data : []))
      .catch(e => { if (e.response?.status === 401) navigate("/company/login"); })
      .finally(() => setLoading(false));
  }, []);

  const filtrees = offres.filter(o => {
    const matchFiltre    = filtre === "tous" || o.statut === filtre;
    const matchRecherche = o.titre.toLowerCase().includes(recherche.toLowerCase()) ||
                           (o.lieu || "").toLowerCase().includes(recherche.toLowerCase());
    return matchFiltre && matchRecherche;
  });

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"60vh" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width:32, height:32, border:"2.5px solid #e5e7eb", borderTop:"2.5px solid #6366f1", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );

  const initial = (entreprise.nom || "E")[0].toUpperCase();

  return (
    <div style={{ fontFamily:"'Inter', system-ui, sans-serif", padding:"4px 0 48px", color:"#111827" }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, flexWrap:"wrap", gap:16 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0, letterSpacing:"-0.02em" }}>
            Mes Offres
          </h2>
          <p style={{ fontSize:13, color:"#9ca3af", margin:"4px 0 0" }}>
            {offres.length} offre{offres.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link to="/company/offres/nouvelle" className="mo-cta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle offre
        </Link>
      </div>

      {/* Filter bar */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center", marginBottom:28 }}>
        {/* Search */}
        <div style={{ position:"relative", flex:"1 1 200px", maxWidth:280 }}>
          <svg style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#d1d5db", pointerEvents:"none" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher…"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            className="mo-search"
          />
        </div>

        {/* Pills */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {FILTERS.map(s => {
            const count  = s === "tous" ? offres.length : offres.filter(o => o.statut === s).length;
            const active = filtre === s;
            return (
              <button key={s} onClick={() => setFiltre(s)}
                className={active ? "mo-pill mo-pill--active" : "mo-pill"}>
                {s === "tous" ? "Toutes" : statusConfig[s]?.label}
                <span className={active ? "mo-badge mo-badge--active" : "mo-badge"}>{count}</span>
              </button>
            );
          })}
        </div>

        <span style={{ fontSize:12, color:"#9ca3af", marginLeft:"auto" }}>
          {filtrees.length} résultat{filtrees.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty */}
      {filtrees.length === 0 ? (
        <div style={{ textAlign:"center", padding:"56px 32px", borderRadius:16, border:"1.5px dashed #e5e7eb", background:"#fafafa" }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", color:"#9ca3af" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <p style={{ fontWeight:600, color:"#374151", marginBottom:6 }}>
            {offres.length === 0 ? "Aucune offre publiée" : "Aucun résultat"}
          </p>
          <p style={{ fontSize:13, color:"#9ca3af", marginBottom:20 }}>
            {offres.length === 0 ? "Publiez votre première offre pour attirer des candidats." : "Essayez un autre filtre."}
          </p>
          {offres.length === 0 && (
            <Link to="/company/offres/nouvelle" className="mo-cta">Publier une offre</Link>
          )}
        </div>
      ) : (
        /* Grid */
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))", gap:18 }}>
          {filtrees.map((o, i) => {
            const sc = statusConfig[o.statut] || statusConfig.brouillon;
            const tc = typeConfig[o.type]     || "#6b7280";

            return (
              <div key={o.id} className="mo-card" style={{ animationDelay:`${i*50}ms` }}>
                {/* Top */}
                <div style={{ padding:"18px 20px 14px" }}>
                  {/* Badges */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:20, background:sc.bg, color:sc.color, fontSize:11.5, fontWeight:600 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, flexShrink:0 }} />
                      {sc.label}
                    </span>
                    {o.type && (
                      <span style={{ fontSize:11, fontWeight:600, color:tc, background:`${tc}14`, padding:"3px 9px", borderRadius:20 }}>
                        {o.type}
                      </span>
                    )}
                  </div>

                  {/* Identity */}
                  <div style={{ display:"flex", gap:11, alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:"#4c72f1", color:"#fff", fontWeight:700, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {initial}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"#111827", lineHeight:1.4 }}>{o.titre}</div>
                      <div style={{ fontSize:12, color:"#9ca3af" }}>{entreprise.nom}</div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    {o.lieu && (
                      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12.5, color:"#6b7280" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {o.lieu}
                      </div>
                    )}
                    {o.remuneration && (
                      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12.5, color:"#059669", fontWeight:600 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        {Number(o.remuneration).toLocaleString()} MAD / mois
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display:"flex", borderTop:"1px solid #f3f4f6", borderBottom:"1px solid #f3f4f6" }}>
                  {[{ val: o.nombreCandidatures, lbl: "Candidatures" }, { val: o.vues, lbl: "Vues" }].map((s, idx) => (
                    <div key={idx} style={{ flex:1, padding:"12px 0", textAlign:"center", borderLeft: idx ? "1px solid #f3f4f6" : "none" }}>
                      <div style={{ fontSize:20, fontWeight:700, color:"#111827", lineHeight:1 }}>{s.val}</div>
                      <div style={{ fontSize:11, color:"#9ca3af", marginTop:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div style={{ padding:"12px 16px" }}>
                  <Link to={`/company/offres/${o.id}/candidatures`} className="mo-action">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Voir les candidats
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .mo-cta {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 9px;
    background: #3a46eb;
    color: #fff;
    font-weight: 600;
    font-size: 13px;
    text-decoration: none;
    transition: background 0.18s, box-shadow 0.18s;
    font-family: inherit;
  }
  .mo-cta:hover { background: #301ef8; box-shadow: 0 4px 14px rgba(99,102,241,0.35); }

  .mo-search {
    width: 100%;
    padding: 8px 12px 8px 34px;
    border-radius: 9px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    font-size: 13px;
    color: #374151;
    outline: none;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 0.18s;
  }
  .mo-search:focus { border-color: #301ef8; }
  .mo-search::placeholder { color: #d1d5db; }

  .mo-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    color: #6b7280;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }
  .mo-pill:hover { border-color: #c7d2fe; color: #301ef8; }
  .mo-pill--active { border-color: #301ef8; background: #eef2ff; color: #4f46e5; font-weight: 600; }

  .mo-badge {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 10px;
    background: #f3f4f6;
    color: #9ca3af;
  }
  .mo-badge--active { background: #c7d2fe; color: #301ef8; }

  .mo-card {
    border-radius: 14px;
    background: #fff;
    border: 1.5px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeUp 0.35s ease both;
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  }
  .mo-card:hover {
    box-shadow: 0 8px 28px rgba(0,0,0,0.08);
    transform: translateY(-3px);
    border-color: #e0e7ff;
  }

  .mo-action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: 100%;
    padding: 9px;
    border-radius: 9px;
    background: #f5f5f5;
    color: #374151;
    font-weight: 600;
    font-size: 13px;
    text-decoration: none;
    transition: background 0.18s, color 0.18s;
    box-sizing: border-box;
    font-family: inherit;
  }
  .mo-action:hover { background: #eef2ff; color: #070be6; }
`;
