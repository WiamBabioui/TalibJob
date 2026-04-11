import React from "react";
import "./App.css";
// adapte le chemin selon ton projet

const steps = [
  {
    icon: "bi bi-person-plus",
    step: "01",
    title: "Créer un compte",
    description:
      "Inscrivez-vous gratuitement en tant qu'étudiant ou entreprise et complétez votre profil en quelques minutes.",
  },
  {
    icon: "bi bi-search",
    step: "02",
    title: "Explorer les opportunités",
    description:
      "Recherchez des offres adaptées à vos compétences ou publiez vos besoins pour trouver le bon profil.",
  },
  {
    icon: "bi bi-check-circle",
    step: "03",
    title: "Démarrer la collaboration",
    description:
      "Postulez, échangez directement et commencez à travailler en toute simplicité.",
  },
];

const HowItWorks = () => (
  <section className="section section-light">
    <div className="container">
      {/* En-tête */}
      <div className="text-center mb-2">
        <span className="section-eyebrow">Démarrage rapide</span>
      </div>
      <h2 className="section-title text-center">Comment ça marche ?</h2>
      <div className="section-divider"></div>
      <p className="section-subtitle">
        Commencez sur{" "}
        <span className="text-blue fw-700">Talib-Job</span> en seulement
        trois étapes simples.
      </p>

      {/* Cards */}
      <div className="row g-4">
        {steps.map((step) => (
          <div className="col-md-4" key={step.step}>
            <div className="feature-card">
              {/* Numéro discret en fond */}
              <span className="feature-step">{step.step}</span>

              {/* Icône */}
              <div className="feature-icon-wrap">
                <i className={`${step.icon} feature-icon`}></i>
              </div>

              <h5>{step.title}</h5>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;