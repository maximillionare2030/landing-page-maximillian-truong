import Image from "next/image";
import { profile } from "@/content/profile";
import type { Role } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

function Dates({ role }: { role: Role }) {
  const text = role.end ? `${role.start} — ${role.end}` : role.start;
  return (
    <p className="mono mono-lg" style={{ color: "var(--muted)" }}>
      {text}
    </p>
  );
}

function CompanyCard({ role }: { role: Role }) {
  return (
    <div
      className="flex w-40 shrink-0 flex-col items-center gap-4 p-4"
    >
      <span className="round pop relative block h-24 w-24 overflow-hidden">
        {role.logo ? (
          <Image src={role.logo} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center text-4xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            {role.company.charAt(0)}
          </span>
        )}
      </span>
      <p className="mono text-center leading-snug" style={{ color: "var(--text)" }}>
        {role.company}
      </p>
    </div>
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
            <li key={`${role.company}-${role.role}`}>
              <Reveal className="line-draw" delay={Math.min(i, 4) * 60}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-8">
                  <div className="md:col-span-3 md:pt-2">
                    <Dates role={role} />
                  </div>
                  <div className="md:col-span-6">
                    <h3 className="text-xl md:text-3xl font-semibold tracking-tight">{role.role}</h3>
                    <ul className="mt-5 space-y-3 max-w-3xl">
                      {role.bullets.map((b, j) => (
                        <li
                          key={j}
                          className={`text-base md:text-lg leading-relaxed ${role.todo ? "todo mono" : ""}`}
                          style={role.todo ? undefined : { color: "var(--muted)" }}
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-3 flex md:justify-end">
                    <CompanyCard role={role} />
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
