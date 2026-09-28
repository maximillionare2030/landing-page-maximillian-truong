import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: profile.name,
  description: profile.tagline,
};

export default function HomePage() {
  return <Landing />;
}

