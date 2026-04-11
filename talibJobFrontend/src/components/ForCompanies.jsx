import React from "react";
import "./App.css";


const features = [
  {
    icon: "bi bi-people",
    title: "Accès à des talents étudiants",
    description:
      "Publiez vos offres et recrutez des étudiants qualifiés pour des missions temporaires ou à long terme.",
  },
  {
    icon: "bi bi-lightning-charge",
    title: "Recrutement rapide",
    description:
      "Gagnez du temps grâce à un processus simple et une mise en relation directe avec les candidats.",
  },
  {
    icon: "bi bi-shield-check",
    title: "Profils vérifiés",
    description:
      "Accédez à des profils fiables avec des informations vérifiées pour recruter en toute confiance.",
  },
];

const ForCompanies = () => (
  <section className="section section-light">
    <div className="container">
      {/* En-tête */}
      <div className="text-center mb-2">
        <span className="section-eyebrow">Recruteurs</span>
      </div>
      <h2 className="section-title text-center">
        <span className="text-blue">Talib-Job</span> pour les entreprises
      </h2>
      <div className="section-divider"></div>
      <p className="section-subtitle">
        Trouvez rapidement des talents motivés et disponibles pour vos besoins.
      </p>

      {/* Cards */}
      <div className="row g-4">
        {features.map((item) => (
          <div className="col-md-4" key={item.title}>
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <i className={`${item.icon} feature-icon`}></i>
              </div>
              <h5>{item.title}</h5>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ForCompanies;