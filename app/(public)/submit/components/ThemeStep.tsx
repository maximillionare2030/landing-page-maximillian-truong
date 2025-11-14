"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { themePresets } from "@/lib/themes";
import type { SiteConfig, ThemeId, LayoutId } from "@/types/site";

interface ThemeStepProps {
  form: UseFormReturn<SiteConfig>;
}

export function ThemeStep({ form }: ThemeStepProps) {
  const theme = form.watch("theme");
  const layout = form.watch("layout");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Theme</Label>
        <p className="text-xs text-muted-foreground mb-4">
          Choose a color theme for your landing page
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(themePresets).map((preset) => (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                theme.id === preset.id
                  ? "ring-2 ring-primary border-primary"
                  : ""
              }`}
              onClick={() => form.setValue("theme.id", preset.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{preset.name}</CardTitle>
                <CardDescription className="text-xs">
                  {preset.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div
                    className="h-8 w-8 rounded border"
                    style={{ backgroundColor: preset.tokens.primary }}
                  />
                  <div
                    className="h-8 w-8 rounded border"
                    style={{ backgroundColor: preset.tokens.accent }}
                  />
                  <div
                    className="h-8 w-8 rounded border"
                    style={{ backgroundColor: preset.tokens.background }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Custom Colors</Label>
          <p className="text-xs text-muted-foreground mb-4">
            Customize individual theme colors. Leave empty to use theme defaults.
          </p>
        </div>

        {/* Primary Color */}
        <div className="space-y-2">
          <Label htmlFor="primary-color" className="text-sm font-medium">
            Primary Color
          </Label>
          <div className="flex gap-2">
            <Input
              id="primary-color"
              type="color"
              value={
                theme.primaryHex ||
                theme.brandHex ||
                themePresets[theme.id].tokens.primary ||
                "#6366f1"
              }
              onChange={(e) => {
                form.setValue("theme.primaryHex", e.target.value);
                // Clear brandHex when using individual colors
                if (theme.brandHex) {
                  form.setValue("theme.brandHex", undefined);
                }
              }}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              placeholder={themePresets[theme.id].tokens.primary}
              value={theme.primaryHex || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                if (value === "") {
                  form.setValue("theme.primaryHex", undefined);
                } else if (/^#?[0-9A-Fa-f]{6}$/.test(value)) {
                  const normalizedValue = value.startsWith("#") ? value : `#${value}`;
                  form.setValue("theme.primaryHex", normalizedValue);
                  if (theme.brandHex) {
                    form.setValue("theme.brandHex", undefined);
                  }
                }
              }}
              className="flex-1"
            />
            {theme.primaryHex && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => form.setValue("theme.primaryHex", undefined)}
                className="text-xs"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="accent-color" className="text-sm font-medium">
              Accent Color
            </Label>
            <p className="text-xs text-muted-foreground">
              Used for highlights, hover effects, section dividers, and interactive elements
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              id="accent-color"
              type="color"
              value={
                theme.accentHex ||
                themePresets[theme.id].tokens.accent ||
                "#8b5cf6"
              }
              onChange={(e) => {
                form.setValue("theme.accentHex", e.target.value);
                if (theme.brandHex) {
                  form.setValue("theme.brandHex", undefined);
                }
              }}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              placeholder={themePresets[theme.id].tokens.accent}
              value={theme.accentHex || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                if (value === "") {
                  form.setValue("theme.accentHex", undefined);
                } else if (/^#?[0-9A-Fa-f]{6}$/.test(value)) {
                  const normalizedValue = value.startsWith("#") ? value : `#${value}`;
                  form.setValue("theme.accentHex", normalizedValue);
                  if (theme.brandHex) {
                    form.setValue("theme.brandHex", undefined);
                  }
                }
              }}
              className="flex-1"
            />
            {theme.accentHex && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => form.setValue("theme.accentHex", undefined)}
                className="text-xs"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label htmlFor="background-color" className="text-sm font-medium">
            Background Color
          </Label>
          <div className="flex gap-2">
            <Input
              id="background-color"
              type="color"
              value={
                theme.backgroundHex ||
                themePresets[theme.id].tokens.background ||
                "#000000"
              }
              onChange={(e) => {
                form.setValue("theme.backgroundHex", e.target.value);
              }}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              placeholder={themePresets[theme.id].tokens.background}
              value={theme.backgroundHex || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                if (value === "") {
                  form.setValue("theme.backgroundHex", undefined);
                } else if (/^#?[0-9A-Fa-f]{6}$/.test(value)) {
                  const normalizedValue = value.startsWith("#") ? value : `#${value}`;
                  form.setValue("theme.backgroundHex", normalizedValue);
                }
              }}
              className="flex-1"
            />
            {theme.backgroundHex && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => form.setValue("theme.backgroundHex", undefined)}
                className="text-xs"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Legacy Brand Color (hidden but kept for backward compatibility) */}
        {theme.brandHex && !theme.primaryHex && !theme.accentHex && (
          <div className="space-y-2 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              Using legacy brand color. Switch to individual colors above for more control.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="layout-select">Layout Style</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Choose how your content is organized
        </p>
        <Select
          value={layout}
          onValueChange={(value) => form.setValue("layout", value as LayoutId)}
        >
          <SelectTrigger id="layout-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">
              <div className="flex flex-col">
                <span className="font-medium">Classic</span>
                <span className="text-xs text-muted-foreground">
                  Traditional sections with generous spacing
                </span>
              </div>
            </SelectItem>
            <SelectItem value="timeline">
              <div className="flex flex-col">
                <span className="font-medium">Timeline</span>
                <span className="text-xs text-muted-foreground">
                  Vertical timeline for experience and portfolio
                </span>
              </div>
            </SelectItem>
            <SelectItem value="compact">
              <div className="flex flex-col">
                <span className="font-medium">Compact</span>
                <span className="text-xs text-muted-foreground">
                  Dense layout with less spacing
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}

