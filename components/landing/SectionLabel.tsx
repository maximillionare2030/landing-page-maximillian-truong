type SectionLabelProps = {
  number: string;
  label: string;
};

export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <p className="mono" style={{ color: "var(--muted)" }}>
      {number} / {label}
    </p>
  );
}
