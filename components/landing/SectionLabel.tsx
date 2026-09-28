type SectionLabelProps = {
  number: string;
  label: string;
};

export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <h2 className="mono" style={{ color: "var(--muted)" }}>
      {number} / {label}
    </h2>
  );
}
