import React from "react"
import { render, screen } from "@testing-library/react"
import DataTable from "@/components/client/DataTable"

describe("DataTable", () => {
  const mockColumns = [
    { id: "name", name: "Name" },
    { id: "age", name: "Age" },
  ]
  const mockData = [
    { id: "1", name: "John Doe", age: "30" },
    { id: "2", name: "Jane Doe", age: "25" },
  ]

  it("renders the correct number of rows and columns", () => {
    render(<DataTable columns={mockColumns} data={mockData} onCellEdit={() => {}} />)

    expect(screen.getAllByRole("row")).toHaveLength(3) // Header + 2 data rows
    expect(screen.getAllByRole("columnheader")).toHaveLength(2)
    expect(screen.getAllByRole("cell")).toHaveLength(4)
  })

  it("displays the correct data in cells", () => {
    render(<DataTable columns={mockColumns} data={mockData} onCellEdit={() => {}} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("30")).toBeInTheDocument()
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    expect(screen.getByText("25")).toBeInTheDocument()
  })
})

