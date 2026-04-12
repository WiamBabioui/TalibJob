Cypress.Commands.add("loginEtudiant", () => {

  cy.visit("http://localhost:5173/login")

  cy.fixture("etudiant").then((user) => {

    cy.get('input[name=email]').type(user.email)
    cy.get('input[name=password]').type(user.password)

  })

  cy.contains("Login").click()

})

Cypress.Commands.add("loginEntreprise", () => {

  cy.visit("http://localhost:5173/login")

  cy.fixture("entreprise").then((user) => {

    cy.get('input[name=email]').type(user.email)
    cy.get('input[name=password]').type(user.password)

  })

  cy.contains("Login").click()

})