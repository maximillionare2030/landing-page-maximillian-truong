"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteConfig } from "@/types/site";

interface PersonalInfoStepProps {
  form: UseFormReturn<SiteConfig>;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          {...form.register("name", { required: "Name is required" })}
          placeholder="Jane Doe"
          aria-required="true"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">
          Headline <span className="text-destructive">*</span>
        </Label>
        <Input
          id="headline"
          {...form.register("headline", { required: "Headline is required" })}
          placeholder="Senior Software Engineer"
          aria-required="true"
        />
        {form.formState.errors.headline && (
          <p className="text-sm text-destructive">
            {form.formState.errors.headline.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          A short, compelling tagline that describes who you are
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subheadline">Subheadline</Label>
        <Input
          id="subheadline"
          {...form.register("subheadline")}
          placeholder="Building amazing products with code"
        />
        <p className="text-xs text-muted-foreground">
          Optional: A longer description or subtitle
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="jane@example.com"
        />
        <p className="text-xs text-muted-foreground">
          Optional: Your contact email address
        </p>
      </div>
    </div>
  );
}

