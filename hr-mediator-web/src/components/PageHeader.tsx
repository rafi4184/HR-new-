export default function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-gold-pale/50 to-paper">
      <div className="container-page py-14 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl text-navy sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      </div>
    </section>
  );
}
