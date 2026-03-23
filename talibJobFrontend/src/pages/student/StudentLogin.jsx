import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import logo from "../../img/logotalibo.jpeg";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ erreurs séparées
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    // reset errors
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Veuillez entrer votre adresse e-mail");
      hasError = true;
    }

    if (!motDePasse) {
      setPasswordError("Veuillez entrer votre mot de passe");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await api.post("/api/etudiant/login", { email, motDePasse });

      if (response.data.error) {
        // ici on peut essayer de détecter si l'erreur concerne email ou mot de passe
        if (response.data.error.toLowerCase().includes("email")) {
          setEmailError(response.data.error);
        } else if (response.data.error.toLowerCase().includes("mot de passe")) {
          setPasswordError(response.data.error);
        } else {
          setEmailError(response.data.error);
          setPasswordError(response.data.error);
        }
      } else if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("etudiant", JSON.stringify(response.data.etudiant));
        navigate("/Dashboard");
      }
    } catch (error) {
      setEmailError("Erreur de connexion au serveur");
      setPasswordError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "420px", borderRadius: "16px" }}>
        
        {/* Logo */}
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: "60px", borderRadius: "8px" }} />
          <h5 className="fw-bold mt-2" style={{ color: "#007bff" }}>TALIB-JOB</h5>
          <h4 className="mt-1">Connectez-vous à votre<br />Espace Étudiant</h4>
          <p className="text-muted small">Entrez vos identifiants pour accéder à toutes les opportunités.</p>
        </div>

        {/* Tabs */}
        <div className="d-flex rounded overflow-hidden border mb-4">
          <div className="flex-fill text-center py-2 fw-semibold" style={{ background: "#fff", cursor: "default" }}>
            Se connecter
          </div>
          <Link to="/student/register" className="flex-fill text-center py-2 text-muted text-decoration-none" style={{ background: "#f8f9fa" }}>
            S'inscrire
          </Link>
        </div>

        {/* Champs Email */}
        <label className="form-label fw-semibold">Adresse e-mail</label>
        <div className="input-group mb-1">
          <span className="input-group-text"><i className="bi bi-envelope"></i></span>
          <input
            type="email"
            className={`form-control ${emailError ? "is-invalid" : ""}`}
            placeholder="nom.prenom@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {emailError && <p style={{ color: "red", fontSize: "14px", marginBottom: "8px" }}>{emailError}</p>}

        {/* Champs Mot de passe */}
        <label className="form-label fw-semibold">Mot de passe</label>
        <div className="input-group mb-1">
          <span className="input-group-text"><i className="bi bi-lock"></i></span>
          <input
            type="password"
            className={`form-control ${passwordError ? "is-invalid" : ""}`}
            placeholder="••••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
        </div>
        {passwordError && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{passwordError}</p>}

        <div className="text-end mb-3">
          <Link to="#" className="text-decoration-none small" style={{ color: "#007bff" }}>
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Bouton de connexion */}
        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin} disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {/* Divider */}
        <div className="d-flex align-items-center mb-3">
          <hr className="flex-fill" />
          <span className="px-2 text-muted small">OU</span>
          <hr className="flex-fill" />
        </div>

        {/* Google login */}
        <button className="btn btn-outline-secondary w-100">
          <i className="bi bi-google me-2"></i>Se connecter avec Google
        </button>

        <p className="text-center text-muted mt-3" style={{ fontSize: "12px" }}>
          En continuant, vous acceptez les{" "}
          <span style={{ color: "#007bff", cursor: "pointer" }}>Conditions d'utilisation</span> et la{" "}
          <span style={{ color: "#007bff", cursor: "pointer" }}>Politique de confidentialité</span> de TALIB.
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;