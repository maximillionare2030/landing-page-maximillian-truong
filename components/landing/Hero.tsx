import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";

export function Hero() {
  const contact = profile.links.filter((l) => l.label !== "Portfolio generator");
  return (
    <section id="top" className="hairline-b">
      <div className="container-x flex flex-col justify-center hero-min">
        <div className="py-24 md:py-32">
          <Reveal>
            <p className="mono mono-md" style={{ color: "var(--muted)" }}>
              {profile.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mt-8 font-semibold tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(3.25rem, 9vw, 8rem)" }}
            >
              {profile.name}
              <br />
              <span style={{ color: "var(--muted)" }}>{profile.headline}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-10 max-w-3xl text-xl md:text-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
              {profile.tagline}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <ul className="mt-14 flex flex-wrap gap-10">
              {contact.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={l.todo ? "mono mono-lg link todo" : "mono mono-lg link"}
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
