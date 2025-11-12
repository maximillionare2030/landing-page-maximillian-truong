export type ThemeId = "noir" | "neon-noir" | "slate-pop";

export type LayoutId = "classic" | "timeline" | "compact";

export type Skill = {
  name: string;
  level?: "beginner" | "intermediate" | "advanced";
};

export type Experience = {
  role: string;
  company: string;
  start: string;
  end?: string;
  bullets: string[];
};

export type Project = {
  title: string;
  description: string;
  image: string;
  alt?: string;
  tags?: string[];
  links?: { label: string; url: string }[];
};

export type SiteConfig = {
  name: string;
  headline: string;
  subheadline?: string;
  email?: string;
  socials?: Partial<
    Record<"github" | "linkedin" | "x" | "website" | "email" | "other", string>
  >;
  theme: {
    id: ThemeId;
    brandHex?: string;
    darkMode?: boolean;
  };
  layout: LayoutId;
  images?: {
    avatar?: string;
    hero?: string;
  };
  about: {
    bio: string;
    image?: string;
    alt?: string;
  };
  skills: Skill[];
  experience: Experience[];
  portfolio: Project[];
};

