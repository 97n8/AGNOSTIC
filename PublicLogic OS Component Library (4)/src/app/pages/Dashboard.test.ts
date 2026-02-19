import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function allTsxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...allTsxFiles(next));
    } else if (entry.isFile() && next.endsWith(".tsx")) {
      files.push(next);
    }
  }
  return files;
}

describe("iframe hardening", () => {
  it("fails if any iframe is missing sandbox", () => {
    const files = allTsxFiles(path.resolve(process.cwd(), "src"));
    const violations: string[] = [];

    for (const file of files) {
      const source = fs.readFileSync(file, "utf8");
      const iframeBlocks = source.match(/<iframe[\s\S]*?>/g) ?? [];
      for (const block of iframeBlocks) {
        if (!/sandbox=/.test(block)) {
          violations.push(file);
          break;
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("dashboard does not hardcode fake environment metrics", () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), "src", "app", "pages", "Dashboard.tsx"), "utf8");
    expect(source).not.toMatch(/font-mono">24</);
    expect(source).not.toMatch(/font-mono">14</);
    expect(source).not.toContain("42TB");
    expect(source).not.toContain("Software verified");
    expect(source).not.toContain("Power Automate");
    expect(source).not.toContain("Current Tenant");
  });
});
