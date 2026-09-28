import { landingSans, landingMono } from "@/lib/landing-fonts";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { About } from "./About";
import { Skills } from "./Skills";
import { Experience } from "./Experience";
import "./landing.css";

export function Landing() {
  return (
    <div className={`landing ${landingSans.variable} ${landingMono.variable}`}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
      </main>
    </div>
  );
}
