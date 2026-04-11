import React from "react";
import logo from "../img/logoFinalTalibJob.png";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const token = localStorage.getItem("token");

  const studentLinks = [
    { label: "Trouver un Job", to: token ? "/jobs" : "/student/login" },
    {
      label: "Mon Tableau de bord",
      to: token ? "/dashboard" : "/student/login",
    },
    {
      label: "Mes candidatures",
      to: token ? "/candidatures" : "/student/login",
    },
  ];

  const companyLinks = [
    {
      label: "Publier une offre",
      to: token ? "/company/offres/nouvelle" : "/company/login",
    },
    {
      label: "Mon Tableau de bord",
      to: token ? "/company/dashboard" : "/company/login",
    },
    {
      label: "Recruter des talents",
      to: token ? "/company/MesOffres" : "/company/login",
    },
  ];

  const aboutLinks = [
    { label: "À propos", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" },
    { label: "Mentions légales", to: "/legal" },
  ];

  const socials = [
    { icon: "bi-facebook", href: "#" },
    { icon: "bi-instagram", href: "#" },
    { icon: "bi-twitter-x", href: "#" },
    { icon: "bi-linkedin", href: "#" },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ── Logo + description + réseaux ── */}
        <div className="footer-about">
          <div className="footer-logo">
            <img src={logo} alt="Talib-Job logo" style={{ width: "55px" }} />
            <h3 style={{ color: "rgb(28,108,227)" }}>TALIB-JOB</h3>
          </div>

          <p className="footer-text">
             Mettre en relation les étudiants avec des emplois à temps partiel
            flexibles et les entreprises à la recherche de talents.
          </p>

          <div className="footer-social">
            {socials.map((s) => (
              <a key={s.icon} href={s.href} aria-label={s.icon}>
                <i className={`bi ${s.icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* ── Colonnes de liens ── */}
        <div className="footer-links">
          <div className="footer-col">
            <h5 style={{color:"#ff9800"}}>Pour les étudiants</h5>
            {studentLinks.map((l) => (
              <Link key={l.label} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h5 style={{color:"#ff9800"}}>Pour les entreprises</h5>
            {companyLinks.map((l) => (
              <Link key={l.label} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h5 style={{color:"#ff9800"}}>Talib-Job</h5>
            {aboutLinks.map((l) => (
              <Link key={l.label} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bas de page ── */}
      <div className="footer-bottom">
        © 2026 <span>Talib-Job</span>. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
