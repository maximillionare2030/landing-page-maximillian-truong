"use client";

import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { SiteConfig } from "@/types/site";

interface ReviewStepProps {
  form: UseFormReturn<SiteConfig>;
}

export function ReviewStep({ form }: ReviewStepProps) {
  const config = form.watch();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Information</h2>
        <p className="text-muted-foreground">
          Review all your information before exporting. You can still go back to make changes.
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{config.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Headline</Label>
              <p className="font-medium">{config.headline}</p>
            </div>
            {config.subheadline && (
              <div>
                <Label className="text-muted-foreground">Subheadline</Label>
                <p className="font-medium">{config.subheadline}</p>
              </div>
            )}
            {config.email && (
              <div>
                <Label className="text-muted-foreground">{config.email}</Label>
                <p className="font-medium">{config.email}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{config.about.bio}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills ({config.skills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill.name}
                  {skill.level && ` (${skill.level})`}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experience ({config.experience.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.experience.map((exp, index) => (
              <div key={index} className="border-l-2 pl-4">
                <h4 className="font-semibold">{exp.role}</h4>
                <p className="text-sm text-muted-foreground">
                  {exp.company} • {exp.start} - {exp.end || "Present"}
                </p>
                <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio ({config.portfolio.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.portfolio.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold">{project.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme & Style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-muted-foreground">Theme</Label>
              <p className="font-medium capitalize">{config.theme.id || "Noir"}</p>
            </div>
            {config.theme?.heroBackgroundStyle && (
              <div>
                <Label className="text-muted-foreground">Hero Background</Label>
                <p className="font-medium capitalize">
                  {config.theme.heroBackgroundStyle.replace("-", " ")}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Theme can be changed in the first step
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

