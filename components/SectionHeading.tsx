import type { ReactNode } from "react";

export default function SectionHeading({
  kicker,
  heading,
  intro,
  align = "center",
}: {
  kicker?: string;
  heading: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div className={`mx-auto max-w-3xl ${isCenter ? "text-center" : "text-left"}`}>
      {kicker && <span className="section-kicker">{kicker}</span>}
      <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">{heading}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-ink/65 sm:text-lg">{intro}</p>}
    </div>
  );
}
