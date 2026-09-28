import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";

export function Hero() {
  const contact = profile.links.filter((l) => l.label !== "Portfolio generator");
  return (
    <section id="top" className="hairline-b">
      <div className="container-x flex flex-col justify-center hero-min">
        <div className="py-24 md:py-32">
          <Reveal>
            <p className="mono" style={{ color: "var(--muted)" }}>
              {profile.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mt-6 font-medium tracking-tight leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              {profile.name}
              <br />
              <span style={{ color: "var(--muted)" }}>{profile.headline}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-2xl text-base md:text-lg" style={{ color: "var(--muted)" }}>
              {profile.tagline}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <ul className="mt-12 flex flex-wrap gap-8">
              {contact.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={l.todo ? "mono link todo" : "mono link"}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noreferrer" : undefined}
                  >
                    {l.todo ? `${l.label} (TODO)` : l.label} →
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
