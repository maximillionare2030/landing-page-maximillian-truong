import Link from "next/link";
import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="hairline-t">
      <div className="container-x py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <ul className="flex flex-wrap gap-6">
          {profile.links.map((l) => {
            const className = l.todo ? "mono link todo" : "mono link";
            const label = l.todo ? `${l.label} (TODO)` : l.label;
            if (l.href.startsWith("mailto:")) {
              return (
                <li key={l.label}>
                  <a href={l.href} className={className}>
                    {label}
                  </a>
                </li>
              );
            }
            if (l.external) {
              return (
                <li key={l.label}>
                  <a href={l.href} className={className} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                </li>
              );
            }
            return (
              <li key={l.label}>
                <Link href={l.href} className={className}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mono" style={{ color: "var(--muted)" }}>
          © {year} {profile.name} · Built with the portfolio generator at{" "}
          <Link href="/submit" className="link">
            /submit
          </Link>
        </p>
      </div>
    </footer>
  );
}
