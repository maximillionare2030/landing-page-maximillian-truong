import Image from "next/image";
import { profile } from "@/content/profile";
import type { Role } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

function Dates({ role }: { role: Role }) {
  const text = role.end ? `${role.start} — ${role.end}` : role.start;
  return (
    <p className="mono mono-md" style={{ color: "var(--muted)" }}>
      {text}
    </p>
  );
}

function CompanyMark({ role }: { role: Role }) {
  if (role.logo) {
    return (
      <span className="relative inline-block h-10 w-10 shrink-0 overflow-hidden align-middle">
        <Image src={role.logo} alt="" fill sizes="40px" className="object-contain" />
      </span>
    );
  }
  return (
    <span
      className="mono mono-md hairline inline-flex h-10 items-center px-3 align-middle"
      style={{ color: "var(--text)" }}
    >
      {role.company}
    </span>
  );
}

export function Experience() {
  return (
    <section id="experience" className="hairline-b">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <SectionLabel number="02" label="Experience" />
        </Reveal>
        <ol className="mt-12">
          {profile.experience.map((role, i) => (
            <li key={`${role.company}-${role.role}`} className="hairline-t">
              <Reveal delay={Math.min(i, 4) * 60}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10">
                  <div className="md:col-span-3 md:pt-2">
                    <Dates role={role} />
                  </div>
                  <div className="md:col-span-9">
                    <div className="flex items-center gap-4">
                      <CompanyMark role={role} />
                      <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">{role.role}</h3>
                    </div>
                    <p className="mt-3 mono mono-md" style={{ color: "var(--muted)" }}>
                      {role.company}
                    </p>
                    <ul className="mt-5 space-y-3 max-w-3xl">
                      {role.bullets.map((b, j) => (
                        <li
                          key={j}
                          className={`flex gap-4 text-lg md:text-xl leading-relaxed ${role.todo ? "todo mono" : ""}`}
                          style={role.todo ? undefined : { color: "var(--muted)" }}
                        >
                          <span aria-hidden style={{ color: "var(--hairline)" }}>
                            —
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
