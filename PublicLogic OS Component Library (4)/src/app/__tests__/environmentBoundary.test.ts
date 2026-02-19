import { describe, expect, it } from "vitest";
import { ENVIRONMENTS } from "../environments";

describe("Environment Boundary Enforcement", () => {
  it("only supports PublicLogic and Phillipston", () => {
    const ids = ENVIRONMENTS.map((environment) => environment.id).sort();
    expect(ids).toEqual(["phillipston", "publiclogic"]);
  });
});
