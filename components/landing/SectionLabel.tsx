type SectionLabelProps = {
  number: string;
  label: string;
};

export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <h2 className="mono mono-md" style={{ color: "var(--muted)" }}>
      {number} / {label}
    </h2>
  );
}
