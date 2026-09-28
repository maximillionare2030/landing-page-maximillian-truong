/**
 * @jest-environment node
 */
import { existsSync } from "fs";
import { join } from "path";
import { profile } from "@/content/profile";

const uploads = (p: string) => join(process.cwd(), "public", p);

describe("profile content", () => {
  it("has core identity fields", () => {
    expect(profile.name).toBe("Max Truong");
    expect(profile.tagline.length).toBeGreaterThan(10);
    expect(profile.bio).toHaveLength(2);
  });

  it("has the four required links", () => {
    const labels = profile.links.map((l) => l.label);
    expect(labels).toEqual(["Email", "GitHub", "LinkedIn", "Portfolio generator"]);
    expect(profile.links[0].href).toBe("mailto:maxtrinh4@gmail.com");
    expect(profile.links[1].href).toBe("https://github.com/maximillionare2030");
    expect(profile.links[3].href).toBe("/submit");
  });

  it("has 12 skills with existing images", () => {
    expect(profile.skills).toHaveLength(12);
    for (const s of profile.skills) {
      expect(s.image).toMatch(/^\/uploads\/skill-\d+-1766646169991\./);
      expect(existsSync(uploads(s.image))).toBe(true);
    }
  });

  it("has 9 roles, newest first, with the three new companies first", () => {
    expect(profile.experience).toHaveLength(9);
    expect(profile.experience.slice(0, 3).map((r) => r.company)).toEqual([
      "Palantir",
      "Amazon",
      "Visa",
    ]);
    for (const r of profile.experience) {
      expect(r.role.length).toBeGreaterThan(0);
      expect(r.bullets.length).toBeGreaterThan(0);
      if (r.logo) expect(existsSync(uploads(r.logo))).toBe(true);
    }
  });

  it("has 4 projects with existing images and at least one link each", () => {
    expect(profile.projects).toHaveLength(4);
    for (const p of profile.projects) {
      expect(existsSync(uploads(p.image))).toBe(true);
      expect(p.links.length).toBeGreaterThan(0);
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it("about photo exists", () => {
    expect(existsSync(uploads(profile.aboutImage.src))).toBe(true);
  });
});
