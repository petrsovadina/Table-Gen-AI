import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react"
import CSVImport from "@/components/client/CSVImport"

describe("CSVImport", () => {
  it("should call onImport with correct data when a valid CSV file is imported", async () => {
    const mockOnImport = jest.fn()
    const { getByLabelText } = render(<CSVImport onImport={mockOnImport} />)

    const file = new File(["name,age\nJohn,30\nJane,25"], "test.csv", { type: "text/csv" })
    const input = getByLabelText("Import CSV")

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockOnImport).toHaveBeenCalledWith(
        [
          { id: "name", name: "name" },
          { id: "age", name: "age" },
        ],
        [
          { name: "John", age: "30" },
          { name: "Jane", age: "25" },
        ],
      )
    })
  })
})

