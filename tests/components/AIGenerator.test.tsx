import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react"
import AIGenerator from "@/components/ai/AIGenerator"
import { generateAIData } from "@/utils/aiDataGeneration"

jest.mock("@/utils/aiDataGeneration")

describe("AIGenerator", () => {
  it("should call generateAIData when the generate button is clicked", async () => {
    const mockGenerateAIData = generateAIData as jest.MockedFunction<typeof generateAIData>
    mockGenerateAIData.mockResolvedValue([{ id: "1", name: "Test", description: "Generated description" }])

    const { getByText, getByPlaceholderText } = render(<AIGenerator />)

    fireEvent.change(getByPlaceholderText("Enter prompt for AI generation..."), { target: { value: "Test prompt" } })
    fireEvent.click(getByText("Generate AI Data"))

    await waitFor(() => {
      expect(mockGenerateAIData).toHaveBeenCalledWith(expect.any(Array), "Test prompt", expect.any(String))
    })
  })
})

