import Image from "next/image";

export default function PageHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <section className="relative flex h-64 items-center justify-center overflow-hidden bg-ink sm:h-80">
      <Image src={image} alt="" fill priority className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      <div className="relative text-center text-white">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-base text-white/80 sm:text-lg">{subtitle}</p>
      </div>
    </section>
  );
}
