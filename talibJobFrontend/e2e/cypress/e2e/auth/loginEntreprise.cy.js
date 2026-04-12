describe("Login Entreprise", () => {

  it("une entreprise peut se connecter", () => {

    cy.loginEntreprise()

    cy.url().should("include", "dashboard")

  })

})