"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import type { SiteConfig } from "@/types/site";

interface ExperienceStepProps {
  form: UseFormReturn<SiteConfig>;
}

export function ExperienceStep({ form }: ExperienceStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  return (
    <div className="space-y-6">
      <div>
        <Label>
          Work Experience <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Add your work experience with roles, companies, and achievements
        </p>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-6 border rounded-lg space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">Experience #{index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label={`Remove experience ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
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
                  />
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
                  />
                </div>
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
                  />
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
                  Achievements <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`bullets-${index}`}
                  {...form.register(`experience.${index}.bullets` as any)}
                  placeholder="Enter each achievement on a new line"
                  rows={4}
                  onChange={(e) => {
                    const bullets = e.target.value
                      .split("\n")
                      .filter((line) => line.trim());
                    form.setValue(
                      `experience.${index}.bullets` as any,
                      bullets
                    );
                  }}
                  value={(() => {
                    const bullets = form.watch(`experience.${index}.bullets` as any);
                    return Array.isArray(bullets) ? bullets.join("\n") : "";
                  })()}
                />
                <p className="text-xs text-muted-foreground">
                  Enter each achievement or responsibility on a new line
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              role: "",
              company: "",
              start: "",
              end: "",
              bullets: [],
            })
          }
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>
    </div>
  );
}

