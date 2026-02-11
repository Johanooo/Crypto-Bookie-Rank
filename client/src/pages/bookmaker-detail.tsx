import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { TrustScoreBadge, TrustScoreBar } from "@/components/trust-score-badge";
import { StarRating } from "@/components/star-rating";
import { ArrowRight, ArrowLeft, Check, X, Zap, Globe, Calendar, Shield, CreditCard, Clock, ExternalLink } from "lucide-react";
import { SiBitcoin, SiEthereum, SiLitecoin, SiDogecoin } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import type { Bookmaker, Bonus } from "@shared/schema";

function getCryptoIcon(crypto: string) {
  switch (crypto) {
    case "BTC": return <SiBitcoin className="w-4 h-4 text-yellow-400" />;
    case "ETH": return <SiEthereum className="w-4 h-4 text-blue-400" />;
    case "LTC": return <SiLitecoin className="w-4 h-4 text-gray-300" />;
    case "DOGE": return <SiDogecoin className="w-4 h-4 text-yellow-300" />;
    default: return <CreditCard className="w-4 h-4 text-muted-foreground" />;
  }
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-bold">{value.toFixed(1)}/10</span>
      </div>
      <Progress value={value * 10} className="h-2" />
    </div>
  );
}

export default function BookmakerDetail() {
  const params = useParams<{ slug: string }>();

  const { data: bookmaker, isLoading } = useQuery<Bookmaker>({
    queryKey: ["/api/bookmakers", params.slug],
  });

  const { data: bonuses } = useQuery<Bonus[]>({
    queryKey: ["/api/bonuses/bookmaker", bookmaker?.id],
    enabled: !!bookmaker?.id,
  });

  const handleVisitClick = async () => {
    if (!bookmaker) return;
    try {
      const res = await apiRequest("POST", `/api/bookmakers/${bookmaker.id}/click`);
      const data = await res.json();
      if (data.affiliateUrl) {
        window.open(data.affiliateUrl, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      if (bookmaker.affiliateUrl) {
        window.open(bookmaker.affiliateUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-md" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
          <Skeleton className="h-96 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (!bookmaker) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Bookmaker Not Found</h1>
        <Link href="/bookmakers">
          <Button data-testid="button-back-to-bookmakers"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Rankings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/bookmakers">
        <Button variant="ghost" className="mb-4" data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Rankings
        </Button>
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                <img src={bookmaker.logo} alt={bookmaker.name} className="w-12 h-12 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold" data-testid="text-bookmaker-name">{bookmaker.name}</h1>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <StarRating rating={bookmaker.overallRating} />
                      <TrustScoreBadge score={bookmaker.trustScore} />
                    </div>
                  </div>
                  {bookmaker.affiliateUrl && (
                    <Button onClick={handleVisitClick} data-testid="button-visit-site">
                      Visit Site <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground mt-3">{bookmaker.description}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Detailed Ratings</h2>
            <div className="space-y-4">
              <RatingBar label="Trust & Reliability" value={bookmaker.trustScore} />
              <RatingBar label="Odds Quality" value={bookmaker.oddsRating} />
              <RatingBar label="Bonus Value" value={bookmaker.bonusRating} />
              <RatingBar label="User Interface" value={bookmaker.uiRating} />
              <RatingBar label="Customer Support" value={bookmaker.supportRating} />
            </div>
          </Card>

          {bookmaker.longDescription && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Full Review</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{bookmaker.longDescription}</p>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Pros & Cons</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-emerald-500 mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Pros
                </h3>
                <ul className="space-y-2">
                  {bookmaker.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                  <X className="w-4 h-4" /> Cons
                </h3>
                <ul className="space-y-2">
                  {bookmaker.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {bonuses && bonuses.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Available Bonuses</h2>
              <div className="space-y-4">
                {bonuses.map((bonus) => (
                  <div key={bonus.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-bold">{bonus.title}</h3>
                        <p className="text-sm text-muted-foreground">{bonus.description}</p>
                      </div>
                      <span className="text-lg font-bold text-primary">{bonus.value}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      {bonus.bonusCode && (
                        <Badge variant="secondary" className="font-mono text-xs">{bonus.bonusCode}</Badge>
                      )}
                      {bonus.wagerRequirement && <span>Wager: {bonus.wagerRequirement}</span>}
                      {bonus.minDeposit && <span>Min Deposit: {bonus.minDeposit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span>Payout Speed</span>
                </div>
                <span className="text-sm font-semibold">{bookmaker.payoutSpeed}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span>Min Deposit</span>
                </div>
                <span className="text-sm font-semibold">{bookmaker.minDeposit}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span>Max Payout</span>
                </div>
                <span className="text-sm font-semibold">{bookmaker.maxPayout}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Established</span>
                </div>
                <span className="text-sm font-semibold">{bookmaker.established || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>License</span>
                </div>
                <span className="text-sm font-semibold">{bookmaker.license || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </div>
                <a href={bookmaker.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary">
                  Visit
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Trust Score</h3>
            <TrustScoreBadge score={bookmaker.trustScore} size="lg" />
            <div className="mt-4">
              <TrustScoreBar score={bookmaker.trustScore} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-3">Accepted Cryptos</h3>
            <div className="flex flex-wrap gap-2">
              {bookmaker.cryptosAccepted.map((crypto) => (
                <Badge key={crypto} variant="outline" className="gap-1.5">
                  {getCryptoIcon(crypto)}
                  {crypto}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-3">Sports Covered</h3>
            <div className="flex flex-wrap gap-2">
              {bookmaker.sportsCovered.map((sport) => (
                <Badge key={sport} variant="secondary">{sport}</Badge>
              ))}
            </div>
          </Card>

          {bookmaker.affiliateUrl && (
            <Button onClick={handleVisitClick} className="w-full" size="lg" data-testid="button-visit-bottom">
              Visit {bookmaker.name} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
