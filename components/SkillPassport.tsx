import type { PassportSection } from "@/lib/types";

export function SkillPassport({ sections }: { sections: PassportSection[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sections.map((section) => (
        <article key={section.title} className="rounded-[1.5rem] border border-line bg-canvas p-4">
          <h3 className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-ink">{section.title}</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
            {section.items.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </article>
      ))}
      <article className="rounded-[1.5rem] border border-line bg-white p-4">
        <h3 className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-ink">Trust labels</h3>
        <div className="mt-4 grid gap-3 text-sm text-ink/75">
          <p><span className="font-semibold text-ink">Self-declared:</span> shared directly by the youth user.</p>
          <p><span className="font-semibold text-ink">Inferred:</span> suggested by multiple signals but not yet directly proved.</p>
          <p><span className="font-semibold text-ink">Demonstrated:</span> shown through a work sample or micro-task.</p>
          <p><span className="font-semibold text-ink">Verified:</span> confirmed by a document, navigator, or assessment.</p>
        </div>
      </article>
    </div>
  );
}
