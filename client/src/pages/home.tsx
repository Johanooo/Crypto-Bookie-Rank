import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { StarRating } from "@/components/star-rating";
import { ArrowRight, Shield, Zap, Trophy, TrendingUp, Gift, Search, ChevronRight, ShieldX } from "lucide-react";
import { SiBitcoin, SiEthereum, SiLitecoin, SiDogecoin } from "react-icons/si";
import type { Bookmaker, Bonus } from "@shared/schema";

function FloatingSportsIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg className="absolute top-[15%] left-[8%] w-12 h-12 text-white/[0.07] animate-float-slow" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13 7.5V5.3zm-3.35-.95L11 5.3V7.5L7.01 9.49l-1.35-.46-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.08 17.11l-1.14.1C4.73 15.81 4 13.99 4 12c0-.12.01-.23.02-.35l1-.73 1.38.48 1.46 4.34-.78 1.37zm7.42 2.48c-.79.26-1.63.41-2.5.41s-1.71-.15-2.5-.41l-.69-1.49.64-1.1h5.11l.64 1.11-.7 1.48zM14.27 15H9.73l-1.35-4.02L12 8.44l3.63 2.54L14.27 15zm3.79 2.21l-1.14-.1-.78-1.37 1.46-4.34 1.38-.48 1 .73c.01.12.02.23.02.35 0 1.99-.73 3.81-1.94 5.21z" />
      </svg>

      <svg className="absolute top-[25%] right-[12%] w-10 h-10 text-white/[0.06] animate-float-medium" style={{ animationDelay: "1s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M12 6c-1.1 0-2 .9-2 2v4l3.5 3.5 1.41-1.41L12 11.17V8c0-1.1-.9-2-2-2z" opacity="0" />
        <path d="M6 12a6 6 0 0 0 12 0M6 12a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </svg>

      <svg className="absolute bottom-[20%] left-[15%] w-8 h-8 text-primary/[0.12] animate-float-fast" style={{ animationDelay: "2s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>

      <svg className="absolute top-[45%] right-[6%] w-14 h-14 text-white/[0.04] animate-float-slow" style={{ animationDelay: "3s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>

      <svg className="absolute bottom-[30%] right-[20%] w-6 h-6 text-primary/[0.1] animate-float-medium" style={{ animationDelay: "4s" }} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>

      <svg className="absolute top-[60%] left-[5%] w-10 h-10 text-white/[0.05] animate-float-medium" style={{ animationDelay: "1.5s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
      </svg>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[520px] sm:min-h-[560px] md:min-h-[600px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/hero-stadium.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(222_40%_6%/0.5)_100%)]" />

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="absolute top-[10%] left-[10%] w-48 h-48 bg-primary/10 rounded-full blur-[80px] animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[15%] w-64 h-64 bg-accent/8 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <FloatingSportsIcons />

      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 md:py-24 text-center w-full">
        <Badge variant="outline" className="mb-6 bg-primary/10 border-primary/30 text-primary backdrop-blur-sm" data-testid="badge-hero-tagline">
          <Trophy className="w-3 h-3 mr-1" />
          Trusted by 50,000+ No-KYC Bettors
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
          Find the Best
          <span className="block gold-gradient-text py-1">
            No-KYC Sportsbooks
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Expert reviews, trust scores, and exclusive bonuses. We rate every no-KYC crypto bookmaker
          so you can bet privately and with confidence.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link href="/bookmakers">
            <Button size="lg" className="btn-glow" data-testid="button-view-rankings">
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
    <section className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3" data-testid={`stat-${i}`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted/50">
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
  const isTopRank = rank === 1;
  const isTopThree = rank <= 3;

  return (
    <Card
      className={`hover-elevate overflow-visible p-0 ${isTopRank ? "gold-border-glow" : ""}`}
      data-testid={`card-bookmaker-${bookmaker.slug}`}
    >
      {isTopRank && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground no-default-hover-elevate no-default-active-elevate shadow-lg">
            <Trophy className="w-3 h-3 mr-1" />
            #1 Ranked
          </Badge>
        </div>
      )}
      <div className="p-4 pt-5">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            {isTopThree && !isTopRank && (
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold z-10">
                {rank}
              </div>
            )}
            <div className={`w-16 h-16 rounded-md flex items-center justify-center overflow-hidden ${isTopRank ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted"}`}>
              <img src={bookmaker.logo} alt={bookmaker.name} className="w-12 h-12 object-contain" />
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
              <Button className={`w-full ${isTopRank ? "btn-glow" : ""}`} data-testid={`button-visit-${bookmaker.slug}`}>
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
    <section className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <Badge variant="secondary" className="mb-2">
            <Trophy className="w-3 h-3 mr-1" />
            Rankings
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold">Top Crypto Bookmakers</h2>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Ranked by our expert team based on trust, odds, and user experience</p>
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
                <Skeleton className="w-16 h-16 rounded-md" />
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    <section className="border-y border-border/50 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <Badge variant="secondary" className="mb-2">
              <Gift className="w-3 h-3 mr-1" />
              Bonuses
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">Latest Crypto Bonuses</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Exclusive bonus offers from top-rated bookmakers</p>
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
    <section className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <Badge variant="secondary" className="mb-2">
          <Shield className="w-3 h-3 mr-1" />
          Trust & Safety
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Our Trust Score System</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every bookmaker is rated on a 0-10 scale based on payout reliability, user reports, and our expert testing.
          We protect bettors by exposing unreliable operators.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
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
            <ShieldX className="w-6 h-6 text-red-500" />
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
