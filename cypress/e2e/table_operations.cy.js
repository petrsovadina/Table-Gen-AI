describe("Table Operations", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should import CSV file and display data", () => {
    cy.get('input[type="file"]').attachFile("test.csv")
    cy.get("button").contains("Import").click()
    cy.get("table").should("be.visible")
    cy.get("table tbody tr").should("have.length.gt", 0)
  })

  it("should allow editing cell values", () => {
    cy.get("table tbody tr").first().find("td").first().dblclick()
    cy.get("input").type("New Value{enter}")
    cy.get("table tbody tr").first().find("td").first().should("contain", "New Value")
  })

  it("should generate AI data", () => {
    cy.get("textarea").type("Generate a description for each item")
    cy.get("button").contains("Generate AI Data").click()
    cy.get(".progress-bar", { timeout: 30000 }).should("have.attr", "aria-valuenow", "100")
    cy.get("table tbody tr").first().find("td").last().should("not.be.empty")
  })

  it("should export CSV file", () => {
    cy.get("button").contains("Export CSV").click()
    cy.readFile("cypress/downloads/export.csv").should("exist")
  })

  it("should filter and sort data", () => {
    cy.get('input[placeholder="Filter Name"]').type("John")
    cy.get("table tbody tr").should("have.length", 1)
    cy.get("table tbody tr").first().should("contain", "John")

    cy.get("button").contains("Name").click()
    cy.get("table tbody tr").first().should("contain", "Aaron")
    cy.get("button").contains("Name").click()
    cy.get("table tbody tr").first().should("contain", "Zoe")
  })
})

