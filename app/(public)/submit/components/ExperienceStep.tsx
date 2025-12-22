"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "./ImageUploader";
import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { SiteConfig } from "@/types/site";

// Helper to check if string is an image URL
function isImageUrl(str: string): boolean {
  return (
    str.startsWith("http://") ||
    str.startsWith("https://") ||
    str.startsWith("data:") ||
    str.startsWith("/")
  );
}

const ROLE_ICONS = [
  { value: "🎓", label: "🎓 Intern/Student" },
  { value: "💻", label: "💻 Engineer/Developer" },
  { value: "🚀", label: "🚀 Lead/Senior" },
  { value: "👔", label: "👔 Manager/Director" },
  { value: "💼", label: "💼 General" },
];

interface ExperienceStepProps {
  form: UseFormReturn<SiteConfig>;
  experienceImages?: Map<number, { file: File; dataUrl: string; alt: string } | undefined>;
  onExperienceImageChange?: (
    index: number,
    value: { file: File; dataUrl: string; alt: string } | undefined
  ) => void;
}

export function ExperienceStep({ form, experienceImages, onExperienceImageChange }: ExperienceStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  // Store raw text for each experience's bullets
  const [bulletsText, setBulletsText] = useState<Record<number, string>>({});

  // Ensure at least one experience entry exists
  useEffect(() => {
    if (fields.length === 0) {
      append({
        role: "",
        company: "",
        start: "",
        end: "",
        bullets: [],
        icon: undefined,
      });
    }
  }, [fields.length, append]);

  // Sync bulletsText with form values on mount/field changes
  useEffect(() => {
    const initialText: Record<number, string> = {};
    fields.forEach((_, index) => {
      const bullets = form.getValues(`experience.${index}.bullets` as any);
      if (Array.isArray(bullets)) {
        initialText[index] = bullets.join("\n");
      } else if (!(index in bulletsText)) {
        initialText[index] = "";
      }
    });
    setBulletsText((prev) => ({ ...prev, ...initialText }));
  }, [fields.length]);

  // Convert text to bullets array
  const processBullets = (text: string): string[] => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  // Update form value when bullets text changes (on blur)
  const handleBulletsBlur = (index: number) => {
    const text = bulletsText[index] || "";
    const bullets = processBullets(text);
    form.setValue(
      `experience.${index}.bullets` as any,
      bullets,
      { shouldValidate: true }
    );
    // Update local state to remove empty lines at the end
    setBulletsText((prev) => ({
      ...prev,
      [index]: bullets.join("\n"),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>
          Work Experience <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Add your work experience with roles, companies, and achievements. At least one experience is required.
        </p>

        <div className="space-y-6">
          {fields.map((field, index) => {
            const roleError = form.formState.errors.experience?.[index]?.role;
            const companyError = form.formState.errors.experience?.[index]?.company;
            const startError = form.formState.errors.experience?.[index]?.start;
            const bulletsError = form.formState.errors.experience?.[index]?.bullets;

            return (
              <div
                key={field.id}
                className="p-6 border rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">Experience #{index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        remove(index);
                        // Clean up local state
                        setBulletsText((prev) => {
                          const updated = { ...prev };
                          delete updated[index];
                          // Re-index remaining entries
                          const reindexed: Record<number, string> = {};
                          Object.keys(updated).forEach((key) => {
                            const idx = Number(key);
                            if (idx > index) {
                              reindexed[idx - 1] = updated[idx];
                            } else if (idx < index) {
                              reindexed[idx] = updated[idx];
                            }
                          });
                          return reindexed;
                        });
                      }}
                      aria-label={`Remove experience ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`role-${index}`}>
                      Role <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`role-${index}`}
                      {...form.register(`experience.${index}.role` as const, {
                        required: "Role is required",
                      })}
                      placeholder="Senior Software Engineer"
                      aria-required="true"
                      aria-invalid={!!roleError}
                    />
                    {roleError && (
                      <p className="text-sm text-destructive">
                        {roleError.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`company-${index}`}>
                      Company <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`company-${index}`}
                      {...form.register(`experience.${index}.company` as const, {
                        required: "Company is required",
                      })}
                      placeholder="Acme Inc."
                      aria-required="true"
                      aria-invalid={!!companyError}
                    />
                    {companyError && (
                      <p className="text-sm text-destructive">
                        {companyError.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`icon-${index}`}>Icon/Logo (Optional)</Label>
                  <Select
                    value={(() => {
                      const currentIcon = form.watch(`experience.${index}.icon`);
                      const hasImage = experienceImages?.get(index);
                      if (hasImage) return "image";
                      if (currentIcon === "none") return "none";
                      if (currentIcon && currentIcon !== "auto") return currentIcon;
                      return "auto";
                    })()}
                    onValueChange={(value) => {
                      if (value === "image") {
                        // Image is handled separately via ImageUploader
                        return;
                      } else if (value === "none") {
                        form.setValue(`experience.${index}.icon` as const, "none");
                        // Clear image if exists
                        if (onExperienceImageChange) {
                          onExperienceImageChange(index, undefined);
                        }
                      } else if (value === "auto") {
                        form.setValue(`experience.${index}.icon` as const, undefined);
                        // Clear image if exists
                        if (onExperienceImageChange) {
                          onExperienceImageChange(index, undefined);
                        }
                      } else {
                        form.setValue(`experience.${index}.icon` as const, value);
                        // Clear image if exists
                        if (onExperienceImageChange) {
                          onExperienceImageChange(index, undefined);
                        }
                      }
                    }}
                  >
                    <SelectTrigger id={`icon-${index}`}>
                      <SelectValue placeholder="Select an icon (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect (Default)</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                      {ROLE_ICONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                      {onExperienceImageChange && (
                        <SelectItem value="image">
                          {experienceImages?.get(index) ? "📷 Custom Image" : "📷 Upload Image"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {/* Image uploader - show when image is selected or when image exists */}
                  {onExperienceImageChange && (
                    <div className="pt-2">
                      <ImageUploader
                        label="Company Logo/Icon (Optional)"
                        value={experienceImages?.get(index)}
                        onChange={(value) => {
                          onExperienceImageChange(index, value);
                          if (value) {
                            form.setValue(`experience.${index}.icon` as any, value.dataUrl, {
                              shouldValidate: true,
                            });
                          } else {
                            // Reset to auto if image is removed
                            const currentIcon = form.watch(`experience.${index}.icon`);
                            if (currentIcon && isImageUrl(currentIcon)) {
                              form.setValue(`experience.${index}.icon` as any, undefined);
                            }
                          }
                        }}
                        required={false}
                        helperText="Upload a company logo or custom icon. Will be automatically sized and cropped to fit."
                      />
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Choose a default icon, upload a custom image/logo, or select "None" to show company initial
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`start-${index}`}>
                      Start Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`start-${index}`}
                      {...form.register(`experience.${index}.start` as const, {
                        required: "Start date is required",
                      })}
                      placeholder="Jan 2020"
                      aria-required="true"
                      aria-invalid={!!startError}
                    />
                    {startError && (
                      <p className="text-sm text-destructive">
                        {startError.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`end-${index}`}>End Date</Label>
                    <Input
                      id={`end-${index}`}
                      {...form.register(`experience.${index}.end` as const)}
                      placeholder="Present or Dec 2023"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`bullets-${index}`}>
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id={`bullets-${index}`}
                    placeholder="Enter each achievement on a new line"
                    rows={4}
                    aria-required="true"
                    aria-invalid={!!bulletsError}
                    value={bulletsText[index] || ""}
                    onChange={(e) => {
                      // Allow free typing with newlines
                      setBulletsText((prev) => ({
                        ...prev,
                        [index]: e.target.value,
                      }));
                    }}
                    onBlur={() => {
                      handleBulletsBlur(index);
                      form.trigger(`experience.${index}.bullets` as any);
                    }}
                  />
                  {bulletsError && (
                    <p className="text-sm text-destructive">
                      {bulletsError.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter each achievement or responsibility on a new line. At least one bullet point is required.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            append({
              role: "",
              company: "",
              start: "",
              end: "",
              bullets: [],
              icon: undefined,
            });
            // Initialize empty text for new field
            const newIndex = fields.length;
            setBulletsText((prev) => ({
              ...prev,
              [newIndex]: "",
            }));
          }}
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>

        {/* Show error if no experiences */}
        {form.formState.errors.experience && typeof form.formState.errors.experience === 'object' && 'message' in form.formState.errors.experience && (
          <p className="text-sm text-destructive mt-2">
            {form.formState.errors.experience.message}
          </p>
        )}
      </div>
    </div>
  );
}

