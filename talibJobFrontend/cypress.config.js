const { defineConfig } = require("cypress")

module.exports = defineConfig({

  e2e: {

    baseUrl: "http://localhost:5173",

    specPattern: "e2e/cypress/e2e/**/*.cy.js",

    supportFile: "e2e/cypress/support/e2e.js",

  },

})