import React from "react";
import "./App.css";


const advantages = [
  {
    icon: "bi bi-cash-coin",
    title: "Revenus complémentaires",
    description:
      "Gagnez de l'argent pour financer vos études et vos loisirs sans compromettre votre emploi du temps.",
  },
  {
    icon: "bi bi-calendar-check",
    title: "Flexibilité des horaires",
    description:
      "Trouvez des jobs qui s'adaptent parfaitement à votre planning universitaire et personnel.",
  },
  {
    icon: "bi bi-award",
    title: "Expérience valorisante",
    description:
      "Acquérez une expérience professionnelle enrichissante et développez des compétences utiles pour votre carrière.",
  },
];

const WhyTalibJob = () => (
  <section className="section section-white">
    <div className="container">
      {/* En-tête */}
      <div className="text-center mb-2">
        <span className="section-eyebrow">Vos avantages</span>
      </div>
      <h2 className="section-title text-center">
        Pourquoi choisir{" "}
        <span className="text-blue">Talib-Job</span> pour vos études ?
      </h2>
      <div className="section-divider"></div>
      <p className="section-subtitle">
        Découvrez les nombreux avantages de notre plateforme pensée
        spécialement pour les étudiants.
      </p>

      {/* Cards */}
      <div className="row g-4">
        {advantages.map((item) => (
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

export default WhyTalibJob;