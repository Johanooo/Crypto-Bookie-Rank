import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Gift, Search, Clock, Tag } from "lucide-react";
import type { Bonus, Bookmaker } from "@shared/schema";

export default function Bonuses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: bonuses, isLoading } = useQuery<Bonus[]>({
    queryKey: ["/api/bonuses"],
  });

  const { data: bookmakers } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers"],
  });

  const getBookmaker = (id: string) => bookmakers?.find(b => b.id === id);

  const filtered = bonuses?.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || b.bonusType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/50" style={{ background: "linear-gradient(160deg, hsl(222 50% 5%) 0%, hsl(220 40% 10%) 50%, hsl(222 45% 7%) 100%)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 relative">
          <Badge variant="secondary" className="mb-3">
            <Gift className="w-3 h-3 mr-1" />
            Bonuses
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" data-testid="text-page-title">Crypto Betting Bonuses</h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-2xl">Exclusive bonus offers from the top crypto sportsbooks</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bonuses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-bonuses"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="sm:w-[180px]" data-testid="select-filter-type">
              <Tag className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="welcome">Welcome Bonus</SelectItem>
              <SelectItem value="reload">Reload</SelectItem>
              <SelectItem value="cashback">Cashback</SelectItem>
              <SelectItem value="freebet">Free Bet</SelectItem>
              <SelectItem value="odds_boost">Odds Boost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered?.map((bonus) => {
              const bm = getBookmaker(bonus.bookmakerId);
              return (
                <Card key={bonus.id} className="hover-elevate overflow-visible p-4" data-testid={`card-bonus-${bonus.id}`}>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="outline" className="text-xs capitalize">{bonus.bonusType.replace("_", " ")}</Badge>
                    {bm && (
                      <div className="flex items-center gap-2">
                        <img src={bm.logo} alt={bm.name} className="w-5 h-5" />
                        <span className="text-sm font-medium">{bm.name}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{bonus.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">{bonus.value}</p>
                  <p className="text-sm text-muted-foreground mb-4">{bonus.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
                    {bonus.bonusCode && (
                      <Badge variant="secondary" className="font-mono text-xs">{bonus.bonusCode}</Badge>
                    )}
                    {bonus.wagerRequirement && <span>Wager: {bonus.wagerRequirement}</span>}
                    {bonus.minDeposit && <span>Min: {bonus.minDeposit}</span>}
                    {bonus.expiresAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Expires: {bonus.expiresAt}
                      </span>
                    )}
                  </div>
                  {bm && (
                    <Link href={`/bookmaker/${bm.slug}`}>
                      <Button variant="outline" className="w-full" data-testid={`button-claim-${bonus.id}`}>
                        Claim Bonus <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </Card>
              );
            })}
            {filtered?.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No bonuses found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
