"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "./ImageUploader";
import { Textarea } from "@/components/ui/textarea";
import type { SiteConfig } from "@/types/site";

interface AboutStepProps {
  form: UseFormReturn<SiteConfig>;
  aboutImage: { file: File; dataUrl: string; alt: string } | undefined;
  onAboutImageChange: (
    value: { file: File; dataUrl: string; alt: string } | undefined
  ) => void;
}

export function AboutStep({
  form,
  aboutImage,
  onAboutImageChange,
}: AboutStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bio">
          Bio <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="bio"
          {...form.register("about.bio", { required: "Bio is required" })}
          placeholder="Tell us about yourself, your background, and what you're passionate about..."
          rows={6}
          aria-required="true"
        />
        {form.formState.errors.about?.bio && (
          <p className="text-sm text-destructive">
            {form.formState.errors.about.bio.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Write a compelling bio that tells your story
        </p>
      </div>

      <ImageUploader
        label="About Image"
        value={aboutImage}
        onChange={onAboutImageChange}
        required={!!aboutImage?.file}
        helperText={aboutImage?.file ? "Please provide alt text for accessibility" : "Optional: A photo of yourself or something that represents you"}
      />
    </div>
  );
}

