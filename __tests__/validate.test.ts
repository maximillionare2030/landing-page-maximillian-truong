import { validateSiteConfig } from "@/lib/validate";
import type { SiteConfig } from "@/types/site";

describe("Config Validation", () => {
  const validConfig: SiteConfig = {
    name: "Jane Doe",
    headline: "Software Engineer",
    theme: { id: "noir", darkMode: true },
    layout: "classic",
    about: { bio: "A passionate developer" },
    skills: [{ name: "JavaScript" }],
    experience: [
      {
        role: "Engineer",
        company: "Tech Corp",
        start: "2020",
        bullets: ["Built amazing things"],
      },
    ],
    portfolio: [
      {
        title: "Project",
        description: "A cool project",
        image: "/image.jpg",
      },
    ],
  };

  it("should validate a correct config", () => {
    const result = validateSiteConfig(validConfig);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("should reject config with missing required fields", () => {
    const invalid = { ...validConfig, name: "" };
    const result = validateSiteConfig(invalid);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it("should reject config with invalid theme", () => {
    const invalid = { ...validConfig, theme: { id: "invalid" as any } };
    const result = validateSiteConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject config with invalid layout", () => {
    const invalid = { ...validConfig, layout: "invalid" as any };
    const result = validateSiteConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject config with empty skills array", () => {
    const invalid = { ...validConfig, skills: [] };
    const result = validateSiteConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject config with invalid email", () => {
    const invalid = { ...validConfig, email: "not-an-email" };
    const result = validateSiteConfig(invalid);
    expect(result.success).toBe(false);
  });
});

