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
      if (form.nom !== original.nom) payload.nom = form.nom;
      if (form.telephone !== original.telephone) payload.telephone = form.telephone;
      if (form.email !== original.email) payload.email = form.email;
      if (form.newPassword) payload.newPassword = form.newPassword;

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
    <div className="container-fluid px-3 px-md-4">

      <h3 className="fw-bold mb-4">Paramètres</h3>

      {message && (
        <div className={`alert alert-${message.type} alert-dismissible`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage(null)} />
        </div>
      )}

      {/* Informations */}
      <div className="card p-3 p-md-4 mb-4 w-100" style={{ borderRadius: "12px", maxWidth: "600px" }}>
        <h5 className="fw-bold mb-4">Informations de l'entreprise</h5>

        <div className="mb-3">
          <label className="form-label fw-semibold">Nom</label>
          <input
            type="text"
            className="form-control"
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Téléphone</label>
          <input
            type="text"
            className="form-control"
            value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })}
          />
        </div>
      </div>

      {/* Password */}
      <div className="card p-3 p-md-4 mb-4 w-100" style={{ borderRadius: "12px", maxWidth: "600px" }}>
        <h5 className="fw-bold mb-4">Mot de passe</h5>

        <input
          type="password"
          className="form-control"
          placeholder="Nouveau mot de passe"
          value={form.newPassword}
          onChange={e => setForm({ ...form, newPassword: e.target.value })}
        />
      </div>

      {/* Actions */}
      <div className="d-flex flex-column flex-sm-row gap-2 mb-4 w-100" style={{ maxWidth: "600px" }}>
        <button
          className="btn btn-primary w-100"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Sauvegarde..." : "Enregistrer"}
        </button>

        <button
          className="btn btn-outline-danger w-100"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>

      {/* Danger */}
      <div className="card p-3 p-md-4 w-100" style={{ borderRadius: "12px", maxWidth: "600px" }}>
        <h5 className="text-danger fw-bold">Zone dangereuse</h5>

        {!showConfirm ? (
          <button
            className="btn btn-outline-danger w-100 mt-2"
            onClick={() => setShowConfirm(true)}
          >
            Supprimer le compte
          </button>
        ) : (
          <div className="mt-3">
            <p className="text-danger">Confirmer suppression ?</p>

            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                className="btn btn-secondary w-100"
                onClick={() => setShowConfirm(false)}
              >
                Annuler
              </button>

              <button
                className="btn btn-danger w-100"
                onClick={handleDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}