import type { requirementPages } from './requirementPages'

export function RequirementPage({ page }: { page: (typeof requirementPages)[number] }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-15">
      <h1 className="text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">{page.label}</h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-ink-700">{page.summary}</p>

      <ol className="mt-8 list-decimal space-y-4 pl-5 marker:font-semibold marker:text-accent-800">
        {page.requirements.map(({ title, description, evidence }) => (
          <li key={title} className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-bold text-ink-950">{title}</h2>
            <p className="mt-2 leading-relaxed text-ink-700">{description}</p>
            {evidence && (
              <code className="mt-3 block overflow-x-auto whitespace-pre-wrap rounded-xl bg-accent-50 p-3 text-sm text-accent-900 md:text-base">
                {evidence}
              </code>
            )}
          </li>
        ))}
      </ol>

    </main>
  )
}
