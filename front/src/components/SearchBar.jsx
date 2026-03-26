import "./App.css"
 const SearchBar = () => {
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="search-container p-3 w-100">

        <div className="row g-2 align-items-center">

          <div className="col-md">
            <input
              className="form-control form-control-lg search-input"
              placeholder="Mot-clé (ex: développeur)"
            />
          </div>

          <div className="col-md-3">
            <select className="form-select form-select-lg search-input">
              <option>Ville</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select form-select-lg search-input">
              <option>Catégorie</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select form-select-lg search-input">
              <option>Disponibilité</option>
            </select>
          </div>

          <div className="col-md-2 d-grid">
            <button className="btn-search">
              <i className="bi bi-search me-2"></i>
              Rechercher
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SearchBar;