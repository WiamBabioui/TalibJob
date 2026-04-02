import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CompanyParametres() {
  const navigate = useNavigate();
  const [original, setOriginal]       = useState({});
  const [form, setForm]               = useState({ nom: "", email: "", telephone: "", newPassword: "" });
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage]         = useState(null);

  useEffect(() => {
    const e = JSON.parse(localStorage.getItem("entreprise") || "{}");
    const data = { nom: e.nom || "", email: e.email || "", telephone: e.telephone || "", newPassword: "" };
    setOriginal(data);
    setForm(data);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {};
      if (form.nom       !== original.nom)       payload.nom       = form.nom;
      if (form.telephone !== original.telephone) payload.telephone = form.telephone;
      if (form.email     !== original.email)     payload.email     = form.email;
      if (form.newPassword)                      payload.newPassword = form.newPassword;

      if (Object.keys(payload).length === 0) {
        setMessage({ type: "warning", text: "Aucune modification détectée." });
        setSaving(false);
        return;
      }

      const response = await api.put("/entreprise/parametres", payload);
      const stored = JSON.parse(localStorage.getItem("entreprise") || "{}");
      localStorage.setItem("entreprise", JSON.stringify({ ...stored, ...response.data.entreprise }));
      setOriginal(f => ({ ...f, ...payload, newPassword: "" }));
      setForm(f => ({ ...f, newPassword: "" }));
      setMessage({ type: "success", text: "Paramètres enregistrés avec succès ✅" });
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.error || "Erreur lors de la sauvegarde." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete("/entreprise/compte");
      localStorage.removeItem("token");
      localStorage.removeItem("entreprise");
      navigate("/company/login");
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.error || "Erreur lors de la suppression." });
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("entreprise");
    navigate("/company/login");
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Paramètres</h3>

      {message && (
        <div className={`alert alert-${message.type} alert-dismissible`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage(null)} />
        </div>
      )}

      {/* Informations */}
      <div className="card p-4 mb-4" style={{ borderRadius: "12px", maxWidth: "600px" }}>
        <h5 className="fw-bold mb-4">Informations de l'entreprise</h5>
        <div className="mb-3">
          <label className="form-label fw-semibold">Nom de l'entreprise</label>
          <input type="text" className="form-control" value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })} style={{ borderRadius: "8px" }} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input type="email" className="form-control" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} style={{ borderRadius: "8px" }} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Téléphone</label>
          <input type="text" className="form-control" value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })} style={{ borderRadius: "8px" }} />
        </div>
      </div>

      {/* Mot de passe */}
      <div className="card p-4 mb-4" style={{ borderRadius: "12px", maxWidth: "600px" }}>
        <h5 className="fw-bold mb-4">Changer le mot de passe</h5>
        <div className="mb-3">
          <label className="form-label fw-semibold">Nouveau mot de passe</label>
          <input type="password" className="form-control"
            placeholder="Laisser vide pour ne pas changer"
            value={form.newPassword}
            onChange={e => setForm({ ...form, newPassword: e.target.value })}
            style={{ borderRadius: "8px" }} />
          <small className="text-muted">Minimum 6 caractères</small>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex gap-3 mb-4" style={{ maxWidth: "600px" }}>
        <button className="btn btn-primary px-4" onClick={handleSave} disabled={saving}
          style={{ borderRadius: "8px" }}>
          {saving
            ? <><span className="spinner-border spinner-border-sm me-2" />Sauvegarde...</>
            : <><i className="bi bi-check-lg me-2"></i>Enregistrer</>
          }
        </button>
        <button className="btn btn-outline-danger px-4" onClick={handleLogout}
          style={{ borderRadius: "8px" }}>
          <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
        </button>
      </div>

      {/* Zone danger */}
      <div className="card p-4" style={{ borderRadius: "12px", maxWidth: "600px", border: "1px solid #fee2e2" }}>
        <h5 className="fw-bold mb-2" style={{ color: "#dc2626" }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>Zone dangereuse
        </h5>
        <p className="text-muted small mb-3">
          La suppression de votre compte est <strong>irréversible</strong>. Toutes vos offres,
          candidatures reçues et données de l'entreprise seront définitivement effacées.
        </p>

        {!showConfirm ? (
          <button className="btn btn-outline-danger btn-sm" onClick={() => setShowConfirm(true)}
            style={{ borderRadius: "8px", width: "fit-content" }}>
            <i className="bi bi-trash me-2"></i>Supprimer le compte entreprise
          </button>
        ) : (
          <div className="p-3 rounded" style={{ background: "#fff5f5", border: "1px solid #fca5a5" }}>
            <p className="fw-semibold mb-2" style={{ color: "#dc2626" }}>
              Êtes-vous sûr de vouloir supprimer le compte de votre entreprise ?
            </p>
            <p className="text-muted small mb-3">
              Toutes vos offres publiées, candidatures reçues et données seront supprimées définitivement.
            </p>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowConfirm(false)}
                style={{ borderRadius: "8px" }}>
                Annuler
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}
                style={{ borderRadius: "8px" }}>
                {deleting
                  ? <><span className="spinner-border spinner-border-sm me-2" />Suppression...</>
                  : <><i className="bi bi-trash-fill me-2"></i>Oui, supprimer définitivement</>
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
