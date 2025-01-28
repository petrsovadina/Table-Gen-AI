import { exportToCSV } from "@/utils/csvExport"

describe("exportToCSV", () => {
  it("should generate correct CSV content", () => {
    const columns = [
      { id: "name", name: "Name" },
      { id: "age", name: "Age" },
    ]
    const data = [
      { id: "1", name: "John Doe", age: 30 },
      { id: "2", name: "Jane Doe", age: 25 },
    ]

    const mockCreateObjectURL = jest.fn()
    global.URL.createObjectURL = mockCreateObjectURL
    global.Blob = jest.fn().mockImplementation((content, options) => ({
      content,
      options,
    }))

    exportToCSV(columns, data)

    expect(mockCreateObjectURL).toHaveBeenCalledWith({
      content: ["Name,Age", '"John Doe","30"', '"Jane Doe","25"'],
      options: { type: "text/csv;charset=utf-8;" },
    })
  })
})

