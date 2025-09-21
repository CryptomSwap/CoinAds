export default function Requirements(){
  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-foreground">Publisher Requirements</h2>
        <ul className="mx-auto mt-6 max-w-3xl list-disc space-y-2 text-muted-foreground marker:text-primary">
          <li>Crypto/finance content; real human traffic; no forced clicks/refresh.</li>
          <li>Category-appropriate and brand-safe content; we may reject for quality/policy.</li>
          <li>CMP/consent if serving EU users; follow ads.txt/sellers.json guidance.</li>
        </ul>
      </div>
    </section>
  );
}
