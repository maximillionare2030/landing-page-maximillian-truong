import { Inter, IBM_Plex_Mono } from "next/font/google";

export const landingSans = Inter({
  subsets: ["latin"],
  variable: "--font-landing-sans",
  display: "swap",
});

export const landingMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-landing-mono",
  display: "swap",
});
