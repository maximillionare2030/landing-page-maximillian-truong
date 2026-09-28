import Image from "next/image";
import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function About() {
  return (
    <section id="about" className="hairline-b">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <SectionLabel number="01" label="About" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <Reveal className="md:col-span-5" delay={80}>
            <div className="hairline p-2">
              <div className="clip-up relative aspect-[4/5] w-full">
                <Image
                  src={profile.aboutImage.src}
                  alt={profile.aboutImage.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <Reveal className="md:col-span-7" delay={160}>
            <div className="space-y-8 text-xl md:text-2xl leading-relaxed">
              {profile.bio.map((p, i) => (
                <p key={i} style={{ color: i === 0 ? "var(--text)" : "var(--muted)" }}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
