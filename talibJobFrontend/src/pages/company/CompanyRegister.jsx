// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaGoogle, FaLinkedin, FaApple } from "react-icons/fa";
// import api from "../../services/api";
// import logo from "../../img/logotalibo.jpeg";

// const CompanyRegister = () => {
//   const [formData, setFormData] = useState({
//     nomEntreprise: "",
//     email: "",
//     motDePasse: "",
//     confirmMotDePasse: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!formData.nomEntreprise || !formData.email || !formData.motDePasse || !formData.confirmMotDePasse) {
//       alert("Veuillez remplir tous les champs");
//       return;
//     }
//     if (formData.motDePasse !== formData.confirmMotDePasse) {
//       alert("Les mots de passe ne correspondent pas");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await api.post("/entreprise/register", {
//         nomEntreprise: formData.nomEntreprise,
//         email: formData.email,
//         motDePasse: formData.motDePasse,
//       });
//       if (response.data.error) {
//         alert(response.data.error + " ❌");
//       } else if (response.data.success) {
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("entreprise", JSON.stringify(response.data.entreprise));
//         navigate("/company/dashboard");
//       }
//     } catch (err) {
//       if (err.response?.data?.error) {
//         alert(err.response.data.error + " ❌");
//       } else {
//         alert("Erreur de connexion au serveur ❌");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: "100vh" }}>
//       <div className="card p-4 shadow-sm" style={{ width: "420px", borderRadius: "16px" }}>
//         {/* Logo */}
//         <div className="text-center mb-4">
//           <img src={logo} alt="Logo" style={{ width: "60px", borderRadius: "8px" }} />
//           <h5 className="fw-bold mt-2" style={{ color: "#007bff" }}>AJI TA5DEM</h5>
//           <h4 className="mt-1">S'inscrire – Espace Entreprise</h4>
//           <p className="text-muted small">Publiez des offres et trouvez les meilleurs profils.</p>
//         </div>

//         <input type="text" name="nomEntreprise" className="form-control mb-2" placeholder="Nom de l'entreprise" value={formData.nomEntreprise} onChange={handleChange} />
//         <input type="email" name="email" className="form-control mb-2" placeholder="Adresse e-mail" value={formData.email} onChange={handleChange} />
//         <input type="password" name="motDePasse" className="form-control mb-2" placeholder="Mot de passe" value={formData.motDePasse} onChange={handleChange} />
//         <input type="password" name="confirmMotDePasse" className="form-control mb-3" placeholder="Confirmer le mot de passe" value={formData.confirmMotDePasse} onChange={handleChange} />

//         <button className="btn btn-primary w-100 mb-3" onClick={handleSubmit} disabled={loading}>
//           {loading ? "Inscription..." : "S'inscrire"}
//         </button>

//         <p className="text-center">
//           Vous avez déjà un compte ?{" "}
//           <Link to="/company/login" style={{ color: "#007bff" }}>Se connecter</Link>
//         </p>

//         <p className="text-center text-muted mt-2" style={{ fontSize: "12px" }}>
//           En vous inscrivant, vous acceptez nos{" "}
//           <span style={{ color: "#007bff", cursor: "pointer" }}>Conditions d'utilisation</span> et notre{" "}
//           <span style={{ color: "#007bff", cursor: "pointer" }}>Politique de confidentialité</span>.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default CompanyRegister;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import logo from "../../img/logoFinalTalibJob.png";
import "../../components/App.css";
const CompanyRegister = () => {
  const [formData, setFormData] = useState({
    nomEntreprise: "",
    email: "",
    motDePasse: "",
    confirmMotDePasse: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !formData.nomEntreprise ||
      !formData.email ||
      !formData.motDePasse ||
      !formData.confirmMotDePasse
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (formData.motDePasse !== formData.confirmMotDePasse) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/entreprise/register", {
        nomEntreprise: formData.nomEntreprise,
        email: formData.email,
        motDePasse: formData.motDePasse,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "entreprise",
          JSON.stringify(response.data.entreprise),
        );
        navigate("/company/dashboard");
      } else {
        alert(response.data.error || "Erreur ❌");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Erreur serveur ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-center">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "60px", borderRadius: "8px" }}
            />
          </div>{" "}
          <h5 className="fw-bold mt-2 text-primary">TALIB JOB</h5>
          <h4 className="mt-1">Créer un compte</h4>
          <p className="text-muted small">
            Publiez des offres et trouvez les meilleurs profils.
          </p>
        </div>

        {/* Form */}
        <input
          type="text"
          name="nomEntreprise"
          className="form-control mb-2"
          placeholder="Nom de l'entreprise"
          value={formData.nomEntreprise}
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
          className="form-control mb-2"
          placeholder="Mot de passe"
          value={formData.motDePasse}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmMotDePasse"
          className="form-control mb-3"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmMotDePasse}
          onChange={handleChange}
        />

        {/* Button */}
        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        {/* Link */}
        <p className="text-center">
          Déjà un compte ?{" "}
          <Link to="/company/login" className="text-primary">
            Se connecter
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-muted small mt-2">
          En vous inscrivant, vous acceptez nos{" "}
          <span className="text-primary">Conditions</span> et{" "}
          <span className="text-primary">Politique</span>.
        </p>
      </div>
    </div>
  );
};

export default CompanyRegister;
