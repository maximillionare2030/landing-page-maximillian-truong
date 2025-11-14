"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { siteConfigSchema } from "@/lib/validate";
import { exportSiteConfig } from "@/lib/zip";
import type { SiteConfig } from "@/types/site";
import { StepIndicator } from "./components/StepIndicator";
import { ThemeStep } from "./components/ThemeStep";
import { PersonalInfoStep } from "./components/PersonalInfoStep";
import { AboutStep } from "./components/AboutStep";
import { SkillsStep } from "./components/SkillsStep";
import { ExperienceStep } from "./components/ExperienceStep";
import { PortfolioStep } from "./components/PortfolioStep";
import { ReviewStep } from "./components/ReviewStep";
import { LivePreview } from "./components/LivePreview";
import { ChevronLeft, ChevronRight, Download, Database, Eye, EyeOff, Maximize2 } from "lucide-react";

const STEPS = [
  "Theme & Style",
  "Personal Info",
  "About",
  "Skills",
  "Experience",
  "Portfolio",
  "Review",
];

const STORAGE_KEY = "landing-foundry-draft";

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [aboutImage, setAboutImage] = useState<{
    file: File;
    dataUrl: string;
    alt: string;
  } | undefined>(undefined);
  const [projectImages, setProjectImages] = useState<
    Map<number, { file: File; dataUrl: string; alt: string } | undefined>
  >(new Map());
  const { toast } = useToast();

  const form = useForm<SiteConfig>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: {
      name: "",
      headline: "",
      subheadline: "",
      email: "",
      socials: {},
      theme: {
        id: "noir",
        // darkMode removed - we derive it from background color now
      },
      layout: "classic",
      images: {},
      about: {
        bio: "",
      },
      skills: [],
      experience: [],
      portfolio: [],
    },
  });

  // Load draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        form.reset(draft.config);
        if (draft.aboutImage) {
          // Note: File objects can't be serialized, so we'd need to handle this differently
          // For now, we'll just restore the config
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, [form]);

  // Watch form values for real-time updates
  const formValues = form.watch();

  // Save draft to localStorage
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          config: value,
          timestamp: Date.now(),
        })
      );
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Create preview config by combining form values with image data URLs
  const previewConfig = useMemo<SiteConfig>(() => {
    const config = { ...formValues } as SiteConfig;

    // Add about image data URL if available
    if (aboutImage) {
      config.about = {
        ...config.about,
        image: aboutImage.dataUrl,
        alt: aboutImage.alt,
      };
    } else {
      // Clear image if no about image is uploaded
      config.about = {
        ...config.about,
        image: undefined,
      };
    }

    // Add project image data URLs if available
    if (config.portfolio) {
      config.portfolio = config.portfolio.map((project, index) => {
        const imageData = projectImages.get(index);
        if (imageData) {
          return {
            ...project,
            image: imageData.dataUrl,
            alt: imageData.alt,
          };
        }
        // Remove "uploaded" placeholder and invalid image values
        const imageValue = project.image;
        const isValidImage = imageValue &&
          imageValue !== "uploaded" &&
          imageValue !== "" &&
          (imageValue.startsWith("data:") ||
           imageValue.startsWith("http://") ||
           imageValue.startsWith("https://") ||
           imageValue.startsWith("/"));

        return {
          ...project,
          image: isValidImage ? imageValue : "", // Use empty string instead of undefined to match Project type
        };
      });
    }

    return config;
  }, [formValues, aboutImage, projectImages]);

  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate: (keyof SiteConfig | "about.bio")[][] = [
      [], // Theme step - no required fields
      ["name", "headline"],
      ["about.bio" as any],
      ["skills"],
      ["experience"],
      ["portfolio"],
      [],
    ];

    if (step < fieldsToValidate.length) {
      // For portfolio step, filter out incomplete links before validation
      if (step === 5) {
        const portfolio = form.getValues("portfolio");
        portfolio.forEach((project, index) => {
          if (project.links && project.links.length > 0) {
            const completeLinks = project.links.filter(
              (link) => link.label?.trim() && link.url?.trim()
            );
            if (completeLinks.length !== project.links.length) {
              form.setValue(`portfolio.${index}.links` as any, completeLinks);
            }
          }
        });
      }

      const fields = fieldsToValidate[step];
      const result = await form.trigger(fields as any);
      return result;
    }

    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateImages = (): boolean => {
    const missingAltTexts: string[] = [];

    // Validate about image has alt text
    if (aboutImage && aboutImage.file) {
      const altText = aboutImage.alt?.trim();
      if (!altText || altText.length === 0) {
        missingAltTexts.push("About image");
      }
    }

    // Validate project images have alt text
    for (const [index, image] of projectImages.entries()) {
      if (image && image.file) {
        const altText = image.alt?.trim();
        if (!altText || altText.length === 0) {
          const project = form.getValues().portfolio[index];
          const projectTitle = project?.title || `Project ${index + 1}`;
          missingAltTexts.push(`${projectTitle} image`);
        }
      }
    }

    // Show error if any alt texts are missing
    if (missingAltTexts.length > 0) {
      const imageList = missingAltTexts.length === 1
        ? missingAltTexts[0]
        : missingAltTexts.length === 2
        ? missingAltTexts.join(" and ")
        : `${missingAltTexts.slice(0, -1).join(", ")}, and ${missingAltTexts[missingAltTexts.length - 1]}`;

      toast({
        title: "Missing Alt Text",
        description: `Please provide alt text for the following image${missingAltTexts.length > 1 ? "s" : ""}: ${imageList}. Alt text is required for accessibility.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveToDatabase = async () => {
    console.log("🔄 Save to Database clicked");
    try {
      // Validate form first
      console.log("📋 Validating form...");
      const isValid = await form.trigger();
      console.log("✅ Form validation result:", isValid);

      if (!isValid) {
        const errors = form.formState.errors;
        console.error("❌ Form validation errors:", errors);

        // Better error message extraction
        const errorMessages: string[] = [];
        const extractErrors = (obj: any, path = ""): void => {
          Object.keys(obj).forEach((key) => {
            const value = obj[key];
            const currentPath = path ? `${path}.${key}` : key;

            if (value?.message) {
              errorMessages.push(`${currentPath}: ${value.message}`);
            } else if (value && typeof value === "object") {
              if (Array.isArray(value)) {
                value.forEach((item, index) => {
                  if (item && typeof item === "object") {
                    extractErrors(item, `${currentPath}[${index}]`);
                  }
                });
              } else {
                extractErrors(value, currentPath);
              }
            }
          });
        };

        extractErrors(errors);

        toast({
          title: "Validation Error",
          description: errorMessages.length > 0
            ? `Please fix: ${errorMessages.slice(0, 3).join("; ")}${errorMessages.length > 3 ? ` (and ${errorMessages.length - 3} more)` : ""}`
            : "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Validate images have alt text
      if (!validateImages()) {
        return;
      }

      setIsExporting(true);

      // Get form values without mutating
      const formValues = form.getValues();

      // Clean up config - remove image placeholders and darkMode before sending
      const cleanedConfig: SiteConfig = {
        ...formValues,
        theme: {
          ...formValues.theme,
          // Remove darkMode if it exists (we removed it from UI)
          darkMode: undefined,
        },
        about: {
          ...formValues.about,
          // Clear image if it's just a placeholder (will be sent as File separately)
          image: aboutImage
            ? undefined
            : (formValues.about.image && formValues.about.image !== "uploaded"
                ? formValues.about.image
                : undefined),
        },
        portfolio: formValues.portfolio.map((project, index) => {
          const imageData = projectImages.get(index);
          // Clear image if it's just a placeholder (will be sent as File separately)
          return {
            ...project,
            image: imageData
              ? ""
              : (project.image && project.image !== "uploaded" && project.image !== ""
                  ? project.image
                  : ""),
          };
        }),
      };

      // Remove darkMode from the cleaned config if it's undefined
      if (cleanedConfig.theme.darkMode === undefined) {
        const { darkMode, ...themeWithoutDarkMode } = cleanedConfig.theme;
        cleanedConfig.theme = themeWithoutDarkMode as typeof cleanedConfig.theme;
      }

      // Prepare FormData for API
      const formData = new FormData();
      formData.append("config", JSON.stringify(cleanedConfig, null, 2));

      // Add about image if present
      if (aboutImage && aboutImage.file) {
        formData.append("aboutImage", aboutImage.file);
        formData.append("aboutImageAlt", aboutImage.alt || "");
      }

      // Add project images
      for (const [index, image] of projectImages.entries()) {
        if (image && image.file) {
          formData.append(`projectImage-${index}`, image.file);
          formData.append(`projectImageAlt-${index}`, image.alt || "");
        }
      }

      // Save to database
      console.log("📤 Sending request to /api/submissions/save...");
      const response = await fetch("/api/submissions/save", {
        method: "POST",
        body: formData,
      });

      console.log("📥 Response status:", response.status, response.statusText);
      const result = await response.json();
      console.log("📥 Response data:", result);

      if (!response.ok) {
        const errorDetails = result.details || result.error || "Unknown error";
        console.error("❌ Save failed:", errorDetails);
        throw new Error(
          result.error === "Database connection failed"
            ? "Cannot connect to database. Please check your database configuration (see FIX_DATABASE_CONNECTION.md)."
            : typeof errorDetails === "string"
            ? errorDetails
            : JSON.stringify(errorDetails)
        );
      }

      console.log("✅ Save successful! Submission ID:", result.submissionId);

      toast({
        title: "Saved Successfully",
        description: `Your submission has been saved with ID: ${result.submissionId}`,
      });

      // Clear draft
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Save error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Save Failed",
        description: `Failed to save: ${errorMessage}. Please check the console for details.`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = async () => {
    console.log("📦 Export ZIP clicked");
    try {
      // Validate form first
      console.log("📋 Validating form...");
      const isValid = await form.trigger();
      console.log("✅ Form validation result:", isValid);

      if (!isValid) {
        const errors = form.formState.errors;
        console.error("❌ Form validation errors:", errors);

        // Better error message extraction
        const errorMessages: string[] = [];
        const extractErrors = (obj: any, path = ""): void => {
          Object.keys(obj).forEach((key) => {
            const value = obj[key];
            const currentPath = path ? `${path}.${key}` : key;

            if (value?.message) {
              errorMessages.push(`${currentPath}: ${value.message}`);
            } else if (value && typeof value === "object") {
              if (Array.isArray(value)) {
                value.forEach((item, index) => {
                  if (item && typeof item === "object") {
                    extractErrors(item, `${currentPath}[${index}]`);
                  }
                });
              } else {
                extractErrors(value, currentPath);
              }
            }
          });
        };

        extractErrors(errors);

        toast({
          title: "Validation Error",
          description: errorMessages.length > 0
            ? `Please fix: ${errorMessages.slice(0, 3).join("; ")}${errorMessages.length > 3 ? ` (and ${errorMessages.length - 3} more)` : ""}`
            : "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Validate images have alt text
      console.log("🖼️ Validating images...");
      if (!validateImages()) {
        console.log("❌ Image validation failed");
        return;
      }
      console.log("✅ Image validation passed");

      setIsExporting(true);
      console.log("📦 Starting export process...");

      // Get form values without mutating
      const formValues = form.getValues();

      // Create a clean copy of config for export (don't mutate original)
      const exportConfig: SiteConfig = {
        ...formValues,
        about: {
          ...formValues.about,
        },
        portfolio: formValues.portfolio.map(project => ({ ...project })),
      };

      // Prepare assets map
      const assets = new Map<string, Blob>();
      const timestamp = Date.now();

      // Add about image if present
      if (aboutImage && aboutImage.file) {
        const extension = aboutImage.file.name.split(".").pop() || "jpg";
        const filename = `about-${timestamp}.${extension}`;
        assets.set(filename, aboutImage.file);
        exportConfig.about.image = `assets/${filename}`;
        exportConfig.about.alt = aboutImage.alt || "";
      }

      // Add project images
      for (const [index, image] of projectImages.entries()) {
        if (image && image.file) {
          const extension = image.file.name.split(".").pop() || "jpg";
          const filename = `project-${index}-${timestamp}.${extension}`;
          assets.set(filename, image.file);
          if (exportConfig.portfolio[index]) {
            exportConfig.portfolio[index].image = `assets/${filename}`;
            exportConfig.portfolio[index].alt = image.alt || "";
          }
        }
      }

      // Clean up config - remove darkMode if it exists (we removed it from UI)
      if (exportConfig.theme.darkMode !== undefined) {
        delete exportConfig.theme.darkMode;
      }

      // Export ZIP
      console.log("📦 Calling exportSiteConfig...");
      await exportSiteConfig(exportConfig, assets);
      console.log("✅ Export completed successfully");

      toast({
        title: "Export Successful",
        description: "Your landing page bundle has been downloaded!",
      });

      // Clear draft
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Export error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Export Failed",
        description: `Failed to export: ${errorMessage}. Please check the console for details.`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleOpenPreviewInNewTab = () => {
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview - ${previewConfig.name || "Landing Page"}</title>
            <style>
              body { margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            <div id="preview-root"></div>
          </body>
        </html>
      `);
      // Note: This is a simplified version. In production, you'd render React
      // This would require setting up a full React render in the new window
      previewWindow.document.body.innerHTML = "<p>Full preview in new tab coming soon. Use the side-by-side preview instead.</p>";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with toggle */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Create Your Landing Page</h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Preview
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!showPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="md:hidden"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show Preview
              </Button>
            )}
            {showPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="md:hidden"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Preview
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="hidden md:flex"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>
            {showPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenPreviewInNewTab}
                className="hidden md:flex"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Split view layout */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Form side */}
        <div
          className={`${
            showPreview ? "hidden md:block md:w-1/2" : "w-full md:w-1/2"
          } overflow-y-auto md:border-r bg-background`}
        >
          <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Card>
          <CardHeader>
            <StepIndicator
              currentStep={currentStep + 1}
              totalSteps={STEPS.length}
              stepLabels={STEPS}
            />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
              {currentStep === 0 && <ThemeStep form={form} />}
              {currentStep === 1 && <PersonalInfoStep form={form} />}
              {currentStep === 2 && (
                <AboutStep
                  form={form}
                  aboutImage={aboutImage}
                  onAboutImageChange={setAboutImage}
                />
              )}
              {currentStep === 3 && <SkillsStep form={form} />}
              {currentStep === 4 && <ExperienceStep form={form} />}
              {currentStep === 5 && (
                <PortfolioStep
                  form={form}
                  projectImages={projectImages}
                  onProjectImageChange={(index, value) => {
                    const newMap = new Map(projectImages);
                    if (value !== undefined && value !== null) {
                      newMap.set(index, value);
                    } else {
                      newMap.delete(index);
                    }
                    setProjectImages(newMap);
                  }}
                />
              )}
              {currentStep === 6 && <ReviewStep form={form} />}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="focus-visible-ring"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="focus-visible-ring"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleSaveToDatabase}
                      disabled={isExporting}
                      variant="default"
                      className="focus-visible-ring"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      {isExporting ? "Saving..." : "Save to Database"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleExport}
                      disabled={isExporting}
                      variant="outline"
                      className="focus-visible-ring"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export ZIP
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
          </div>
        </div>

        {/* Preview side */}
        {showPreview && (
          <div className="hidden md:block md:w-1/2 overflow-y-auto bg-background">
            <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Live Preview</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Live
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="min-h-full">
              <LivePreview config={previewConfig} />
            </div>
          </div>
        )}

      </div>

      {/* Mobile preview - show below form */}
      {showPreview && (
        <div className="md:hidden w-full border-t bg-background h-[60vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Live Preview</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  Live
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LivePreview config={previewConfig} />
          </div>
        </div>
      )}
    </div>
  );
}

