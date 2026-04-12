import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../../pages/Dashboard.jsx";

// Ajoutez "async" ici
test("dashboard render", async () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

  // Utilisez "await" et "findByText" pour attendre que le texte apparaisse
  const element = await screen.findByText(/tableau de bord/i);
  expect(element).toBeInTheDocument();
});