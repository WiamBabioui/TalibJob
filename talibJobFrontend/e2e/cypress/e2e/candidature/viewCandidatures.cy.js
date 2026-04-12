describe("View Candidatures", () => {

  it("entreprise consulte candidatures", () => {

    cy.loginEntreprise()

    cy.visit("/candidatures")

    cy.contains("Candidature")

  })

})