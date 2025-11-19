export type ThemeId = "noir" | "neon-noir" | "slate-pop" | "light-gradient" | "sleek-dark";

export type LayoutId = "classic" | "timeline" | "compact";

export type Skill = {
  name: string;
  level?: "beginner" | "intermediate" | "advanced";
  image?: string;
};

export type Experience = {
  role: string;
  company: string;
  start: string;
  end?: string;
  bullets: string[];
  icon?: string;
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
    primaryHex?: string;
    accentHex?: string;
    backgroundHex?: string;
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

