import { describe, expect, it } from "vitest";
import { formatResult } from "../src/format.js";

describe("formatResult", () => {
  it("renders integer without comma", () => {
    expect(formatResult(4)).toBe("4");
    expect(formatResult(0)).toBe("0");
  });

  it("renders float with comma as decimal separator", () => {
    expect(formatResult(3.5)).toBe("3,5");
    expect(formatResult(1.25)).toBe("1,25");
  });

  it("strips trailing zeros — integer result rendered without comma", () => {
    expect(formatResult(3.0)).toBe("3");
    expect(formatResult(1.5 + 2.5)).toBe("4");
  });

  it("never contains a dot", () => {
    expect(formatResult(3.5)).not.toContain(".");
    expect(formatResult(1.25)).not.toContain(".");
  });
});
