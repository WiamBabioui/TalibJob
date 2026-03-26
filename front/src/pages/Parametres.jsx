import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function avatarColor(name = "") {
  const colors = [
    ["#dbeafe", "#1d4ed8"], ["#dcfce7", "#15803d"], ["#f3e8ff", "#7c3aed"],
    ["#ffedd5", "#c2410c"], ["#fce7f3", "#be185d"], ["#e0f2fe", "#0369a1"],
  ];
  const i = (name.charCodeAt(0) || 0) % colors.length;
  return colors[i];
}

export default function Parametres() {
  const navigate = useNavigate();
  const [form, setForm]               = useState({ nom: "", prenom: "", email: "", telephone: "", newPassword: "" });
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage]         = useState(null);

  useEffect(() => {
    api.get("/api/etudiant/profil")
      .then(r => setForm({
        nom:         r.data.nom       || "",
        prenom:      r.data.prenom    || "",
        email:       r.data.email     || "",
        telephone:   r.data.telephone || "",
        newPassword: "",
      }))
      .catch(e => { if (e.response?.status === 401) navigate("/student/login"); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        nom:       form.nom,
        prenom:    form.prenom,       // ✅ envoyer prenom séparément
        email:     form.email,
        telephone: form.telephone,
      };
      if (form.newPassword) payload.newPassword = form.newPassword;

      await api.put("/api/etudiant/parametres", payload);

      // ✅ Mettre à jour localStorage avec nom ET prenom séparément
      const etudiantActuel = JSON.parse(localStorage.getItem("etudiant") || "{}");
      const etudiantMaj = {
        ...etudiantActuel,
        nom:       form.nom,
        prenom:    form.prenom,
        email:     form.email,
        telephone: form.telephone,
      };
      localStorage.setItem("etudiant", JSON.stringify(etudiantMaj));

      // ✅ Notifier MainLayout de se mettre à jour
      window.dispatchEvent(new Event("etudiant-updated"));

      setMessage({ type: "success", text: "Paramètres enregistrés avec succès ✅" });
      setForm(f => ({ ...f, newPassword: "" }));
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.error || "Erreur lors de la sauvegarde." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete("/api/etudiant/compte");
      localStorage.removeItem("token");
      localStorage.removeItem("etudiant");
      navigate("/student/login");
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.error || "Erreur lors de la suppression." });
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("etudiant");
    navigate("/student/login");
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  const fullName = `${form.prenom} ${form.nom}`.trim() || "Étudiant";
  const initial  = fullName[0]?.toUpperCase() || "E";
  const [bgColor, textColor] = avatarColor(fullName);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: 22 }}>Paramètres</h2>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>Gérez votre compte et vos préférences</p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type} alert-dismissible`}>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage(null)} />
        </div>
      )}

      <div className="row g-4" style={{ maxWidth: 700 }}>

        {/* Aperçu avatar — se met à jour en temps réel */}
        <div className="col-12">
          <div className="card p-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
            <div className="d-flex align-items-center gap-4">
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: bgColor, color: textColor,
                fontWeight: 800, fontSize: 26,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.3s",
              }}>
                {initial}
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: 16 }}>
                  {form.prenom || "—"} {form.nom || ""}
                </div>
                <div className="text-muted" style={{ fontSize: 13 }}>{form.email}</div>
                <small className="text-muted" style={{ fontSize: 11 }}>
                  L'avatar se met à jour automatiquement
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="col-12">
          <div className="card p-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
            <h5 className="fw-bold mb-4">Informations personnelles</h5>

            {/* ✅ Prénom et Nom séparés */}
            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label fw-semibold small">Prénom</label>
                <input type="text" className="form-control" style={{ borderRadius: 8 }}
                  value={form.prenom}
                  onChange={e => setForm({ ...form, prenom: e.target.value })} />
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-semibold small">Nom</label>
                <input type="text" className="form-control" style={{ borderRadius: 8 }}
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Adresse e-mail</label>
              <input type="email" className="form-control" style={{ borderRadius: 8 }}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-0">
              <label className="form-label fw-semibold small">Téléphone</label>
              <input type="text" className="form-control" style={{ borderRadius: 8 }}
                value={form.telephone}
                onChange={e => setForm({ ...form, telephone: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Mot de passe */}
        <div className="col-12">
          <div className="card p-4" style={{ borderRadius: 14, border: "1px solid #e8eaf0" }}>
            <h5 className="fw-bold mb-4">Changer le mot de passe</h5>
            <div className="mb-0">
              <label className="form-label fw-semibold small">Nouveau mot de passe</label>
              <input type="password" className="form-control" style={{ borderRadius: 8 }}
                placeholder="Laisser vide pour ne pas changer"
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })} />
              <small className="text-muted">Minimum 6 caractères</small>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="col-12">
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn btn-primary d-flex align-items-center gap-2"
              style={{ borderRadius: 8 }} onClick={handleSave} disabled={saving}>
              {saving
                ? <><span className="spinner-border spinner-border-sm" />Sauvegarde...</>
                : <><i className="bi bi-check-lg" />Enregistrer les modifications</>}
            </button>
            <button className="btn btn-outline-danger d-flex align-items-center gap-2"
              style={{ borderRadius: 8 }} onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" />Déconnexion
            </button>
          </div>
        </div>

        {/* Zone danger */}
        <div className="col-12">
          <div className="card p-4" style={{ borderRadius: 14, border: "1px solid #fca5a5" }}>
            <h5 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: "#dc2626" }}>
              <i className="bi bi-exclamation-triangle-fill" />Zone dangereuse
            </h5>
            <p className="text-muted small mb-3">
              La suppression de votre compte est <strong>irréversible</strong>. Toutes vos données,
              candidatures et informations personnelles seront définitivement effacées.
            </p>
            {!showConfirm ? (
              <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                style={{ borderRadius: 8, width: "fit-content" }} onClick={() => setShowConfirm(true)}>
                <i className="bi bi-trash" />Supprimer mon compte
              </button>
            ) : (
              <div className="p-3 rounded" style={{ background: "#fff5f5", border: "1px solid #fca5a5" }}>
                <p className="fw-semibold mb-1" style={{ color: "#dc2626", fontSize: 14 }}>
                  Êtes-vous sûr de vouloir supprimer votre compte ?
                </p>
                <p className="text-muted small mb-3">
                  Cette action supprimera définitivement votre profil, vos candidatures et toutes vos données.
                </p>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}
                    onClick={() => setShowConfirm(false)}>Annuler</button>
                  <button className="btn btn-danger btn-sm d-flex align-items-center gap-2"
                    style={{ borderRadius: 8 }} onClick={handleDelete} disabled={deleting}>
                    {deleting
                      ? <><span className="spinner-border spinner-border-sm" />Suppression...</>
                      : <><i className="bi bi-trash-fill" />Oui, supprimer définitivement</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}