import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    company: "DeFi Protocol",
    content: "CoinAds helped us reach our target crypto audience with 40% better CTR than other platforms. The fraud protection gives us confidence in our ad spend.",
    rating: 5
  },
  {
    name: "Mike Rodriguez", 
    company: "Crypto Exchange",
    content: "The real-time reporting and precise targeting features have revolutionized our campaigns. Easy to use platform with excellent support.",
    rating: 5
  },
  {
    name: "Alex Kim",
    company: "NFT Marketplace", 
    content: "Our campaigns launched in minutes thanks to CoinAds' intuitive interface. ROI improved significantly compared to traditional ad networks.",
    rating: 5
  },
  {
    name: "Emma Thompson",
    company: "Crypto Publisher",
    content: "As a content creator, CoinAds provides transparent reporting and fair monetization. We've seen great revenue growth on our crypto news site.",
    rating: 5
  },
  {
    name: "David Park",
    company: "Blockchain Startup",
    content: "The audience targeting and fraud detection capabilities are outstanding. Perfect solution for our Web3 project promotion needs.",
    rating: 5
  },
  {
    name: "Lisa Zhang",
    company: "Crypto Trader",
    content: "CoinAds delivers quality traffic with genuine crypto enthusiasts. Our trading platform sign-ups increased by 60% in the first month.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Join thousands of advertisers and publishers who trust CoinAds
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.company}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
