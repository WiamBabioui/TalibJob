import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaLinkedin, FaApple } from "react-icons/fa";
import api from "../../services/api";
import logo from "../../img/logoFinalTalibJob.png";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.motDePasse
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/etudiant/register", formData);
      if (response.data.error) {
        alert(response.data.error + " ❌");
      } else if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "etudiant",
          JSON.stringify(response.data.etudiant),
        );
        navigate("/Dashboard");
      }
    } catch (err) {
      if (err.response?.data?.error) {
        alert(err.response.data.error + " ❌");
      } else {
        alert("Erreur de connexion au serveur ❌");
      }
    } finally {
      setLoading(false);
    }
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
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-center">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "60px", borderRadius: "8px" }}
            />
          </div>{" "}
          <h5 className="fw-bold mt-2" style={{ color: "#007bff" }}>
            TALIB JOB
          </h5>
          <h4 className="mt-1">S'inscrire – Espace Étudiant</h4>
          <p className="text-muted small">
            Trouvez un job, un stage ou une mission facilement.
          </p>
        </div>

        {/* Tabs */}
        <div className="d-flex rounded overflow-hidden border mb-4">
          <Link
            to="/student/login"
            className="flex-fill text-center py-2 text-muted text-decoration-none"
            style={{ background: "#f8f9fa" }}
          >
            Se connecter
          </Link>
          <div
            className="flex-fill text-center py-2 fw-semibold"
            style={{ background: "#fff", cursor: "default" }}
          >
            S'inscrire
          </div>
        </div>

        <input
          type="text"
          name="nom"
          className="form-control mb-2"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
        />
        <input
          type="text"
          name="prenom"
          className="form-control mb-2"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          className="form-control mb-2"
          placeholder="Adresse e-mail"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="motDePasse"
          className="form-control mb-3"
          placeholder="Mot de passe"
          value={formData.motDePasse}
          onChange={handleChange}
        />

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <p className="text-center text-muted" style={{ fontSize: "12px" }}>
          En vous inscrivant, vous acceptez nos{" "}
          <span style={{ color: "#007bff", cursor: "pointer" }}>
            Conditions d'utilisation
          </span>{" "}
          et notre{" "}
          <span style={{ color: "#007bff", cursor: "pointer" }}>
            Politique de confidentialité
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
