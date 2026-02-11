import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { StarRating } from "@/components/star-rating";
import { ArrowRight, Shield, Zap, Trophy, TrendingUp, Gift, Search, ChevronRight } from "lucide-react";
import { SiBitcoin, SiEthereum, SiLitecoin, SiDogecoin } from "react-icons/si";
import type { Bookmaker, Bonus } from "@shared/schema";

function HeroSection() {
  return (
    <section className="relative overflow-visible hero-gradient py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chart-4/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <Badge variant="outline" className="mb-6 bg-primary/10 border-primary/30 text-primary">
          Trusted by 50,000+ Crypto Bettors
        </Badge>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Find the Best
          <span className="block bg-gradient-to-r from-primary via-emerald-400 to-chart-4 bg-clip-text text-transparent">
            Crypto Sportsbooks
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Expert reviews, trust scores, and exclusive bonuses. We rate every crypto bookmaker
          so you can bet with confidence.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link href="/bookmakers">
            <Button size="lg" data-testid="button-view-rankings">
              <Trophy className="w-4 h-4 mr-2" />
              View Rankings
            </Button>
          </Link>
          <Link href="/compare">
            <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-sm text-white border-white/20" data-testid="button-compare">
              Compare Bookmakers
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap text-gray-400 text-sm">
          <div className="flex items-center gap-1.5">
            <SiBitcoin className="w-4 h-4 text-yellow-400" />
            <span>Bitcoin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SiEthereum className="w-4 h-4 text-blue-400" />
            <span>Ethereum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SiLitecoin className="w-4 h-4 text-gray-300" />
            <span>Litecoin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SiDogecoin className="w-4 h-4 text-yellow-300" />
            <span>Dogecoin</span>
          </div>
          <span className="text-muted-foreground">& 50+ more</span>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { icon: <Shield className="w-5 h-5 text-primary" />, value: "7+", label: "Reviewed Bookmakers" },
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, value: "$25M+", label: "Bonuses Tracked" },
    { icon: <TrendingUp className="w-5 h-5 text-chart-4" />, value: "50K+", label: "Monthly Visitors" },
    { icon: <Gift className="w-5 h-5 text-accent" />, value: "20+", label: "Exclusive Deals" },
  ];

  return (
    <section className="border-b bg-card">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookmakerCard({ bookmaker, rank }: { bookmaker: Bookmaker; rank: number }) {
  return (
    <Card className="hover-elevate overflow-visible p-0" data-testid={`card-bookmaker-${bookmaker.slug}`}>
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            {rank <= 3 && (
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold z-10">
                {rank}
              </div>
            )}
            <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center overflow-hidden">
              <img src={bookmaker.logo} alt={bookmaker.name} className="w-10 h-10 object-contain" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="font-bold text-lg leading-tight">{bookmaker.name}</h3>
                <div className="mt-1">
                  <StarRating rating={bookmaker.overallRating} />
                </div>
              </div>
              <TrustScoreBadge score={bookmaker.trustScore} size="sm" />
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{bookmaker.description}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {bookmaker.payoutSpeed}
              </Badge>
              {bookmaker.cryptosAccepted.slice(0, 3).map((crypto) => (
                <Badge key={crypto} variant="outline" className="text-xs">
                  {crypto}
                </Badge>
              ))}
              {bookmaker.cryptosAccepted.length > 3 && (
                <span className="text-xs text-muted-foreground">+{bookmaker.cryptosAccepted.length - 3}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Link href={`/bookmaker/${bookmaker.slug}`} className="flex-1">
            <Button variant="outline" className="w-full" data-testid={`button-review-${bookmaker.slug}`}>
              Read Review
            </Button>
          </Link>
          {bookmaker.affiliateUrl && (
            <a href={bookmaker.affiliateUrl} target="_blank" rel="noopener noreferrer nofollow" className="flex-1">
              <Button className="w-full" data-testid={`button-visit-${bookmaker.slug}`}>
                Visit Site <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function TopBookmakers() {
  const { data: bookmakers, isLoading } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers"],
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <Badge variant="secondary" className="mb-2">
            <Trophy className="w-3 h-3 mr-1" />
            Rankings
          </Badge>
          <h2 className="text-3xl font-bold">Top Crypto Bookmakers</h2>
          <p className="text-muted-foreground mt-1">Ranked by our expert team based on trust, odds, and user experience</p>
        </div>
        <Link href="/bookmakers">
          <Button variant="ghost" data-testid="button-view-all">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-14 h-14 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmakers?.slice(0, 6).map((bm, i) => (
            <BookmakerCard key={bm.id} bookmaker={bm} rank={i + 1} />
          ))}
        </div>
      )}
    </section>
  );
}

function BonusShowcase() {
  const { data: bonuses, isLoading } = useQuery<Bonus[]>({
    queryKey: ["/api/bonuses"],
  });

  const { data: bookmakers } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers"],
  });

  const getBookmakerName = (id: string) => bookmakers?.find(b => b.id === id)?.name || "Unknown";
  const getBookmakerSlug = (id: string) => bookmakers?.find(b => b.id === id)?.slug || "";

  return (
    <section className="bg-card border-y">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <Badge variant="secondary" className="mb-2">
              <Gift className="w-3 h-3 mr-1" />
              Bonuses
            </Badge>
            <h2 className="text-3xl font-bold">Latest Crypto Bonuses</h2>
            <p className="text-muted-foreground mt-1">Exclusive bonus offers from top-rated bookmakers</p>
          </div>
          <Link href="/bonuses">
            <Button variant="ghost" data-testid="button-view-all-bonuses">
              All Bonuses <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bonuses?.slice(0, 6).map((bonus) => (
              <Card key={bonus.id} className="hover-elevate overflow-visible p-4" data-testid={`card-bonus-${bonus.id}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{bonus.bonusType}</Badge>
                  <span className="text-xs text-muted-foreground">{getBookmakerName(bonus.bookmakerId)}</span>
                </div>
                <h3 className="font-bold mb-1">{bonus.title}</h3>
                <p className="text-2xl font-bold text-primary mb-2">{bonus.value}</p>
                <p className="text-sm text-muted-foreground mb-3">{bonus.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  {bonus.bonusCode && (
                    <Badge variant="secondary" className="font-mono text-xs">{bonus.bonusCode}</Badge>
                  )}
                  {bonus.wagerRequirement && <span>Wager: {bonus.wagerRequirement}</span>}
                </div>
                <Link href={`/bookmaker/${getBookmakerSlug(bonus.bookmakerId)}`}>
                  <Button variant="outline" className="w-full" data-testid={`button-claim-${bonus.id}`}>
                    Claim Bonus <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-2">
          <Shield className="w-3 h-3 mr-1" />
          Trust & Safety
        </Badge>
        <h2 className="text-3xl font-bold mb-3">Our Trust Score System</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every bookmaker is rated on a 0-10 scale based on payout reliability, user reports, and our expert testing.
          We protect bettors by exposing unreliable operators.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="w-12 h-12 rounded-md bg-emerald-500/10 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">Verified Payouts</h3>
          <p className="text-sm text-muted-foreground">
            We test every bookmaker's withdrawal process with real funds. Instant payouts earn higher trust scores.
          </p>
        </Card>
        <Card className="p-6">
          <div className="w-12 h-12 rounded-md bg-chart-4/10 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-chart-4" />
          </div>
          <h3 className="font-bold text-lg mb-2">Transparency Reports</h3>
          <p className="text-sm text-muted-foreground">
            Licensing, ownership, and complaint history are all factored into our comprehensive trust assessments.
          </p>
        </Card>
        <Card className="p-6">
          <div className="w-12 h-12 rounded-md bg-red-500/10 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">Scam Warnings</h3>
          <p className="text-sm text-muted-foreground">
            Bookmakers that fail to pay out or engage in shady practices receive a 0 trust score and public warning.
          </p>
        </Card>
      </div>
    </section>
  );
}

function ShieldAlert(props: { className?: string }) {
  return <ShieldX {...props} />;
}

import { ShieldX } from "lucide-react";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <TopBookmakers />
      <BonusShowcase />
      <TrustSection />
    </div>
  );
}
