import type { ReactNode } from "react";

export function PageIntro({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="border-b border-line/60">
      <div className="container-site pb-10 pt-8 lg:pb-16 lg:pt-12">
        <span className="rule-short mb-5" aria-hidden="true" />
        <h1 className="h-page max-w-3xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{lead}</p>}
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`mb-8 lg:mb-10 ${className}`}>
      <span className="rule-short mb-5" aria-hidden="true" />
      <h2 id={id} className="h-section">{children}</h2>
    </div>
  );
}

export function ExternalLink({ href, children, className = "link", srLabel }: { href: string; children: ReactNode; className?: string; srLabel: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="visually-hidden"> {srLabel}</span>
    </a>
  );
}
