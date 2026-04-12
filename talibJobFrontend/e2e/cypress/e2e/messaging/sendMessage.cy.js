describe("Send Message", () => {

  it("envoyer message étudiant entreprise", () => {

    cy.loginEtudiant()

    cy.visit("/messages")

    cy.get("textarea").type("Bonjour entreprise")

    cy.contains("Envoyer").click()

    cy.contains("Message envoyé")

  })

})