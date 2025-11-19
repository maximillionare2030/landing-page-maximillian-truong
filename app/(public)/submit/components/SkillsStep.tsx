"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "./ImageUploader";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SiteConfig } from "@/types/site";

interface SkillsStepProps {
  form: UseFormReturn<SiteConfig>;
  skillImages?: Map<number, { file: File; dataUrl: string; alt: string } | undefined>;
  onSkillImageChange?: (
    index: number,
    value: { file: File; dataUrl: string; alt: string } | undefined
  ) => void;
}

export function SkillsStep({ form, skillImages, onSkillImageChange }: SkillsStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  return (
    <div className="space-y-6">
      <div>
        <Label>
          Skills <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Add your skills and proficiency levels. You can optionally add an icon/image for each skill.
        </p>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border rounded-lg space-y-4"
            >
              <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    {...form.register(`skills.${index}.name` as const, {
                      required: "Skill name is required",
                    })}
                    placeholder="e.g., JavaScript, React, Python"
                    aria-label={`Skill ${index + 1} name`}
                  />
                  <Select
                    value={form.watch(`skills.${index}.level`) || ""}
                    onValueChange={(value) =>
                      form.setValue(
                        `skills.${index}.level` as const,
                        value as "beginner" | "intermediate" | "advanced"
                      )
                    }
                  >
                    <SelectTrigger aria-label={`Skill ${index + 1} level`}>
                      <SelectValue placeholder="Select level (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    remove(index);
                    if (onSkillImageChange) {
                      onSkillImageChange(index, undefined);
                    }
                  }}
                  aria-label={`Remove skill ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Optional image upload */}
              {onSkillImageChange && (
                <div className="pt-2 border-t">
                  <ImageUploader
                    label="Skill Icon/Image (Optional)"
                    value={skillImages?.get(index)}
                    onChange={(value) => {
                      onSkillImageChange(index, value);
                      if (value) {
                        form.setValue(`skills.${index}.image` as any, "uploaded", {
                          shouldValidate: true,
                        });
                      } else {
                        form.setValue(`skills.${index}.image` as any, undefined, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    required={false}
                    helperText="Optional: Upload an icon or logo for this skill"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "", level: undefined, image: undefined })}
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>
    </div>
  );
}

