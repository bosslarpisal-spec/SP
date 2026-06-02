interface Props { text: string }

export default function SectionLabel({ text }: Props) {
  return (
    <div className="flex items-center gap-[7px]">
      <span className="block shrink-0" style={{ width: "18px", height: "2px", background: "#E8D5A3" }} />
      <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#E8D5A3" }}>
        {text}
      </span>
    </div>
  );
}
