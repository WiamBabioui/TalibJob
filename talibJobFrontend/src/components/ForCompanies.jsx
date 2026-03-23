const ForCompanies = () => (
  <section className="section section-white">
    <div>
      <h2 style={{textAlign:"center",marginTop:"40px",fontSize:"50px"}}> <span style={{color:"rgb(42, 110, 246)",fontWeight:700}}>Talib-Job</span> pour les entreprises</h2>
      <p className="section-subtitle" >
        Trouvez rapidement des talents motivés et disponibles pour vos besoins.
      </p>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-people feature-icon"></i>
            <h5>Accès à des talents étudiants</h5>
            <p>
              Publiez vos offres et recrutez des étudiants qualifiés pour des
              missions temporaires ou à long terme.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-lightning-charge feature-icon"></i>
            <h5>Recrutement rapide</h5>
            <p>
              Gagnez du temps grâce à un processus simple et une mise en relation
              directe avec les candidats.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-shield-check feature-icon"></i>
            <h5>Profils vérifiés</h5>
            <p>
              Accédez à des profils fiables avec des informations vérifiées pour
              recruter en toute confiance.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ForCompanies;
