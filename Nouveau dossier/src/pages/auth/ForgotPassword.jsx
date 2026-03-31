import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Veuillez entrer votre email");
      return;
    }

    // Simulation (plus tard tu connectes avec API)
    setMessage("Un lien de réinitialisation a été envoyé à votre email.");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{ width: "420px", borderRadius: "16px" }}
      >
        <h4 className="text-center fw-bold mb-3">
          Mot de passe oublié
        </h4>

        <p className="text-muted text-center" style={{ fontSize: "14px" }}>
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>

        {/* Email */}
        <input
          type="email"
          className={`form-control mb-3 ${error ? "is-invalid" : ""}`}
          placeholder="votre.email@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
        )}

        {message && (
          <p style={{ color: "green", fontSize: "14px" }}>{message}</p>
        )}

        <button className="btn btn-primary w-100 mb-3" onClick={handleSubmit}>
          Envoyer le lien
        </button>

        <div className="text-center">
          <Link to="/company/login" className="text-decoration-none">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;