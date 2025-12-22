"use client";

import type { SiteConfig } from "@/types/site";
import { LandingPage } from "@/components/layout/LandingPage";

interface LayoutComponentsProps {
  config: SiteConfig;
}

export function LayoutComponents({ config }: LayoutComponentsProps) {
  return <LandingPage config={config} />;
}

