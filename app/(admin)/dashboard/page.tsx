"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { extractFromZip, createZipFromData } from "@/lib/zip";
import { validateSiteConfig } from "@/lib/validate";
import type { SiteConfig } from "@/types/site";
import { Upload, Download, CheckCircle2, XCircle, Eye, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [assets, setAssets] = useState<Map<string, Blob>>(new Map());
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    errors?: any;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("github");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      toast({
        title: "Invalid File",
        description: "Please upload a ZIP file",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);

    try {
      const { config: extractedConfig, assets: extractedAssets } =
        await extractFromZip(file);

      setConfig(extractedConfig);
      setAssets(extractedAssets);

      // Validate config
      const validation = validateSiteConfig(extractedConfig);
      setValidationResult(validation);

      if (validation.success) {
        toast({
          title: "Upload Successful",
          description: "Config validated successfully",
        });
      } else {
        toast({
          title: "Validation Errors",
          description: "Please check the validation results",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error extracting ZIP:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to extract ZIP file",
        variant: "destructive",
      });
    }
  };

  const handlePrepareBundle = async () => {
    if (!config || !validationResult?.success) {
      toast({
        title: "Invalid Config",
        description: "Please upload and validate a valid config first",
        variant: "destructive",
      });
      return;
    }

    try {
      const configJson = JSON.stringify(config, null, 2);
      const zipBlob = await createZipFromData(configJson, assets);

      // Download the prepared bundle
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prepared-bundle-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Bundle Prepared",
        description: "Ready-to-apply bundle downloaded",
      });
    } catch (error) {
      console.error("Error preparing bundle:", error);
      toast({
        title: "Preparation Failed",
        description: "Failed to prepare bundle",
        variant: "destructive",
      });
    }
  };

  const handleInjectConfig = async () => {
    if (!config || !validationResult?.success || assets.size === 0) {
      toast({
        title: "Invalid Config",
        description: "Please upload and validate a valid config with assets first",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("config", JSON.stringify(config, null, 2));

      // Convert assets Map to File objects for FormData
      for (const [filename, blob] of assets.entries()) {
        const file = new File([blob], filename, { type: blob.type });
        formData.append("assets", file);
      }

      const response = await fetch("/api/inject-config", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.details
          ? `${error.error}: ${error.details}${error.suggestion ? `\n\n${error.suggestion}` : ''}`
          : error.error || "Failed to inject config";
        throw new Error(errorMessage);
      }

      const result = await response.json();

      toast({
        title: "Config Injected",
        description: "Config and assets have been saved to the codebase",
      });

      // Redirect to the landing page to see the changes
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Error injecting config:", error);
      toast({
        title: "Injection Failed",
        description: error instanceof Error ? error.message : "Failed to inject config",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Upload and validate landing page configurations
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/dashboard/preview")}>
              <Eye className="mr-2 h-4 w-4" />
              Live Preview
            </Button>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload ZIP File</CardTitle>
              <CardDescription>
                Upload a ZIP file containing config.json and assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zip-upload">ZIP File</Label>
                <Input
                  id="zip-upload"
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

              {uploadedFile && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>
                Config validation status and errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {validationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {validationResult.success ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-green-500">
                          Valid Configuration
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-destructive" />
                        <span className="font-medium text-destructive">
                          Validation Failed
                        </span>
                      </>
                    )}
                  </div>

                  {!validationResult.success && validationResult.errors && (
                    <div className="space-y-2">
                      <Label>Errors:</Label>
                      <div className="p-4 bg-destructive/10 rounded-lg max-h-64 overflow-y-auto">
                        <pre className="text-xs text-destructive">
                          {JSON.stringify(validationResult.errors.format(), null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {validationResult.success && config && (
                    <div className="space-y-2">
                      <Label>Config Summary:</Label>
                      <div className="p-4 bg-muted rounded-lg space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Name:</span> {config.name}
                        </p>
                        <p>
                          <span className="font-medium">Layout:</span> {config.layout}
                        </p>
                        <p>
                          <span className="font-medium">Theme:</span> {config.theme.id}
                        </p>
                        <p>
                          <span className="font-medium">Skills:</span> {config.skills.length}
                        </p>
                        <p>
                          <span className="font-medium">Experience:</span>{" "}
                          {config.experience.length}
                        </p>
                        <p>
                          <span className="font-medium">Projects:</span>{" "}
                          {config.portfolio.length}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Upload a ZIP file to see validation results
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {validationResult?.success && config && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Inject config to codebase, prepare bundle, or view live preview
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button onClick={handleInjectConfig} className="bg-primary">
                <Zap className="mr-2 h-4 w-4" />
                Inject to Codebase
              </Button>
              <Button onClick={handlePrepareBundle} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Prepare Ready-to-Apply Bundle
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  // Convert assets Map to data URLs for preview
                  const assetsDataUrls: Record<string, string> = {};

                  // Convert each blob to a data URL
                  for (const [filename, blob] of assets.entries()) {
                    try {
                      const dataUrl = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                      });
                      assetsDataUrls[filename] = dataUrl;
                    } catch (error) {
                      console.error(`Failed to convert ${filename} to data URL:`, error);
                    }
                  }

                  // Store config and assets in sessionStorage for preview
                  sessionStorage.setItem("preview-config", JSON.stringify(config));
                  sessionStorage.setItem("preview-assets", JSON.stringify(assetsDataUrls));
                  router.push("/dashboard/preview");
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Live Preview
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

