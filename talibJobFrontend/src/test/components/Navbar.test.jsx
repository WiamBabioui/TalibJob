import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

test("navbar affiche accueil", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  // On utilise getAllByText car il y a une version Desktop et une version Mobile
  const elements = screen.getAllByText(/accueil/i);
  
  // On vérifie qu'on en a trouvé au moins un
  expect(elements.length).toBeGreaterThan(0);
  expect(elements[0]).toBeInTheDocument();
});