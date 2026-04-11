import React from "react";
import "./App.css";

// Remplace ces imports par tes vrais chemins d'images
import salwa from "../img/salwa.avif";
import Mohammed  from "../img/Mohammed.jpg";
import Wissal from "../img/wissalLhlou.avif";

const testimonials = [
  {
    img:salwa,
    name: "Salwa Mabchour",
    role: "Étudiant en Marketing",
    stars: 5,
    quote:
      "Talib-Job m'a permis de trouver un job flexible en tant qu'étudiant en marketing. La plateforme est simple et très efficace.",
  },
  {
    img: Mohammed,
    name: "Mohemmed Naji",
    role: "DRH — StartupRH",
    stars: 5,
    quote:
      "Nous avons recruté plusieurs étudiants brillants grâce à Talib-Job. C'est une solution rapide et fiable pour nos besoins.",
  },
  {
    img: Wissal,
    name: "wissal Lahlou",
    role: "Étudiant en Informatique",
    stars: 5,
    quote:
      "J'ai trouvé mon stage et plusieurs missions freelance via Talib-Job. Un gain de temps considérable pour ma carrière.",
  },
];

const Stars = ({ count }) =>
  Array.from({ length: count }).map((_, i) => (
    <span key={i} style={{ color: "var(--orange)", fontSize: 16 }}>★</span>
  ));

const Testimonials = () => (
  <section className="testimonials-section">
    <div className="container">
      {/* En-tête */}
      <div className="text-center mb-2">
        <span className="section-eyebrow">Témoignages</span>
      </div>
      <h2 className="testimonials-title">Ce qu'ils disent de nous</h2>
      <div className="section-divider"></div>
      <p className="testimonials-subtitle">
        Des étudiants et des entreprises satisfaits partagent leurs expériences.
      </p>

      {/* Cards */}
      <div className="row g-4 justify-content-center">
        {testimonials.map((t) => (
          <div className="col-md-4" key={t.name}>
            <div className="testimonial-card">
              {/* Photo */}
              <img
                src={t.img}
                alt={t.name}
                className="testimonial-img"
              />

              {/* Étoiles */}
              <div className="testimonial-stars">
                <Stars count={t.stars} />
              </div>

              {/* Citation */}
              <p>"{t.quote}"</p>

              {/* Identité */}
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;