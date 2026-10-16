import { describe, it, expect } from "vitest";
import { scoreBand } from "./score";
import { cases } from "./mock-data";
describe("scoreBand", () => {
  it("80+ is High", () => expect(scoreBand(80)).toBe("High"));
  it("60-79 is Medium", () => { expect(scoreBand(60)).toBe("Medium"); expect(scoreBand(79)).toBe("Medium"); });
  it("<60 is Low", () => expect(scoreBand(59)).toBe("Low"));
  it("fixed scores", () => {
    const s = Object.fromEntries(cases.map((c) => [c.firstName, c.recoverability]));
    expect(s).toMatchObject({ Rahul: 90, Priya: 84, Neha: 71, Vikram: 63 });
  });
});
import { rankScore } from "./score";
describe("rankScore", () => {
  it("orders Rahul, Priya, Vikram, Neha", () => {
    const order = [...cases].sort((a, b) => rankScore(b) - rankScore(a)).map((c) => c.firstName);
    expect(order).toEqual(["Rahul", "Priya", "Vikram", "Neha"]);
  });
  it("uses amount × score/100 × urgency", () => expect(rankScore({ amount: 7500, recoverability: 90, urgencyWeight: 2 })).toBe(13500));
});
