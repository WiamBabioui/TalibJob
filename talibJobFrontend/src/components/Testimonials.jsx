import sofi from "../img/sofie.jpg"
import Antoine from "../img/Antoine.webp"
import lucas from "../img/lu.jpg"
const Testimonials = () => (
  <section className="testimonials-section bg-light">
  <div className="container">
    <h2 style={{textAlign:"center",marginTop:"40px",fontSize:"50px"}}>Ce qu’ils disent de nous</h2>
    <p className="testimonials-subtitle">
      Des étudiants et des entreprises satisfaits partagent leurs expériences.
    </p>

    <div className="row g-4 justify-content-center">
      <div className="col-md-4 testimonial-card text-center">
        <img src={lucas} alt="Lucas Dubois" className="testimonial-img mb-3" />
        <p>
          “Talib-Job m’a permis de trouver un job flexible en tant qu’étudiant en marketing.
          La plateforme est simple et très efficace.”
        </p>
        <strong>Lucas Dubois</strong>
      </div>
      <div className="col-md-4 testimonial-card text-center">
        <img src={sofi} alt="Sophie Martin" className="testimonial-img mb-3" />
        <p>
          “Nous avons recruté plusieurs étudiants brillants grâce à Talib-Job.
          C’est une solution rapide et fiable.”
        </p>
        <strong>Sophie Martin</strong>
      </div>
      <div className="col-md-4 testimonial-card text-center">
        <img src={Antoine} alt="Antoine Lefevre" className="testimonial-img mb-3" />
        <p>
          “J’ai trouvé mon stage et plusieurs missions freelance via Talib-Job.
          Un gain de temps considérable.”
        </p>
        <strong>Antoine Lefevre</strong>
      </div>

    </div>
  </div>
</section>
);

export default Testimonials;
