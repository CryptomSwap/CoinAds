const logos = [
  "binance.svg",
  "okx.svg", 
  "bybit.svg",
  "decrypt.svg",
  "cointelegraph.svg",
  "coindesk.svg"
];

export default function LogosBar() {
  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Trusted by top exchanges, wallets, and publishers
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center opacity-80">
          {logos.map((logo) => (
            <img 
              key={logo} 
              src={`/logos/${logo}`} 
              alt="" 
              className="h-8 mx-auto grayscale contrast-125"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
