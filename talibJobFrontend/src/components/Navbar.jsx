import { Link } from "react-router-dom";
import logo from "../img/logoFinalTalibJob.png";
import "./App.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src={logo}
            alt="logo"
            style={{ width: "40px", height: "65px", objectFit: "contain" }}
          />
          <span
            style={{
              color: "rgb(28,108,227)",
              fontSize: "17px",
              fontWeight: 800,
              fontFamily: "'Raleway', sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            TALIB-JOB
          </span>
        </Link>
        {/* Hamburger pour mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu desktop */}
        {/* Menu desktop */}
        <div className="d-none d-lg-flex justify-content-between w-100">
          <ul className="navbar-nav mx-auto gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Accueil
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/student/login">
                Chercher un job
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/company/login">
                Publier une offre
              </Link>
            </li>
          </ul>
          <div className="d-flex gap-2">
            <Link to="/student/login" className="btn btn-primary">
              Espace Étudiant
            </Link>
            <Link to="/company/login" className="btn2">
              Espace Entreprise
            </Link>
          </div>
        </div>

        {/* Offcanvas mobile */}
        <div
          className="offcanvas offcanvas-end d-lg-none"
          tabIndex="-1"
          id="offcanvasNavbar"
        >
          <div className="offcanvas-header ">
            <h5 className="offcanvas-title">Menu</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column gap-3">
            <Link className="nav-link" to="/">
              Accueil
            </Link>
            <Link className="nav-link" to="/student/login">
              Chercher un job
            </Link>
            <Link className="nav-link" to="/company/login">
              Publier une offre
            </Link>
            <Link to="/student/login" className="btn btn-primary mt-2">
              Espace Étudiant
            </Link>
            <Link to="/company/login" className="btn3">
              Espace Entreprise
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
