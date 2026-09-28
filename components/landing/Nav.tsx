import Link from "next/link";
import { profile } from "@/content/profile";

const anchors = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

export function Nav() {
  const generator = profile.links.find((l) => l.label === "Portfolio generator");
  return (
    <header className="sticky top-0 z-50 nav-blur hairline-b">
      <nav className="container-x flex items-center justify-between h-14 gap-6">
        <a href="#top" className="mono link whitespace-nowrap">
          {profile.name}
        </a>
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="mono link">
              {a.label}
            </a>
          ))}
          {generator && (
            <Link href={generator.href} className="mono link" style={{ color: "var(--muted)" }}>
              {generator.label} ↗
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
