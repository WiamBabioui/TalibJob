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
              <Link to="/student/login" className="btn-blue" style={{textDecoration:"none"}}>
                <i className="bi bi-search me-2"></i>
                Trouver votre part-time job
              </Link>

              <Link to="/company/login" className="btn-orange" style={{textDecoration:"none"}}>
                <i className="bi bi-briefcase me-2"></i>
                Publier votre offre
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="col-lg-6 text-center">
            <img src={imgPrincipal} alt="Accueil Image" className="img-fluid" style={{ maxHeight: "500px", objectFit: "contain" }}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
