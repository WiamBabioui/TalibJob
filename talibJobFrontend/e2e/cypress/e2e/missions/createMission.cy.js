describe("Create Mission", () => {

  it("une entreprise peut créer une mission", () => {

    cy.loginEntreprise()

    cy.visit("/create-mission")

    cy.fixture("mission").then((mission) => {

      cy.get('input[name=titre]').type(mission.titre)

      cy.get('textarea[name=description]')
        .type(mission.description)

    })

    cy.contains("Créer").click()

    cy.contains("Mission créée")

  })

})