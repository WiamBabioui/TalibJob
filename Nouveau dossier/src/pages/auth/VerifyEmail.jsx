import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams(); // token envoyé dans le mail
  const [status, setStatus] = useState("Vérification en cours...");

  useEffect(() => {
    // Ici tu appelleras ton API pour vérifier le token
    // Exemple : api.get(`/verify-email/${token}`)
    // Simulation :
    setTimeout(() => {
      setStatus("Votre email a été vérifié avec succès !");
    }, 1500);
  }, [token]);

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "420px", borderRadius: "16px" }}>
        <h4 className="text-center fw-bold mb-3">Vérification de l'email</h4>
        <p className="text-center text-muted">{status}</p>

        {status === "Votre email a été vérifié avec succès !" && (
          <div className="text-center mt-3">
            <Link to="/company/login" className="btn btn-primary">
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;