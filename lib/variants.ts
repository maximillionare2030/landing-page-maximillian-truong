export type VariantId = "classic";

export interface ComponentVariants {
  header: {
    root: string;
    link: string;
    contact: string;
  };
  hero: {
    root: string;
    avatar: string;
    headline: string;
    subheadline: string;
    socialLink: string;
    marqueeContainer: string;
    marqueeTitle: string;
  };
  about: {
    root: string;
    title: string;
    divider: string;
    image: string;
    bio: string;
  };
  skills: {
    root: string;
    title: string;
    divider: string;
    grid: string;
    card: string;
    skillName: string;
    levelBadge: string;
  };
  experience: {
    root: string;
    title: string;
    divider: string;
    container: string;
    timelineLine: string;
    item: string;
    dot: string;
    card: string;
    role: string;
    company: string;
    date: string;
    bullet: string;
  };
  portfolio: {
    root: string;
    title: string;
    divider: string;
    grid: string;
    card: string;
    image: string;
    projectTitle: string;
    description: string;
    tags: string;
    tag: string;
    link: string;
  };
  footer: {
    root: string;
    content: string;
    socialLink: string;
    cta: string;
  };
}

export type VariantStyles = {
  classic: ComponentVariants;
};

