const HowItWorks = () => (
  <section className="section section-light">
    <div>
      <h2 style={{textAlign:"center",marginTop:"40px",fontSize:"50px"}}>Comment ça marche ?</h2>
      <p className="section-subtitle">
        Commencez sur <span style={{color:"rgb(42, 110, 246)",fontWeight:700}}>Talib-Job</span> en seulement trois étapes simples.
      </p>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-person-plus feature-icon"></i>
            <h5>Créer un compte</h5>
            <p>
              Inscrivez-vous gratuitement en tant qu’étudiant ou entreprise et
              complétez votre profil.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-search feature-icon"></i>
            <h5>Explorer les opportunités</h5>
            <p>
              Recherchez des offres adaptées à vos compétences ou publiez vos
              besoins.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="feature-card text-center">
            <i className="bi bi-check-circle feature-icon"></i>
            <h5>Démarrer la collaboration</h5>
            <p>
              Postulez, échangez et commencez à travailler en toute simplicité.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
