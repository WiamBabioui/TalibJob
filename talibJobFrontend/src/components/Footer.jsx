import logo from "../img/logotalibo-removebg-preview.png"
import { Link } from "react-router-dom";
const Footer = () => (
  <footer className="footer">

  <div className="footer-container">
    <div className="footer-about">
      <div className="footer-logo">
        <img src={logo} alt="logo Footer" />
        <h3>TALIB-JOB</h3>
      </div>

      <p className="footer-text">
        Connecting students with flexible part-time jobs and companies with talent.
      </p>

      <div className="footer-social">
        <Link style={{color:"#606060"}}><i className="bi bi-facebook"></i></Link>
        <Link style={{color:"#606060"}}><i className="bi bi-instagram"></i></Link>
        <Link style={{color:"#606060"}}><i className="bi bi-twitter"></i></Link>
        <Link style={{color:"#606060"}}><i className="bi bi-linkedin"></i></Link>
      </div>

    </div>
    <div className="footer-links">

      <div>
        <h5>Pour les étudiants</h5>
        <p><Link>Trouver un Job</Link></p>
        <p><Link>Mon Tableau de bord</Link></p>
        <p><Link>Mes candidatures</Link></p>
      </div>

      <div>
        <h5>Pour les entreprises</h5>
        <p><Link>Publier une offre</Link></p>
        <p><Link>Mon Tableau de bord</Link></p>
        <p><Link>Recruter des talents</Link></p>
      </div>

      <div>
        <h5>TALEB-JOB</h5>
        <p><Link>À propos</Link></p>
        <p><Link>Contact</Link></p>
        <p><Link>FAQ</Link></p>
        <p><Link>Mentions légales</Link></p>
      </div>

    </div>

  </div>

  <hr />

  <p className="footer-copy">
    © 2026 <span>Talib-Job</span>. Tous droits réservés.
  </p>

</footer>
);

export default Footer;
