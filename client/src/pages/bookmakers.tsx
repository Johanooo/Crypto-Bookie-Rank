import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { StarRating } from "@/components/star-rating";
import { Search, ArrowRight, Zap, Trophy, Filter } from "lucide-react";
import type { Bookmaker } from "@shared/schema";

export default function Bookmakers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [filterTrust, setFilterTrust] = useState("all");

  const { data: bookmakers, isLoading } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers"],
  });

  const filtered = bookmakers?.filter((bm) => {
    const matchesSearch = bm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrust = filterTrust === "all" ||
      (filterTrust === "excellent" && bm.trustScore >= 9) ||
      (filterTrust === "good" && bm.trustScore >= 7 && bm.trustScore < 9) ||
      (filterTrust === "average" && bm.trustScore >= 5 && bm.trustScore < 7) ||
      (filterTrust === "poor" && bm.trustScore < 5);
    return matchesSearch && matchesTrust;
  }).sort((a, b) => {
    if (sortBy === "rank") return a.rank - b.rank;
    if (sortBy === "rating") return b.overallRating - a.overallRating;
    if (sortBy === "trust") return b.trustScore - a.trustScore;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">
          <Trophy className="w-3 h-3 mr-1" />
          Full Rankings
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold" data-testid="text-page-title">All Crypto Bookmakers</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Compare ratings, trust scores, and find the perfect bookmaker</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmakers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1 sm:w-[160px]" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="trust">Trust Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTrust} onValueChange={setFilterTrust}>
            <SelectTrigger className="flex-1 sm:w-[160px]" data-testid="select-filter-trust">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Trust" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trust Levels</SelectItem>
              <SelectItem value="excellent">Excellent (9+)</SelectItem>
              <SelectItem value="good">Good (7-9)</SelectItem>
              <SelectItem value="average">Average (5-7)</SelectItem>
              <SelectItem value="poor">Poor (&lt;5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-14 h-14 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered?.map((bm, i) => (
            <Card key={bm.id} className="hover-elevate overflow-visible p-0" data-testid={`card-bookmaker-list-${bm.slug}`}>
              <div className="p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 text-center w-6 sm:w-8 pt-1">
                    <span className="text-sm sm:text-lg font-bold text-muted-foreground">#{bm.rank}</span>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={bm.logo} alt={bm.name} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg">{bm.name}</h3>
                        <div className="flex items-center gap-2 sm:gap-3 mt-0.5 flex-wrap">
                          <StarRating rating={bm.overallRating} />
                          <TrustScoreBadge score={bm.trustScore} size="sm" />
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" /> {bm.payoutSpeed}
                        </Badge>
                        {bm.featured && <Badge className="text-xs">Featured</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1 hidden sm:block">{bm.description}</p>
                    <div className="flex items-center gap-2 mt-2 sm:hidden flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" /> {bm.payoutSpeed}
                      </Badge>
                      {bm.featured && <Badge className="text-xs">Featured</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pl-9 sm:pl-0 sm:justify-end">
                  <Link href={`/bookmaker/${bm.slug}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" className="w-full sm:w-auto" data-testid={`button-review-${bm.slug}`}>
                      Review
                    </Button>
                  </Link>
                  {bm.affiliateUrl && (
                    <a href={bm.affiliateUrl} target="_blank" rel="noopener noreferrer nofollow" className="flex-1 sm:flex-none">
                      <Button className="w-full sm:w-auto" data-testid={`button-visit-${bm.slug}`}>
                        Visit <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {filtered?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bookmakers found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
