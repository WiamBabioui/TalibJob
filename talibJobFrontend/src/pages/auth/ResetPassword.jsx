import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // token envoyé dans le mail
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = () => {
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Ici tu appelleras ton API pour réinitialiser le mot de passe avec le token
    // Exemple : api.post("/reset-password", { token, password })
    setMessage("Votre mot de passe a été réinitialisé (simulation)");
    
    // Redirection après 2 sec vers login
    setTimeout(() => {
      navigate("/company/login");
    }, 2000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "420px", borderRadius: "16px" }}>
        <h4 className="text-center fw-bold mb-3">Réinitialiser le mot de passe</h4>
        <p className="text-muted text-center" style={{ fontSize: "14px" }}>
          Entrez votre nouveau mot de passe
        </p>

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        {message && <p style={{ color: "green", fontSize: "14px" }}>{message}</p>}

        <button className="btn btn-primary w-100 mb-3" onClick={handleReset}>Réinitialiser</button>

        <div className="text-center">
          <Link to="/company/login" className="text-decoration-none">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;