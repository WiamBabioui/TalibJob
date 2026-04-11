import React, { useEffect, useState } from "react";
import api from "../services/api";

// ✅ Utilise une variable d'environnement React
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function avatarColor(name = "") {
  const colors = [
    ["#dbeafe", "#1d4ed8"],
    ["#dcfce7", "#15803d"],
    ["#f3e8ff", "#7c3aed"],
    ["#ffedd5", "#c2410c"],
    ["#fce7f3", "#be185d"],
    ["#e0f2fe", "#0369a1"],
  ];
  const i = (name.charCodeAt(0) || 0) % colors.length;
  return colors[i];
}
const toAbsoluteUrl = (url) => (url ? url : null);
export default function MonProfil() {
  const [profil, setProfil] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api
      .get("/etudiant/profil")
      .then((r) => {
        setProfil(r.data);
        setForm({
          nom: r.data.nom || "",
          prenom: r.data.prenom || "",
          poste: r.data.poste || "",
          telephone: r.data.telephone || "",
          competences: (r.data.competences || []).join(", "),
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.put("/etudiant/profil", form);
      const r = await api.get("/etudiant/profil");
      setProfil(r.data);
      setForm({
        nom: r.data.nom || "",
        prenom: r.data.prenom || "",
        poste: r.data.poste || "",
        telephone: r.data.telephone || "",
        competences: (r.data.competences || []).join(", "),
      });
      setEditMode(false);
      setMessage({ type: "success", text: "Profil mis à jour avec succès ✅" });
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Erreur lors de la sauvegarde.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const r = await api.post("/etudiant/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ utiliser directement URL backend
      const photoUrl = r.data.photo;

      setProfil((prev) => ({ ...prev, photoProfil: photoUrl }));

      const etudiantActuel = JSON.parse(
        localStorage.getItem("etudiant") || "{}",
      );
      localStorage.setItem(
        "etudiant",
        JSON.stringify({
          ...etudiantActuel,
          photoProfil: photoUrl,
        }),
      );

      window.dispatchEvent(new Event("etudiant-updated"));

      setMessage({ type: "success", text: "Photo mise à jour ✅" });
    } catch {
      setMessage({
        type: "danger",
        text: "Erreur lors de l'upload de la photo.",
      });
    }
  };

  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const r = await api.post("/etudiant/upload-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ URL directe
      setProfil((prev) => ({ ...prev, cv: r.data.cv }));

      setMessage({ type: "success", text: "CV uploadé avec succès ✅" });
    } catch {
      setMessage({ type: "danger", text: "Erreur lors de l'upload du CV." });
    }
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  const fullName =
    `${profil?.prenom || ""} ${profil?.nom || ""}`.trim() || "Étudiant";
  const initial = fullName[0]?.toUpperCase() || "E";
  const [bgColor, textColor] = avatarColor(fullName);
  const photoUrl = toAbsoluteUrl(profil?.photoProfil);
  const cvUrl = profil?.cv ? `${BASE_URL}/storage/${profil.cv}` : null;

  return (
    <div>
      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: 22 }}>
            Mon Profil
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            Gérez vos informations personnelles
          </p>
        </div>

        {!editMode ? (
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            style={{ borderRadius: 8 }}
            onClick={() => setEditMode(true)}
          >
            <i className="bi bi-pencil" /> Modifier le profil
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              style={{ borderRadius: 8 }}
              onClick={() => {
                setEditMode(false);
                setMessage(null);
              }}
            >
              Annuler
            </button>
            <button
              className="btn btn-success btn-sm d-flex align-items-center gap-2"
              style={{ borderRadius: 8 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm" />{" "}
                  Sauvegarde...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg" /> Enregistrer
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Message ── */}
      {message && (
        <div className={`alert alert-${message.type} alert-dismissible`}>
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
          />
        </div>
      )}

      <div className="row g-4">
        {/* ── GAUCHE : avatar + CV ── */}
        <div className="col-md-3">
          <div
            className="card p-4 text-center"
            style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}
          >
            {/* Photo ou initiale */}
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Photo de profil"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "0 auto 12px",
                  display: "block",
                  border: "3px solid #e8eaf0",
                }}
              />
            ) : (
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: bgColor,
                  color: textColor,
                  fontWeight: 800,
                  fontSize: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                {initial}
              </div>
            )}

            <div className="fw-bold" style={{ fontSize: 15 }}>
              {fullName}
            </div>
            <div
              className="text-muted"
              style={{ fontSize: 12, marginBottom: 16 }}
            >
              {profil?.email}
            </div>

            {/* Progression */}
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Profil complété</small>
                <small className="fw-bold" style={{ color: "#3b82f6" }}>
                  {profil?.progression || 0}%
                </small>
              </div>
              <div className="progress" style={{ height: 6, borderRadius: 6 }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${profil?.progression || 0}%`,
                    background: "#3b82f6",
                  }}
                />
              </div>
            </div>

            {/* Upload photo */}
            <label
              className="btn btn-outline-secondary btn-sm w-100 mb-2"
              style={{ borderRadius: 8, cursor: "pointer" }}
            >
              <i className="bi bi-camera me-1" /> Changer la photo
              <input
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handlePhotoChange}
              />
            </label>

            {/* CV */}
            <div className="d-flex flex-column gap-2 mt-2">
              {cvUrl && (
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => window.open(cvUrl, "_blank")}
                >
                  Télécharger CV
                </button>
              )}
              <label
                className="btn btn-outline-secondary btn-sm"
                style={{ borderRadius: 8, cursor: "pointer" }}
              >
                <i className="bi bi-upload me-1" />
                {profil?.cv ? "Remplacer le CV" : "Uploader un CV"}
                <input
                  type="file"
                  accept=".pdf"
                  className="d-none"
                  onChange={handleCvChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* ── DROITE : infos ── */}
        <div className="col-md-9">
          <div
            className="card p-4"
            style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}
          >
            {!editMode ? (
              /* Affichage */
              <>
                <h5 className="fw-bold mb-4">Informations personnelles</h5>
                <div className="row g-3">
                  {[
                    { label: "Prénom", value: profil?.prenom },
                    { label: "Nom", value: profil?.nom },
                    { label: "Poste", value: profil?.poste },
                    { label: "Email", value: profil?.email },
                    { label: "Téléphone", value: profil?.telephone },
                  ].map((f) => (
                    <div key={f.label} className="col-sm-6">
                      <small className="text-muted d-block mb-1">
                        {f.label}
                      </small>
                      <span className="fw-semibold" style={{ fontSize: 14 }}>
                        {f.value || "—"}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                <h5 className="fw-bold mb-3">Compétences</h5>
                <div className="d-flex flex-wrap gap-2">
                  {(profil?.competences || []).length > 0 ? (
                    profil.competences.map((c, i) => (
                      <span
                        key={i}
                        className="badge"
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "5px 12px",
                          borderRadius: 8,
                        }}
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted small">
                      Aucune compétence renseignée
                    </span>
                  )}
                </div>
              </>
            ) : (
              /* Édition */
              <>
                <h5 className="fw-bold mb-4">Modifier mes informations</h5>
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold small">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: 8 }}
                      value={form.prenom}
                      onChange={(e) =>
                        setForm({ ...form, prenom: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold small">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: 8 }}
                      value={form.nom}
                      onChange={(e) =>
                        setForm({ ...form, nom: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Poste</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: 8 }}
                    placeholder="Ex: Développeur Web, Designer..."
                    value={form.poste}
                    onChange={(e) =>
                      setForm({ ...form, poste: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: 8 }}
                    value={form.telephone}
                    onChange={(e) =>
                      setForm({ ...form, telephone: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Compétences{" "}
                    <small className="text-muted fw-normal">
                      (séparer par des virgules)
                    </small>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: 8 }}
                    placeholder="React, PHP, Laravel..."
                    value={form.competences}
                    onChange={(e) =>
                      setForm({ ...form, competences: e.target.value })
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
