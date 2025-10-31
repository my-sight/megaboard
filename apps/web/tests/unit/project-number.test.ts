import { describe, expect, it } from "vitest";
import { isValidProjectNumber, parseProjectNumber } from "@/lib/utils/projectNumber";

describe("project number helpers", () => {
  it("validiert Muster", () => {
    expect(isValidProjectNumber("AB-24-123")).toBe(true);
    expect(isValidProjectNumber("Z-01-999-1")).toBe(true);
    expect(isValidProjectNumber("wrong")).toBe(false);
  });

  it("parsed struktur", () => {
    expect(parseProjectNumber("IT-24-120-2")).toEqual({
      department: "IT",
      year: 24,
      sequence: 120,
      variant: 2
    });
  });
});
