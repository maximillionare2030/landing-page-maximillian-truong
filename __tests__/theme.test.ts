import { meetsAAContrast, getThemeTokens } from "@/lib/themes";

describe("Theme System", () => {
  describe("WCAG AA Contrast", () => {
    it("should pass AA contrast for normal text (4.5:1)", () => {
      const passes = meetsAAContrast("#000000", "#ffffff", false);
      expect(passes).toBe(true);
    });

    it("should fail AA contrast for low contrast colors", () => {
      const passes = meetsAAContrast("#cccccc", "#ffffff", false);
      expect(passes).toBe(false);
    });

    it("should pass AA contrast for large text (3:1)", () => {
      const passes = meetsAAContrast("#666666", "#ffffff", true);
      expect(passes).toBe(true);
    });
  });

  describe("Theme Token Generation", () => {
    it("should generate tokens for noir theme", () => {
      const tokens = getThemeTokens("noir");
      expect(tokens).toHaveProperty("background");
      expect(tokens).toHaveProperty("foreground");
      expect(tokens).toHaveProperty("primary");
    });

    it("should generate tokens from brand color", () => {
      const tokens = getThemeTokens("noir", "#3b82f6", true);
      expect(tokens.primary).toBe("#3b82f6");
    });

    it("should enforce contrast in generated tokens", () => {
      const tokens = getThemeTokens("noir", "#000000", true);
      const contrast = meetsAAContrast(
        tokens.primaryForeground,
        tokens.primary,
        false
      );
      expect(contrast).toBe(true);
    });
  });
});

