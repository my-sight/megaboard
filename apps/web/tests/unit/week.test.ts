import { describe, expect, it } from "vitest";
import { isoWeek } from "@/lib/utils/week";

describe("isoWeek", () => {
  it("berechnet ISO-8601 Kalenderwochen korrekt", () => {
    expect(isoWeek(new Date("2024-01-01"))).toEqual({ year: 2023, week: 52 });
    expect(isoWeek(new Date("2024-05-01"))).toEqual({ year: 2024, week: 18 });
  });
});
