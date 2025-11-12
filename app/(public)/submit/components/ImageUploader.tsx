"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { processImage, isValidImageType, formatFileSize } from "@/lib/utils";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  value?: { file: File; dataUrl: string; alt: string };
  onChange: (value: { file: File; dataUrl: string; alt: string } | null) => void;
  required?: boolean;
  helperText?: string;
}

export function ImageUploader({
  label,
  value,
  onChange,
  required = false,
  helperText,
}: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageType(file)) {
      alert("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    setIsProcessing(true);
    try {
      const { blob, dataUrl } = await processImage(file);
      const processedFile = new File([blob], file.name, { type: blob.type });
      onChange({
        file: processedFile,
        dataUrl,
        alt: "", // User must provide alt text
      });
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`image-${label}`}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}

      {!value ? (
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="focus-visible-ring"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Upload Image"}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            aria-label={`Upload ${label}`}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={value.dataUrl}
              alt="Preview"
              className="h-24 w-24 rounded-md object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{value.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.file.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`alt-${label}`}>
              Alt Text {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={`alt-${label}`}
              value={value.alt}
              onChange={(e) =>
                onChange({ ...value, alt: e.target.value })
              }
              placeholder="Describe this image for screen readers"
              required={required}
              aria-required={required}
            />
            <p className="text-xs text-muted-foreground">
              Required for accessibility. Describe what the image shows.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

