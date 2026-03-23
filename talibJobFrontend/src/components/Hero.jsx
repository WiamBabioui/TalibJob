import imgPrincipal from "../img/Gemini_Generated_Image_6pg9up6pg9up6pg9 (1).png";
import { Link } from "react-router-dom";
import "./App.css";
const Hero = () => {
  return (
    <section className="hero py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left: Text */}
          <div className="col-lg-6">
            <h1
              style={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: 700,
                fontSize: "80px",
              }}
            >
              Trouvez votre{" "}
              <span style={{ color: "rgb(28, 108, 227)" }}>job</span> étudiant{" "}
              <span style={{ color: "rgb(28, 108, 227)" }}>idéal</span>
            </h1>

            <p
              style={{
                fontSize: "26px",
                marginTop: "20px",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Découvrez des opportunités de travail flexibles adaptées à votre
              emploi du temps
            </p>
            <div className="hero-buttons">
              <Link to="/student/StudentLogin">
              <button className="btn-blue">
                <i className="bi bi-search me-2"></i>
                Trouver votre part-time job
              </button>
              </Link>
              
              <Link to="/company/CompanyLogin">
              <button className="btn-orange">

                <i className="bi bi-briefcase me-2"></i>
                Publier votre offre
              </button>
              </Link>
              
            </div>
          </div>

          {/* Right: Image */}
          <div className="col-lg-6 text-center">
            <img
              src={imgPrincipal}
              alt="Acceuil Image"
              style={{ width: "1000px", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
