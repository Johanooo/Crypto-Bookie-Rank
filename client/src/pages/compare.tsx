import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { ArrowRight, X, GitCompare } from "lucide-react";
import type { Bookmaker } from "@shared/schema";

export default function Compare() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(["mystake", "playbet"]);

  const { data: bookmakers } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers"],
  });

  const selected = bookmakers?.filter(bm => selectedSlugs.includes(bm.slug)) || [];

  const handleSelect = (index: number, slug: string) => {
    const newSlugs = [...selectedSlugs];
    newSlugs[index] = slug;
    setSelectedSlugs(newSlugs);
  };

  const addSlot = () => {
    if (selectedSlugs.length < 4 && bookmakers) {
      const available = bookmakers.find(bm => !selectedSlugs.includes(bm.slug));
      if (available) setSelectedSlugs([...selectedSlugs, available.slug]);
    }
  };

  const removeSlot = (index: number) => {
    if (selectedSlugs.length > 2) {
      setSelectedSlugs(selectedSlugs.filter((_, i) => i !== index));
    }
  };

  const categories = [
    { label: "Overall Rating", key: "overallRating" as const },
    { label: "Trust Score", key: "trustScore" as const },
    { label: "Odds Quality", key: "oddsRating" as const },
    { label: "Bonus Value", key: "bonusRating" as const },
    { label: "User Interface", key: "uiRating" as const },
    { label: "Support", key: "supportRating" as const },
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/50" style={{ background: "linear-gradient(160deg, hsl(222 50% 5%) 0%, hsl(220 40% 10%) 50%, hsl(222 45% 7%) 100%)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 relative">
          <Badge variant="secondary" className="mb-3">
            <GitCompare className="w-3 h-3 mr-1" />
            Compare
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" data-testid="text-page-title">Compare Bookmakers</h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-2xl">Side-by-side comparison of ratings, trust scores, and features</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {selectedSlugs.map((slug, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select value={slug} onValueChange={(v) => handleSelect(i, v)}>
                <SelectTrigger className="flex-1 sm:w-[200px]" data-testid={`select-bookmaker-${i}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bookmakers?.map(bm => (
                    <SelectItem key={bm.slug} value={bm.slug}>{bm.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSlugs.length > 2 && (
                <Button variant="ghost" size="icon" onClick={() => removeSlot(i)} data-testid={`button-remove-${i}`}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          {selectedSlugs.length < 4 && (
            <Button variant="outline" onClick={addSlot} data-testid="button-add-bookmaker">
              + Add
            </Button>
          )}
        </div>

        {selected.length >= 2 && (
          <div className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4">
              <Card className="overflow-visible min-w-[480px]">
                <div className="grid" style={{ gridTemplateColumns: `minmax(120px, 160px) repeat(${selected.length}, 1fr)` }}>
                  <div className="p-3 sm:p-4 font-bold border-b text-sm">Bookmaker</div>
                  {selected.map(bm => (
                    <div key={bm.id} className="p-3 sm:p-4 border-b border-l text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center ${bm.rank === 1 ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted"}`}>
                          <img src={bm.logo} alt={bm.name} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                        </div>
                        <span className="font-bold text-sm sm:text-base">{bm.name}</span>
                        <TrustScoreBadge score={bm.trustScore} size="sm" />
                      </div>
                    </div>
                  ))}

                  {categories.map(cat => (
                    <div key={cat.key} className="contents">
                      <div className="p-3 sm:p-4 flex items-center font-medium text-xs sm:text-sm border-b">
                        {cat.label}
                      </div>
                      {selected.map(bm => {
                        const value = bm[cat.key] as number;
                        const isHighest = Math.max(...selected.map(s => s[cat.key] as number)) === value;
                        return (
                          <div key={`${bm.id}-${cat.key}`} className={`p-3 sm:p-4 border-b border-l text-center ${isHighest ? "bg-primary/5" : ""}`}>
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-base sm:text-lg font-bold ${isHighest ? "text-primary" : ""}`}>
                                {value.toFixed(1)}
                              </span>
                              <Progress value={value * 10} className="h-1.5 w-14 sm:w-20" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  <div className="p-3 sm:p-4 flex items-center font-medium text-xs sm:text-sm border-b">Payout Speed</div>
                  {selected.map(bm => (
                    <div key={`${bm.id}-payout`} className="p-3 sm:p-4 border-b border-l text-center text-xs sm:text-sm font-semibold">
                      {bm.payoutSpeed}
                    </div>
                  ))}

                  <div className="p-3 sm:p-4 flex items-center font-medium text-xs sm:text-sm border-b">Min Deposit</div>
                  {selected.map(bm => (
                    <div key={`${bm.id}-min`} className="p-3 sm:p-4 border-b border-l text-center text-xs sm:text-sm">
                      {bm.minDeposit}
                    </div>
                  ))}

                  <div className="p-3 sm:p-4 flex items-center font-medium text-xs sm:text-sm border-b">Established</div>
                  {selected.map(bm => (
                    <div key={`${bm.id}-est`} className="p-3 sm:p-4 border-b border-l text-center text-xs sm:text-sm">
                      {bm.established || "N/A"}
                    </div>
                  ))}

                  <div className="p-3 sm:p-4 flex items-center font-medium text-xs sm:text-sm border-b">Cryptos</div>
                  {selected.map(bm => (
                    <div key={`${bm.id}-crypto`} className="p-3 sm:p-4 border-b border-l text-center">
                      <span className="text-xs sm:text-sm font-semibold">{bm.cryptosAccepted.length}</span>
                      <span className="text-xs text-muted-foreground ml-1">supported</span>
                    </div>
                  ))}

                  <div className="p-3 sm:p-4 flex items-center font-medium text-xs sm:text-sm">Visit</div>
                  {selected.map(bm => (
                    <div key={`${bm.id}-visit`} className="p-3 sm:p-4 border-l text-center">
                      {bm.affiliateUrl ? (
                        <a href={bm.affiliateUrl} target="_blank" rel="noopener noreferrer nofollow">
                          <Button size="sm" data-testid={`button-compare-visit-${bm.slug}`}>
                            Visit <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm text-muted-foreground">N/A</span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
