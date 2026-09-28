import { landingSans, landingMono } from "@/lib/landing-fonts";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { About } from "./About";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Footer } from "./Footer";
import "./landing.css";

export function Landing() {
  return (
    <div className={`landing ${landingSans.variable} ${landingMono.variable}`}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
