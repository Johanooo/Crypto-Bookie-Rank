import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { StarRating } from "@/components/star-rating";
import { ArrowRight, Check, X, GitCompare } from "lucide-react";
import type { Bookmaker } from "@shared/schema";

export default function Compare() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(["stake", "bc-game"]);

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">
          <GitCompare className="w-3 h-3 mr-1" />
          Compare
        </Badge>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Compare Bookmakers</h1>
        <p className="text-muted-foreground mt-1">Side-by-side comparison of ratings, trust scores, and features</p>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {selectedSlugs.map((slug, i) => (
          <div key={i} className="flex items-center gap-2">
            <Select value={slug} onValueChange={(v) => handleSelect(i, v)}>
              <SelectTrigger className="w-[200px]" data-testid={`select-bookmaker-${i}`}>
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
          <Card className="overflow-visible">
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
              <div className="p-4 font-bold border-b">Bookmaker</div>
              {selected.map(bm => (
                <div key={bm.id} className="p-4 border-b border-l text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                      <img src={bm.logo} alt={bm.name} className="w-8 h-8 object-contain" />
                    </div>
                    <span className="font-bold">{bm.name}</span>
                    <TrustScoreBadge score={bm.trustScore} size="sm" />
                  </div>
                </div>
              ))}

              {categories.map(cat => (
                <>
                  <div key={cat.key} className="p-4 flex items-center font-medium text-sm border-b">
                    {cat.label}
                  </div>
                  {selected.map(bm => {
                    const value = bm[cat.key] as number;
                    const isHighest = Math.max(...selected.map(s => s[cat.key] as number)) === value;
                    return (
                      <div key={`${bm.id}-${cat.key}`} className={`p-4 border-b border-l text-center ${isHighest ? "bg-primary/5" : ""}`}>
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-lg font-bold ${isHighest ? "text-primary" : ""}`}>
                            {value.toFixed(1)}
                          </span>
                          <Progress value={value * 10} className="h-1.5 w-20" />
                        </div>
                      </div>
                    );
                  })}
                </>
              ))}

              <div className="p-4 flex items-center font-medium text-sm border-b">Payout Speed</div>
              {selected.map(bm => (
                <div key={`${bm.id}-payout`} className="p-4 border-b border-l text-center text-sm font-semibold">
                  {bm.payoutSpeed}
                </div>
              ))}

              <div className="p-4 flex items-center font-medium text-sm border-b">Min Deposit</div>
              {selected.map(bm => (
                <div key={`${bm.id}-min`} className="p-4 border-b border-l text-center text-sm">
                  {bm.minDeposit}
                </div>
              ))}

              <div className="p-4 flex items-center font-medium text-sm border-b">Established</div>
              {selected.map(bm => (
                <div key={`${bm.id}-est`} className="p-4 border-b border-l text-center text-sm">
                  {bm.established || "N/A"}
                </div>
              ))}

              <div className="p-4 flex items-center font-medium text-sm border-b">Cryptos</div>
              {selected.map(bm => (
                <div key={`${bm.id}-crypto`} className="p-4 border-b border-l text-center">
                  <span className="text-sm font-semibold">{bm.cryptosAccepted.length}</span>
                  <span className="text-xs text-muted-foreground ml-1">supported</span>
                </div>
              ))}

              <div className="p-4 flex items-center font-medium text-sm">Visit</div>
              {selected.map(bm => (
                <div key={`${bm.id}-visit`} className="p-4 border-l text-center">
                  {bm.affiliateUrl ? (
                    <a href={bm.affiliateUrl} target="_blank" rel="noopener noreferrer nofollow">
                      <Button size="sm" data-testid={`button-compare-visit-${bm.slug}`}>
                        Visit <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
