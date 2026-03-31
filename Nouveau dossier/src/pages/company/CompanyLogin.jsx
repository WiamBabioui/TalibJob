import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaLinkedin, FaApple } from "react-icons/fa";
import api from "../../services/api";
import logo from "../../img/logotalibo.jpeg";

const CompanyLogin = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Veuillez entrer votre email");
      hasError = true;
    }

    if (!motDePasse) {
      setPasswordError("Veuillez entrer votre mot de passe");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await api.post("/entreprise/login", {
        email,
        motDePasse
      });

      if (response.data.error) {
        setEmailError(response.data.error);
      } else if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("entreprise", JSON.stringify(response.data.entreprise));
        navigate("/company/dashboard");
      }

    } catch (error) {
      if (error.response?.data?.error) {
        setEmailError(error.response.data.error);
      } else {
        setEmailError("Erreur de connexion au serveur");
      }
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
          <h4 className="mt-1 fw-bold">Espace Entreprise</h4>
          <p className="text-muted small">Connectez-vous ou créez votre compte d'entreprise</p>
        </div>

        {/* Boutons sociaux */}
        <button className="btn btn-outline-secondary w-100 mb-2">
          <FaGoogle className="me-2" /> Continuer avec Google
        </button>

        <button className="btn btn-outline-secondary w-100 mb-2">
          <FaLinkedin className="me-2" /> Continuer avec LinkedIn
        </button>

        <button className="btn btn-outline-secondary w-100 mb-3">
          <FaApple className="me-2" /> Continuer avec Apple
        </button>

        <div className="d-flex align-items-center mb-3">
          <hr className="flex-fill" />
          <span className="px-2 text-muted small">OU</span>
          <hr className="flex-fill" />
        </div>

        {/* Email */}
        <label className="form-label">Adresse e-mail</label>

        <input
          type="email"
          className={`form-control ${emailError ? "is-invalid" : ""}`}
          placeholder="votre.email@entreprise.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailError && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
            {emailError}
          </p>
        )}

        {/* Password */}
        <label className="form-label">Mot de passe</label>

        <input
          type="password"
          className={`form-control ${passwordError ? "is-invalid" : ""}`}
          placeholder="••••••••"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {passwordError && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "5px" }}>
            {passwordError}
          </p>
        )}

        <small className="text-muted d-block mb-2">
          Minimum 8 caractères
        </small>
        <Link
          to="/forgot-password"
          className="text-decoration-none small"
          style={{ color: "#007bff" ,margin:"10px",textAlign:"right"}}
        >
          Mot de passe oublié ?
        </Link>

        <button className="btn btn-primary w-100 mb-2" onClick={handleLogin} disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <Link to="/company/register" className="btn btn-outline-secondary w-100 mb-3">
          S'inscrire
        </Link>

        <p className="text-center text-muted" style={{ fontSize: "12px" }}>
          En vous connectant ou en vous inscrivant, vous acceptez nos{" "}
          <span style={{ color: "#007bff", cursor: "pointer" }}>Conditions d'utilisation</span> et notre{" "}
          <span style={{ color: "#007bff", cursor: "pointer" }}>Politique de confidentialité</span>.
        </p>

      </div>
    </div>
  );
};

export default CompanyLogin;