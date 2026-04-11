import imgPrincipal from "../img/Gemini_Generated_Image_vvd87wvvd87wvvd8-removebg-preview.png";
import { Link } from "react-router-dom";
import "./App.css";

const Hero = () => {
  return (
    <section className="hero py-5">
      <div className="container">
        <div className="row align-items-center">

          {/* Left: Text */}
          <div className="col-12 col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
            <h1 className="hero-title">
              Trouvez votre{" "}
              <span className="text-primary">job</span> étudiant{" "}
              <span className="text-primary">idéal</span>
            </h1>

            <p className="hero-text">
              Découvrez des opportunités de travail flexibles adaptées à votre
              emploi du temps
            </p>

            <div className="hero-buttons d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <Link to="/student/login" className="btn-blue text-decoration-none">
                <i className="bi bi-search me-2"></i>
                Trouver votre part-time job
              </Link>

              <Link to="/company/login" className="btn-orange text-decoration-none">
                <i className="bi bi-briefcase me-2"></i>
                Publier votre offre
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="col-12 col-lg-6 text-center">
            <img
              src={imgPrincipal}
              alt="Accueil"
              className="img-fluid hero-img"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;