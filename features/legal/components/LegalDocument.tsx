interface LegalSection {
  heading: string;
  content: string;
}

interface LegalDocumentProps {
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
}

export function LegalDocument({ title, effectiveDate, sections }: LegalDocumentProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Effective Date: {effectiveDate}
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
