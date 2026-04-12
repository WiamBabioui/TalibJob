describe("Login Etudiant", () => {

  it("un étudiant peut se connecter", () => {

    cy.loginEtudiant()

    cy.url().should("include", "dashboard")

  })

})