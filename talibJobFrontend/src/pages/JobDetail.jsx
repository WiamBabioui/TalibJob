import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postulating, setPostulating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lettre, setLettre] = useState("");
  const [message, setMessage] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    api
      .get(`/missions/${id}`)
      .then((r) => setMission(r.data))
      .catch(() => navigate("/jobs"))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePostuler = async () => {
    if (!isLoggedIn) {
      navigate("/student/login");
      return;
    }
    setPostulating(true);
    setMessage(null);
    try {
      await api.post(`/etudiant/missions/${id}/postuler`, {
        lettreMotivation: lettre,
      });
      setMessage({
        type: "success",
        text: "Candidature envoyée avec succès ! ✅",
      });
      setShowModal(false);
      setLettre("");
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Erreur lors de l'envoi.",
      });
      setShowModal(false);
    } finally {
      setPostulating(false);
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

  if (!mission) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      <div className="container py-5">
        <Link
          to="/jobs"
          className="text-decoration-none text-muted small mb-4 d-inline-flex align-items-center gap-1"
        >
          <i className="bi bi-arrow-left"></i> Retour aux offres
        </Link>

        {message && (
          <div
            className={`alert alert-${message.type} alert-dismissible mt-3 mb-4`}
          >
            {message.text}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMessage(null)}
            />
          </div>
        )}

        <div className="row g-4">
          {/* Contenu principal */}
          <div className="col-lg-8">
            <div
              className="card p-4 mb-4"
              style={{ borderRadius: "16px", border: "1px solid #e8eaf0" }}
            >
              {/* Header offre */}
              <div className="d-flex align-items-start gap-4 mb-4">
                {mission.entreprise?.logo ? (
                  <img
                    src={`${mission.entreprise.logo.startsWith("http") ? mission.entreprise.logo : `http://localhost:8000/storage/${mission.entreprise.logo}`}`}
                    alt="entreprise"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                    style={{
                      width: "64px",
                      height: "64px",
                      background: "linear-gradient(135deg, #1a56db, #0ea5e9)",
                      fontSize: "26px",
                    }}
                  >
                    {(mission.entreprise?.nom || "?")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="fw-bold mb-1" style={{ fontSize: "22px" }}>
                    {mission.titre}
                  </h2>
                  <div
                    className="d-flex flex-wrap gap-3 text-muted"
                    style={{ fontSize: "14px" }}
                  >
                    <span>
                      <i className="bi bi-building me-1"></i>
                      {mission.entreprise?.nom}
                    </span>
                    {mission.lieu && (
                      <span>
                        <i className="bi bi-geo-alt me-1"></i>
                        {mission.lieu}
                      </span>
                    )}
                    {mission.remuneration && (
                      <span style={{ color: "#059669", fontWeight: "600" }}>
                        <i className="bi bi-currency-dollar me-1"></i>
                        {Number(mission.remuneration).toLocaleString()} MAD /
                        mois
                      </span>
                    )}
                    {mission.type && (
                      <span
                        className="badge"
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          fontSize: "12px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        {mission.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <h5 className="fw-bold mb-3">Description du poste</h5>
              <p
                style={{
                  lineHeight: "1.9",
                  color: "#374151",
                  whiteSpace: "pre-wrap",
                }}
              >
                {mission.description}
              </p>

              {/* Compétences */}
              {mission.competencesRequises && (
                <>
                  <h5 className="fw-bold mt-4 mb-3">Compétences requises</h5>
                  <div className="d-flex gap-2 flex-wrap">
                    {mission.competencesRequises.split(",").map((c, i) => (
                      <span
                        key={i}
                        className="badge"
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "6px 14px",
                          fontSize: "13px",
                          borderRadius: "8px",
                        }}
                      >
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Infos supplémentaires */}
              {(mission.dateDebut ||
                mission.dateFin ||
                mission.datePublication) && (
                <div
                  className="row g-3 mt-4 pt-4"
                  style={{ borderTop: "1px solid #f3f4f6" }}
                >
                  {mission.dateDebut && (
                    <div className="col-md-4">
                      <small className="text-muted d-block mb-1">
                        Date de début
                      </small>
                      <span className="fw-semibold">{mission.dateDebut}</span>
                    </div>
                  )}
                  {mission.dateFin && (
                    <div className="col-md-4">
                      <small className="text-muted d-block mb-1">
                        Date de fin
                      </small>
                      <span className="fw-semibold">{mission.dateFin}</span>
                    </div>
                  )}
                  {mission.datePublication && (
                    <div className="col-md-4">
                      <small className="text-muted d-block mb-1">
                        Publiée le
                      </small>
                      <span className="fw-semibold">
                        {mission.datePublication}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div
              className="card p-4"
              style={{
                borderRadius: "16px",
                border: "1px solid #e8eaf0",
                position: "sticky",
                top: "20px",
              }}
            >
              {/* Entreprise */}
              <div className="d-flex align-items-center gap-3 mb-3">
                {mission.entreprise?.logo ? (
                  <img
                    src={`${mission.entreprise.logo.startsWith("http") ? mission.entreprise.logo : `http://localhost:8000/storage/${mission.entreprise.logo}`}`}
                    alt="entreprise"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                    style={{
                      width: "52px",
                      height: "52px",
                      background: "linear-gradient(135deg, #1a56db, #0ea5e9)",
                      fontSize: "20px",
                    }}
                  >
                    {(mission.entreprise?.nom || "?")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="fw-bold">{mission.entreprise?.nom}</div>
                  <small className="text-success">
                    <i className="bi bi-patch-check-fill me-1"></i>Recruteur
                    vérifié
                  </small>
                </div>
              </div>

              {mission.entreprise?.description && (
                <p
                  className="text-muted small mb-3"
                  style={{ lineHeight: "1.6" }}
                >
                  {mission.entreprise.description}
                </p>
              )}

              {/* Stats */}
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <div
                    className="p-2 rounded text-center"
                    style={{ background: "#f8fafc" }}
                  >
                    <div className="fw-bold" style={{ color: "#1a56db" }}>
                      {mission.nombreCandidatures}
                    </div>
                    <small className="text-muted">Candidatures</small>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-2 rounded text-center"
                    style={{ background: "#f8fafc" }}
                  >
                    <div className="fw-bold" style={{ color: "#6b7280" }}>
                      {mission.vues}
                    </div>
                    <small className="text-muted">Vues</small>
                  </div>
                </div>
              </div>

              <hr />
              <p className="fw-semibold text-center mb-1">Prêt à postuler ?</p>
              <p className="text-muted text-center small mb-3">
                Postulez directement via notre plateforme.
              </p>

              <button
                className="btn btn-primary w-100 py-2 fw-semibold"
                style={{ borderRadius: "10px", fontSize: "15px" }}
                onClick={() => {
                  if (!isLoggedIn) navigate("/student/login");
                  else setShowModal(true);
                }}
                disabled={postulating}
              >
                <i className="bi bi-send-fill me-2"></i>Postuler maintenant
              </button>

              {!isLoggedIn && (
                <p className="text-muted text-center small mt-2">
                  <Link to="/student/login" style={{ color: "#1a56db" }}>
                    Connectez-vous
                  </Link>{" "}
                  pour postuler
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal lettre de motivation */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "16px",
              border: "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1a56db, #0ea5e9)",
                padding: "20px 24px",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold text-white mb-1">{mission.titre}</h5>
                  <small style={{ color: "rgba(255,255,255,0.85)" }}>
                    {mission.entreprise?.nom}
                  </small>
                </div>
                <button
                  className="btn btn-sm"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  onClick={() => setShowModal(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
            <div className="p-4">
              <label className="form-label fw-semibold mb-1">
                Lettre de motivation{" "}
                <small className="text-muted fw-normal">(optionnel)</small>
              </label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Présentez-vous et expliquez pourquoi cette offre vous intéresse..."
                value={lettre}
                onChange={(e) => setLettre(e.target.value)}
                style={{
                  borderRadius: "10px",
                  resize: "vertical",
                  fontSize: "14px",
                }}
              />
              <small className="text-muted d-block mt-1">
                <i className="bi bi-info-circle me-1"></i>
                Votre profil et CV seront automatiquement joints.
              </small>
            </div>
            <div className="d-flex gap-2 p-4 pt-0">
              <button
                className="btn btn-outline-secondary flex-fill"
                style={{ borderRadius: "8px" }}
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary flex-fill fw-semibold"
                style={{ borderRadius: "8px" }}
                onClick={handlePostuler}
                disabled={postulating}
              >
                {postulating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill me-2"></i>Envoyer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}