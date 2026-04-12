describe("Accept Candidature", () => {

  it("accepter candidature", () => {

    cy.loginEntreprise()

    cy.visit("/candidatures")

    cy.contains("Accepter").first().click()

    cy.contains("Candidature acceptée")

  })

})