import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const skillIconByName = new Map(profile.skills.map((s) => [s.name.toLowerCase(), s.image]));

/** Returns the matching skill logo for a project tag, or null when no skill shares the name. */
function skillIcon(tag: string): string | null {
  return skillIconByName.get(tag.toLowerCase()) ?? null;
}

export function Projects() {
  return (
    <section id="projects">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <SectionLabel number="03" label="Projects" />
        </Reveal>
        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--hairline)" }}>
          {profile.projects.map((p, i) => (
            <li key={p.title} style={{ background: "var(--bg)" }}>
              <Reveal delay={(i % 2) * 80} className="h-full">
                <article className="card group flex h-full flex-col">
                  <div className="relative aspect-video w-full hairline-b">
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-3 text-base md:text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                      {p.description}
                    </p>
                    <ul className="stagger mt-7 flex flex-wrap gap-2">
                      {p.tags.map((t) => {
                        const icon = skillIcon(t);
                        return (
                          <li
                            key={t}
                            className="mono mono-md hairline inline-flex items-center gap-2 px-3 py-1.5"
                            style={{ color: "var(--muted)" }}
                          >
                            {icon && (
                              <span className="relative inline-block h-4 w-4 shrink-0">
                                <Image src={icon} alt="" fill sizes="16px" className="object-contain" />
                              </span>
                            )}
                            {t}
                          </li>
                        );
                      })}
                    </ul>
                    <ul className="mt-auto pt-10 flex gap-8">
                      {p.links.map((l) =>
                        l.href.startsWith("/") ? (
                          <li key={l.label}>
                            <Link href={l.href} className="mono mono-md link underline-slide">
                              {l.label} →
                            </Link>
                          </li>
                        ) : (
                          <li key={l.label}>
                            <a href={l.href} className="mono mono-md link underline-slide" target="_blank" rel="noreferrer">
                              {l.label} ↗
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
