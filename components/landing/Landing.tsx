import { landingSans, landingMono } from "@/lib/landing-fonts";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import "./landing.css";

export function Landing() {
  return (
    <div className={`landing ${landingSans.variable} ${landingMono.variable}`}>
      <Nav />
      <main>
        <Hero />
      </main>
    </div>
  );
}
