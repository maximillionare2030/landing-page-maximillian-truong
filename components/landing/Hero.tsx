import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { Typewriter } from "./Typewriter";

const BIG = { fontSize: "clamp(2.75rem, 7vw, 6rem)" };

export function Hero() {
  const contact = profile.links.filter((l) => l.label !== "Portfolio generator");
  return (
    <section id="top" className="hairline-b hero-grid relative overflow-hidden">
      <div className="container-x relative z-10 flex flex-col justify-center hero-min">
        <div className="py-24 md:py-32">
          <Typewriter
            startDelay={300}
            charDelay={26}
            lines={[{ text: profile.eyebrow, className: "mono mono-md", style: { color: "var(--muted)" } }]}
          />

          <h1 className="mt-8 font-semibold tracking-tight leading-[0.92]" style={BIG}>
            <SplitText text={profile.name} delay={500} />
          </h1>

          <div className="mt-2 font-semibold tracking-tight leading-[0.92]" style={BIG}>
            <Typewriter
              startDelay={1500}
              charDelay={45}
              lines={[{ text: profile.headline, style: { color: "var(--muted)" } }]}
            />
          </div>

          <div className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed">
            <Typewriter
              startDelay={2500}
              charDelay={22}
              holdCursor
              lines={[{ text: profile.tagline, style: { color: "var(--muted)" } }]}
            />
          </div>

          <Reveal delay={3200}>
            <ul className="stagger mt-12 flex flex-wrap gap-8">
              {contact.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={l.todo ? "mono mono-lg link underline-slide todo" : "mono mono-lg link underline-slide"}
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
