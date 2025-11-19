"use client";

import type { SiteConfig, LayoutId } from "@/types/site";

// Classic layout components
import { Header as ClassicHeader } from "@/templates/classic/components/Header";
import { Hero as ClassicHero } from "@/templates/classic/components/Hero";
import { About as ClassicAbout } from "@/templates/classic/components/About";
import { Skills as ClassicSkills } from "@/templates/classic/components/Skills";
import { Experience as ClassicExperience } from "@/templates/classic/components/Experience";
import { Footer as ClassicFooter } from "@/templates/classic/components/Footer";

// Timeline layout components
import { Header as TimelineHeader } from "@/templates/timeline/components/Header";
import { Hero as TimelineHero } from "@/templates/timeline/components/Hero";
import { About as TimelineAbout } from "@/templates/timeline/components/About";
import { Skills as TimelineSkills } from "@/templates/timeline/components/Skills";
import { Experience as TimelineExperience } from "@/templates/timeline/components/Experience";
import { Footer as TimelineFooter } from "@/templates/timeline/components/Footer";

// Compact layout components
import { Header as CompactHeader } from "@/templates/compact/components/Header";
import { Hero as CompactHero } from "@/templates/compact/components/Hero";
import { About as CompactAbout } from "@/templates/compact/components/About";
import { Skills as CompactSkills } from "@/templates/compact/components/Skills";
import { Experience as CompactExperience } from "@/templates/compact/components/Experience";
import { Footer as CompactFooter } from "@/templates/compact/components/Footer";

interface LayoutComponentsProps {
  layout: LayoutId;
  config: SiteConfig;
}

export function LayoutComponents({ layout, config }: LayoutComponentsProps) {
  switch (layout) {
    case "timeline":
      return (
        <>
          <TimelineHeader config={config} />
          <main className="flex-1">
            <TimelineHero config={config} />
            <TimelineAbout config={config} />
            <TimelineSkills config={config} />
            <TimelineExperience config={config} />
          </main>
          <TimelineFooter config={config} />
        </>
      );

    case "compact":
      return (
        <>
          <CompactHeader config={config} />
          <main className="flex-1">
            <CompactHero config={config} />
            <CompactAbout config={config} />
            <CompactSkills config={config} />
            <CompactExperience config={config} />
          </main>
          <CompactFooter config={config} />
        </>
      );

    case "classic":
    default:
      return (
        <>
          <ClassicHeader config={config} />
          <main className="flex-1">
            <ClassicHero config={config} />
            <ClassicAbout config={config} />
            <ClassicSkills config={config} />
            <ClassicExperience config={config} />
          </main>
          <ClassicFooter config={config} />
        </>
      );
  }
}

