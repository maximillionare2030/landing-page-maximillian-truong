import Link from "next/link";
import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="container-x py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <ul className="flex flex-wrap gap-6">
        {profile.links.map((l) =>
          l.external ? (
            <li key={l.label}>
              <a href={l.href} className="mono link" target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.label}>
              <Link href={l.href} className="mono link">
                {l.label}
              </Link>
            </li>
          )
        )}
      </ul>
      <p className="mono" style={{ color: "var(--muted)" }}>
        © {year} {profile.name} · Built with the portfolio generator at{" "}
        <Link href="/submit" className="link">
          /submit
        </Link>
      </p>
    </footer>
  );
}
