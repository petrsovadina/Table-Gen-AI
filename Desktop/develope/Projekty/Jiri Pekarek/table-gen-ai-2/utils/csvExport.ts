export function exportToCSV(columns: { id: string; name: string }[], data: Record<string, any>[]) {
  const headers = columns.map((column) => column.name).join(",")
  const rows = data.map((row) => columns.map((column) => `"${row[column.id] || ""}"`).join(","))
  const csv = [headers, ...rows].join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

