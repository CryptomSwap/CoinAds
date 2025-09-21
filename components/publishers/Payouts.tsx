export default function Payouts(){
  return (
    <section className="bg-gradient-to-b from-muted to-transparent">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-foreground">Payouts</h2>
        <div className="mx-auto mt-6 max-w-3xl text-center text-muted-foreground">
          <p><strong className="text-foreground">Methods:</strong> USDT (TRC20/ERC20), USDC (ERC20), SEPA/SWIFT.</p>
          <p className="mt-2"><strong className="text-foreground">Schedule:</strong> weekly or monthly; <strong className="text-foreground">minimum payout</strong> $100.</p>
          <p className="mt-2"><strong className="text-foreground">Visibility:</strong> downloadable statements and invoice support.</p>
        </div>
      </div>
    </section>
  );
}
