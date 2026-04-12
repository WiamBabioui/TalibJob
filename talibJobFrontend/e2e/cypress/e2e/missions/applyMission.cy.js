describe("Apply Mission", () => {

  it("un étudiant postule à une mission", () => {

    cy.loginEtudiant()

    cy.visit("/missions")

    cy.contains("Postuler").first().click()

    cy.contains("Candidature envoyée")

  })

})