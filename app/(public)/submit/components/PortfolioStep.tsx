"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import { Plus, X, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { SiteConfig } from "@/types/site";

interface PortfolioStepProps {
  form: UseFormReturn<SiteConfig>;
  projectImages: Map<number, { file: File; dataUrl: string; alt: string } | undefined>;
  onProjectImageChange: (
    index: number,
    value: { file: File; dataUrl: string; alt: string } | undefined
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

  // Store raw text for each project's tags
  const [tagsText, setTagsText] = useState<Record<number, string>>({});

  // Ensure at least one project exists
  useEffect(() => {
    if (fields.length === 0) {
      append({
        title: "",
        description: "",
        image: "",
        alt: "",
        tags: [],
        links: [],
      });
    }
  }, [fields.length, append]);

  // Sync tagsText with form values on mount/field changes
  useEffect(() => {
    const initialText: Record<number, string> = {};
    fields.forEach((_, index) => {
      const tags = form.getValues(`portfolio.${index}.tags` as any);
      if (Array.isArray(tags) && !(index in tagsText)) {
        initialText[index] = tags.join(", ");
      } else if (!(index in tagsText)) {
        initialText[index] = "";
      }
    });
    setTagsText((prev) => ({ ...prev, ...initialText }));
  }, [fields.length]);

  // Convert text to tags array
  const processTags = (text: string): string[] => {
    return text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  // Update form value when tags text changes (on blur)
  const handleTagsBlur = (index: number) => {
    const text = tagsText[index] || "";
    const tags = processTags(text);
    form.setValue(
      `portfolio.${index}.tags` as any,
      tags,
      { shouldValidate: false }
    );
    // Update local state to clean up
    setTagsText((prev) => ({
      ...prev,
      [index]: tags.join(", "),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>
          Portfolio Projects <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Showcase your best work with images, descriptions, and links. At least one project is required.
        </p>

        <div className="space-y-6">
          {fields.map((field, index) => {
            const titleError = form.formState.errors.portfolio?.[index]?.title;
            const descriptionError = form.formState.errors.portfolio?.[index]?.description;
            const imageError = form.formState.errors.portfolio?.[index]?.image;

            return (
              <div
                key={field.id}
                className="p-6 border rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">Project #{index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        remove(index);
                        projectImages.delete(index);
                        // Clean up local state
                        setTagsText((prev) => {
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
                      aria-label={`Remove project ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
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
                    aria-invalid={!!titleError}
                  />
                  {titleError && (
                    <p className="text-sm text-destructive">
                      {titleError.message}
                    </p>
                  )}
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
                    aria-invalid={!!descriptionError}
                  />
                  {descriptionError && (
                    <p className="text-sm text-destructive">
                      {descriptionError.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">

                  <ImageUploader
                    label="Project Image"
                    value={projectImages.get(index) || undefined}
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
                  {imageError && (
                    <p className="text-sm text-destructive">
                      {imageError.message || "Project image is required"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`project-tags-${index}`}>Tags</Label>
                  <Input
                    id={`project-tags-${index}`}
                    placeholder="React, TypeScript, Next.js (comma-separated)"
                    value={tagsText[index] || ""}
                    onChange={(e) => {
                      // Allow free typing with commas
                      setTagsText((prev) => ({
                        ...prev,
                        [index]: e.target.value,
                      }));
                    }}
                    onBlur={() => {
                      handleTagsBlur(index);
                    }}
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
                            value={link.label || ""}
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
                            value={link.url || ""}
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
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            append({
              title: "",
              description: "",
              image: "",
              alt: "",
              tags: [],
              links: [],
            });
            // Initialize empty text for new field
            const newIndex = fields.length;
            setTagsText((prev) => ({
              ...prev,
              [newIndex]: "",
            }));
          }}
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>

        {/* Show error if no projects */}
        {form.formState.errors.portfolio && typeof form.formState.errors.portfolio === 'object' && 'message' in form.formState.errors.portfolio && (
          <p className="text-sm text-destructive mt-2">
            {form.formState.errors.portfolio.message}
          </p>
        )}
      </div>
    </div>
  );
}

