import { Link } from "react-router-dom";
import logo from "../img/logotalibo.jpeg";
import "./App.css"
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="w-100 d-flex align-items-center justify-content-between px-3">

        {/* Left: Logo + Nom */}
        <Link className="d-flex align-items-center navbar-brand" to="/">
          <img src={logo} alt="logo" style={{ width: "50px" }} />
          <span 
            className="fw-bold ms-2" 
            style={{ color: "rgb(28, 108, 227)", fontSize: "25px", fontFamily: "'Raleway', sans-serif" }}
          >
            TALIB-JOB
          </span>
        </Link>

        {/* Toggle mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Center links + Right buttons */}
        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* Center links */}
          <ul className="navbar-nav" style={{marginLeft:"550px",gap:"30px"}}>
            <li className="nav-item">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="StudentLogin">Chercher un job</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="CompanyLogin">Publier une offre</Link>
            </li>
          </ul>

          {/* Right buttons */}
          <div className="d-flex gap-2 ms-auto">
            <Link to="/student/login" className="btn btn-outline-primary">
              Espace Étudiant
            </Link>
            <Link to="/company/login" className="btn btn-primary">
              Espace Entreprise
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;