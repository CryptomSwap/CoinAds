import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const formats = [
  {
    name: "300×250",
    type: "Banner",
    description: "Standard display banner"
  },
  {
    name: "300×600",
    type: "Skyscraper", 
    description: "Tall format banner"
  },
  {
    name: "Native",
    type: "Content",
    description: "Seamless content integration"
  }
];

export default function FormatsTeaser() {
  return (
    <section className="py-20 bg-muted">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ad Formats
          </h2>
          <p className="text-lg text-muted-foreground">
            Multiple formats to match your campaign goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {formats.map((format, index) => (
            <Card 
              key={index} 
              className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-colors focus-within:ring-2 focus-within:ring-teal-300 focus-within:ring-offset-2 focus-within:ring-offset-slate-900"
            >
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-2">
                      {format.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format.type}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-foreground text-lg">
                  {format.name} {format.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {format.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/ad-formats">
            <Button 
              className="bg-gradient-brand bg-gradient-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View full specs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
