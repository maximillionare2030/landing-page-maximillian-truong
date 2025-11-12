"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import { Plus, X, Link as LinkIcon } from "lucide-react";
import type { SiteConfig } from "@/types/site";

interface PortfolioStepProps {
  form: UseFormReturn<SiteConfig>;
  projectImages: Map<number, { file: File; dataUrl: string; alt: string } | null>;
  onProjectImageChange: (
    index: number,
    value: { file: File; dataUrl: string; alt: string } | null
  ) => void;
}

export function PortfolioStep({
  form,
  projectImages,
  onProjectImageChange,
}: PortfolioStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "portfolio",
  });

  return (
    <div className="space-y-6">
      <div>
        <Label>
          Portfolio Projects <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Showcase your best work with images, descriptions, and links
        </p>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-6 border rounded-lg space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">Project #{index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    remove(index);
                    projectImages.delete(index);
                  }}
                  aria-label={`Remove project ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-title-${index}`}>
                  Project Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`project-title-${index}`}
                  {...form.register(`portfolio.${index}.title` as const, {
                    required: "Project title is required",
                  })}
                  placeholder="Amazing Web App"
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-desc-${index}`}>
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`project-desc-${index}`}
                  {...form.register(`portfolio.${index}.description` as const, {
                    required: "Description is required",
                  })}
                  placeholder="A brief description of what this project does and why it's special..."
                  rows={3}
                  aria-required="true"
                />
              </div>

              <ImageUploader
                label="Project Image"
                value={projectImages.get(index) || null}
                onChange={(value) => {
                  onProjectImageChange(index, value);
                  // Update form field for validation
                  if (value) {
                    form.setValue(`portfolio.${index}.image` as any, "uploaded", {
                      shouldValidate: true,
                    });
                  } else {
                    form.setValue(`portfolio.${index}.image` as any, "", {
                      shouldValidate: true,
                    });
                  }
                }}
                required
              />

              <div className="space-y-2">
                <Label htmlFor={`project-tags-${index}`}>Tags</Label>
                <Input
                  id={`project-tags-${index}`}
                  {...form.register(`portfolio.${index}.tags` as any)}
                  placeholder="React, TypeScript, Next.js (comma-separated)"
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag);
                    form.setValue(`portfolio.${index}.tags` as any, tags);
                  }}
                  value={(() => {
                    const tags = form.watch(`portfolio.${index}.tags` as any);
                    return Array.isArray(tags) ? tags.join(", ") : "";
                  })()}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Comma-separated tags for this project
                </p>
              </div>

              <div className="space-y-2">
                <Label>Project Links</Label>
                <div className="space-y-2">
                  {form.watch(`portfolio.${index}.links` as any)?.map(
                    (link: any, linkIndex: number) => (
                      <div key={linkIndex} className="flex gap-2">
                        <Input
                          placeholder="Link label"
                          value={link.label}
                          onChange={(e) => {
                            const links = form.watch(
                              `portfolio.${index}.links` as any
                            ) || [];
                            links[linkIndex] = {
                              ...links[linkIndex],
                              label: e.target.value,
                            };
                            form.setValue(
                              `portfolio.${index}.links` as any,
                              links
                            );
                          }}
                        />
                        <Input
                          placeholder="https://example.com"
                          value={link.url}
                          onChange={(e) => {
                            const links = form.watch(
                              `portfolio.${index}.links` as any
                            ) || [];
                            links[linkIndex] = {
                              ...links[linkIndex],
                              url: e.target.value,
                            };
                            form.setValue(
                              `portfolio.${index}.links` as any,
                              links
                            );
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const links = form.watch(
                              `portfolio.${index}.links` as any
                            ) || [];
                            links.splice(linkIndex, 1);
                            form.setValue(
                              `portfolio.${index}.links` as any,
                              links
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  ) || []}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const links = form.watch(
                        `portfolio.${index}.links` as any
                      ) || [];
                      form.setValue(`portfolio.${index}.links` as any, [
                        ...links,
                        { label: "", url: "" },
                      ]);
                    }}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              title: "",
              description: "",
              image: "",
              alt: "",
              tags: [],
              links: [],
            })
          }
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>
    </div>
  );
}

