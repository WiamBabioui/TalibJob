describe("Search Mission", () => {

  it("rechercher mission React", () => {

    cy.visit("/missions")

    cy.get('input[name=search]').type("React")

    cy.contains("React")

  })

})