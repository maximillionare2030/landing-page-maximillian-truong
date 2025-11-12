"use client";

import { useState, useEffect } from "react";
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
import { PersonalInfoStep } from "./components/PersonalInfoStep";
import { AboutStep } from "./components/AboutStep";
import { SkillsStep } from "./components/SkillsStep";
import { ExperienceStep } from "./components/ExperienceStep";
import { PortfolioStep } from "./components/PortfolioStep";
import { ReviewStep } from "./components/ReviewStep";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

const STEPS = [
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
  const [aboutImage, setAboutImage] = useState<{
    file: File;
    dataUrl: string;
    alt: string;
  } | null>(null);
  const [projectImages, setProjectImages] = useState<
    Map<number, { file: File; dataUrl: string; alt: string } | null>
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
        darkMode: true,
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

  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate: (keyof SiteConfig)[][] = [
      ["name", "headline"],
      ["about.bio"],
      ["skills"],
      ["experience"],
      ["portfolio"],
      [],
    ];

    if (step < fieldsToValidate.length) {
      // For portfolio step, filter out incomplete links before validation
      if (step === 4) {
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

  const handleExport = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before exporting",
        variant: "destructive",
      });
      return;
    }

    // Validate images have alt text
    if (aboutImage && !aboutImage.alt) {
      toast({
        title: "Missing Alt Text",
        description: "Please provide alt text for the about image",
        variant: "destructive",
      });
      return;
    }

    for (const [index, image] of projectImages.entries()) {
      if (image && !image.alt) {
        toast({
          title: "Missing Alt Text",
          description: `Please provide alt text for project ${index + 1} image`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsExporting(true);

    try {
      const config = form.getValues();

      // Prepare assets map
      const assets = new Map<string, Blob>();

      // Add about image if present
      if (aboutImage) {
        const filename = `about-${Date.now()}.${aboutImage.file.name.split(".").pop()}`;
        assets.set(filename, aboutImage.file);
        config.about.image = `assets/${filename}`;
        config.about.alt = aboutImage.alt;
      }

      // Add project images
      for (const [index, image] of projectImages.entries()) {
        if (image) {
          const filename = `project-${index}-${Date.now()}.${image.file.name.split(".").pop()}`;
          assets.set(filename, image.file);
          config.portfolio[index].image = `assets/${filename}`;
          config.portfolio[index].alt = image.alt;
        }
      }

      // Export ZIP
      await exportSiteConfig(config, assets);

      toast({
        title: "Export Successful",
        description: "Your landing page bundle has been downloaded!",
      });

      // Clear draft
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Create Your Landing Page</h1>
          <p className="text-muted-foreground">
            Fill out the form below to generate your personalized landing page
          </p>
        </div>

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
              {currentStep === 0 && <PersonalInfoStep form={form} />}
              {currentStep === 1 && (
                <AboutStep
                  form={form}
                  aboutImage={aboutImage}
                  onAboutImageChange={setAboutImage}
                />
              )}
              {currentStep === 2 && <SkillsStep form={form} />}
              {currentStep === 3 && <ExperienceStep form={form} />}
              {currentStep === 4 && (
                <PortfolioStep
                  form={form}
                  projectImages={projectImages}
                  onProjectImageChange={(index, value) => {
                    const newMap = new Map(projectImages);
                    if (value) {
                      newMap.set(index, value);
                    } else {
                      newMap.delete(index);
                    }
                    setProjectImages(newMap);
                  }}
                />
              )}
              {currentStep === 5 && <ReviewStep form={form} />}

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
                  <Button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="focus-visible-ring"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export ZIP"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

