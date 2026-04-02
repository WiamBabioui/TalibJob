import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function PublierOffre() {
  const navigate = useNavigate();
  const entreprise = JSON.parse(localStorage.getItem("entreprise") || "{}");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [form, setForm] = useState({
    titre:               "",
    description:         "",
    competencesRequises: "",
    remuneration:        "",
    type:                "",
    lieu:                "",
    dateExpiration:      "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validation frontend
  const validate = () => {
    const e = {};
    if (!form.titre.trim())       e.titre       = "Le titre est obligatoire.";
    if (!form.description.trim()) e.description = "La description est obligatoire.";
    if (!form.type)               e.type        = "Le type de contrat est obligatoire.";
    if (!form.lieu.trim())        e.lieu        = "Le lieu est obligatoire.";
    if (form.remuneration && Number(form.remuneration) < 0)
                                  e.remuneration = "Le salaire ne peut pas être négatif.";
    return e;
  };

  const handleSubmit = async () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    try {
      await api.post("/entreprise/missions", {
        titre:               form.titre,
        description:         form.description,
        competencesRequises: form.competencesRequises,
        remuneration:        form.remuneration ? Math.abs(Number(form.remuneration)) : null,
        type:                form.type,
        lieu:                form.lieu,
        statut:              "active",
      });
      alert("Offre publiée avec succès ! ✅");
      navigate("/company/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la publication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Publier une nouvelle offre</h3>

      <div className="row g-4">

        {/* Formulaire */}
        <div className="col-lg-7">
          <div className="card p-4" style={{ border: "1px solid #e8eaf0", borderRadius: "12px" }}>

            {/* Titre */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Titre de l'offre <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="titre"
                className={`form-control ${errors.titre ? "is-invalid" : ""}`}
                placeholder="Développeur Front-end, Assistant Marketing..."
                value={form.titre}
                onChange={handleChange}
                style={{ borderRadius: "8px" }}
              />
              {errors.titre && <div className="invalid-feedback">{errors.titre}</div>}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Description détaillée <span className="text-danger">*</span>
              </label>
              <textarea
                name="description"
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows={6}
                placeholder="Décrivez les missions, responsabilités, environnement de travail..."
                value={form.description}
                onChange={handleChange}
                style={{ borderRadius: "8px", resize: "vertical" }}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            {/* Compétences */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Compétences requises <small className="text-muted fw-normal">(séparer par des virgules)</small>
              </label>
              <input
                type="text"
                name="competencesRequises"
                className="form-control"
                placeholder="React, JavaScript, Figma..."
                value={form.competencesRequises}
                onChange={handleChange}
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="row g-3 mb-3">
              {/* Rémunération */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Rémunération (MAD/mois)</label>
                <input
                  type="number"
                  name="remuneration"
                  className={`form-control ${errors.remuneration ? "is-invalid" : ""}`}
                  placeholder="5000"
                  min="0"
                  value={form.remuneration}
                  onChange={handleChange}
                  style={{ borderRadius: "8px" }}
                />
                {errors.remuneration && <div className="invalid-feedback">{errors.remuneration}</div>}
              </div>

              {/* Type */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Type de contrat <span className="text-danger">*</span>
                </label>
                <select
                  name="type"
                  className={`form-select ${errors.type ? "is-invalid" : ""}`}
                  value={form.type}
                  onChange={handleChange}
                  style={{ borderRadius: "8px" }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="Stage">Stage</option>
                  <option value="CDD">CDD</option>
                  <option value="CDI">CDI</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Alternance">Alternance</option>
                  <option value="Temps partiel">Temps partiel</option>
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
              </div>
            </div>

            <div className="row g-3 mb-4">
              {/* Lieu */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Lieu du poste <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="lieu"
                  className={`form-control ${errors.lieu ? "is-invalid" : ""}`}
                  placeholder="Casablanca, Télétravail..."
                  value={form.lieu}
                  onChange={handleChange}
                  style={{ borderRadius: "8px" }}
                />
                {errors.lieu && <div className="invalid-feedback">{errors.lieu}</div>}
              </div>

              {/* Date expiration */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Date limite de candidature</label>
                <input
                  type="date"
                  name="dateExpiration"
                  className="form-control"
                  value={form.dateExpiration}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>

            <button
              className="btn btn-primary px-4"
              onClick={handleSubmit}
              disabled={loading}
              style={{ borderRadius: "8px", fontWeight: "600" }}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Publication...</>
              ) : (
                <><i className="bi bi-send-fill me-2"></i>Publier l'offre</>
              )}
            </button>
          </div>
        </div>

        {/* Aperçu */}
        <div className="col-lg-5">
          <div className="card p-4 position-sticky" style={{ top: "20px", border: "1px solid #e8eaf0", borderRadius: "12px" }}>
            <h6 className="fw-bold mb-3 text-muted text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              Aperçu de l'offre
            </h6>
            <div style={{ borderRadius: "10px", border: "1px solid #e8eaf0", padding: "16px" }}>
              <h5 className="fw-bold mb-1" style={{ color: form.titre ? "#111827" : "#d1d5db" }}>
                {form.titre || "Titre de l'offre"}
              </h5>
              <div className="d-flex align-items-center gap-1 text-muted small mb-2">
                <i className="bi bi-building"></i>
                <span>{entreprise.nom || "Entreprise"}</span>
                {form.lieu && <><span>•</span><i className="bi bi-geo-alt"></i><span>{form.lieu}</span></>}
              </div>
              {(form.remuneration || form.type) && (
                <div className="d-flex gap-2 mb-3 flex-wrap">
                  {form.remuneration && Number(form.remuneration) >= 0 && (
                    <span className="badge" style={{ background: "#f0fdf4", color: "#059669", fontSize: "12px" }}>
                      $ {Number(form.remuneration).toLocaleString()} MAD / mois
                    </span>
                  )}
                  {form.type && (
                    <span className="badge" style={{ background: "#eff6ff", color: "#1a56db", fontSize: "12px" }}>
                      {form.type}
                    </span>
                  )}
                </div>
              )}
              <div className="mb-3">
                <strong className="small d-block mb-1">Description</strong>
                <p className="small text-muted mb-0" style={{ lineHeight: "1.6" }}>
                  {form.description || "Description de l'offre..."}
                </p>
              </div>
              {form.competencesRequises && (
                <div className="mb-3">
                  <strong className="small d-block mb-2">Compétences requises</strong>
                  <div className="d-flex gap-1 flex-wrap">
                    {form.competencesRequises.split(",").map((c, i) => (
                      <span key={i} className="badge" style={{ background: "#f3f4f6", color: "#374151", fontSize: "11px" }}>
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <hr />
              <div className="d-flex gap-2">
                <Link className="btn btn-sm btn-outline-secondary flex-fill"style={{ fontSize: "12px" }} to="/company/MesOffres">Voir l'offre complète</Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
