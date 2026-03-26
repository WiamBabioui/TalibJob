const WhyTalibJob = () => (
  <section className="section section-light">
    <div>
      <h2 style={{ textAlign:"center",fontSize:"50px"}}>Pourquoi choisir <span style={{color:"rgb(42, 110, 246)",fontWeight:700}}>Talib-Job</span> pour vos études ?</h2>
      <p className="section-subtitle">
        Découvrez les nombreux avantages de notre plateforme pensée spécialement pour les étudiants.
      </p>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-cash-coin feature-icon"></i>
            <h5>Revenus complémentaires</h5>
            <p>
              Gagnez de l’argent pour financer vos études et vos loisirs sans compromettre votre emploi du temps.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-calendar-check feature-icon"></i>
            <h5>Flexibilité des horaires</h5>
            <p>
              Trouvez des jobs qui s’adaptent parfaitement à votre planning universitaire et personnel.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-award feature-icon"></i>
            <h5>Expérience valorisante</h5>
            <p>
              Acquérez une expérience professionnelle enrichissante et développez des compétences utiles pour votre carrière.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WhyTalibJob;
