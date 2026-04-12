describe("Register User", () => {

  it("création compte étudiant", () => {

    cy.visit("http://localhost:5173/register")

    cy.get('input[name=nom]').type("Test")
    cy.get('input[name=prenom]').type("User")
    cy.get('input[name=email]').type("testuser@mail.com")
    cy.get('input[name=password]').type("123456")

    cy.contains("Register").click()

    cy.contains("Compte créé")

  })

})