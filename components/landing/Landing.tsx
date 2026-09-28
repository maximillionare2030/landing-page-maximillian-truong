import { landingSans, landingMono } from "@/lib/landing-fonts";
import { profile } from "@/content/profile";
import "./landing.css";

export function Landing() {
  return (
    <div className={`landing ${landingSans.variable} ${landingMono.variable}`}>
      <main>
        <section className="container-x py-24">
          <h1 className="text-5xl font-medium tracking-tight">{profile.name}</h1>
        </section>
      </main>
    </div>
  );
}
