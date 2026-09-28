import Image from "next/image";
import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function Skills() {
  return (
    <section id="skills" className="hairline-b">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <SectionLabel number="02" label="Skills" />
        </Reveal>
        <Reveal delay={80}>
          <ul
            className="mt-10 grid grid-cols-3 md:grid-cols-6"
            style={{ borderTop: "1px solid var(--hairline)", borderLeft: "1px solid var(--hairline)" }}
          >
            {profile.skills.map((s) => (
              <li
                key={s.name}
                className="group flex flex-col items-center justify-center gap-4 p-6 aspect-square"
                style={{ borderRight: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}
              >
                <div className="relative h-10 w-10">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="40px"
                    className="object-contain img-mono"
                  />
                </div>
                <span className="mono text-center" style={{ color: "var(--muted)" }}>
                  {s.name}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
