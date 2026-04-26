export function SectionCard({
  title,
  eyebrow,
  description,
  children
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/80 bg-white/95 p-5 shadow-soft sm:p-6">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">{eyebrow}</p> : null}
      <div className="mt-2 flex flex-col gap-1">
        <h2 className="font-[var(--font-heading)] text-2xl font-bold tracking-tight text-ink">{title}</h2>
        {description ? <p className="text-sm leading-6 text-ink/75">{description}</p> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
