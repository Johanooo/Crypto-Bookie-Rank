import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { StarRating } from "@/components/star-rating";
import { ArrowRight, Shield, Zap, Trophy, TrendingUp, Gift, Search, ChevronRight, ShieldX, Star, Crown } from "lucide-react";
import { SiBitcoin, SiEthereum, SiLitecoin, SiDogecoin } from "react-icons/si";
import type { Bookmaker, Bonus } from "@shared/schema";
import { useEffect, useRef } from "react";

const SPARKLE_POSITIONS = [
  { x: 5, y: 8, dur: 2.2, del: 0.1 }, { x: 15, y: 22, dur: 3.1, del: 1.2 },
  { x: 25, y: 12, dur: 2.8, del: 0.5 }, { x: 35, y: 35, dur: 3.5, del: 2.1 },
  { x: 45, y: 18, dur: 2.5, del: 0.8 }, { x: 55, y: 42, dur: 3.2, del: 1.5 },
  { x: 65, y: 10, dur: 2.9, del: 0.3 }, { x: 75, y: 28, dur: 3.4, del: 2.5 },
  { x: 85, y: 15, dur: 2.6, del: 1.8 }, { x: 92, y: 38, dur: 3.0, del: 0.7 },
  { x: 10, y: 55, dur: 2.3, del: 3.0 }, { x: 22, y: 68, dur: 3.3, del: 1.0 },
  { x: 38, y: 60, dur: 2.7, del: 2.3 }, { x: 48, y: 75, dur: 3.1, del: 0.2 },
  { x: 58, y: 52, dur: 2.4, del: 3.5 }, { x: 70, y: 70, dur: 3.6, del: 1.4 },
  { x: 80, y: 58, dur: 2.8, del: 2.8 }, { x: 88, y: 65, dur: 3.2, del: 0.9 },
  { x: 30, y: 80, dur: 2.5, del: 4.0 }, { x: 62, y: 85, dur: 3.0, del: 1.7 },
];

const SPARKLE_LARGE_POSITIONS = [
  { x: 12, y: 20, dur: 3.5, del: 0.5 }, { x: 28, y: 45, dur: 4.0, del: 1.2 },
  { x: 42, y: 15, dur: 3.8, del: 2.0 }, { x: 58, y: 55, dur: 4.2, del: 0.8 },
  { x: 72, y: 30, dur: 3.6, del: 3.0 }, { x: 85, y: 48, dur: 4.1, del: 1.5 },
  { x: 18, y: 72, dur: 3.9, del: 2.5 }, { x: 78, y: 78, dur: 4.3, del: 0.3 },
];

function GoldSparkles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {SPARKLE_POSITIONS.map((s, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animation: `sparkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.del}s`,
          }}
        />
      ))}
      {SPARKLE_LARGE_POSITIONS.map((s, i) => (
        <div
          key={`lg-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            background: `radial-gradient(circle, hsl(51 100% 80%) 0%, transparent 70%)`,
            animation: `sparkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.del}s`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingSportsIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg className="absolute top-[15%] left-[8%] w-12 h-12 text-primary/[0.12] animate-float-slow drop-shadow-[0_0_8px_hsl(51_100%_50%/0.15)]" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13 7.5V5.3zm-3.35-.95L11 5.3V7.5L7.01 9.49l-1.35-.46-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.08 17.11l-1.14.1C4.73 15.81 4 13.99 4 12c0-.12.01-.23.02-.35l1-.73 1.38.48 1.46 4.34-.78 1.37zm7.42 2.48c-.79.26-1.63.41-2.5.41s-1.71-.15-2.5-.41l-.69-1.49.64-1.1h5.11l.64 1.11-.7 1.48zM14.27 15H9.73l-1.35-4.02L12 8.44l3.63 2.54L14.27 15zm3.79 2.21l-1.14-.1-.78-1.37 1.46-4.34 1.38-.48 1 .73c.01.12.02.23.02.35 0 1.99-.73 3.81-1.94 5.21z" />
      </svg>

      <svg className="absolute top-[20%] right-[10%] w-10 h-10 text-primary/[0.1] animate-float-medium drop-shadow-[0_0_6px_hsl(51_100%_50%/0.12)]" style={{ animationDelay: "1s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M6 12a6 6 0 0 0 12 0M6 12a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </svg>

      <svg className="absolute bottom-[25%] left-[12%] w-8 h-8 text-primary/[0.15] animate-float-fast drop-shadow-[0_0_10px_hsl(51_100%_50%/0.2)]" style={{ animationDelay: "2s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>

      <svg className="absolute top-[50%] right-[5%] w-14 h-14 text-primary/[0.06] animate-float-slow" style={{ animationDelay: "3s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>

      <svg className="absolute bottom-[35%] right-[18%] w-6 h-6 text-primary/[0.15] animate-float-medium drop-shadow-[0_0_8px_hsl(51_100%_50%/0.15)]" style={{ animationDelay: "4s" }} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>

      <svg className="absolute top-[65%] left-[5%] w-10 h-10 text-primary/[0.08] animate-float-medium" style={{ animationDelay: "1.5s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
      </svg>
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericPart = target.replace(/[^0-9.]/g, "");
          const prefix = target.replace(/[0-9.].*/g, "");
          const end = parseFloat(numericPart);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * end);
            if (el) el.textContent = `${prefix}${current}${suffix}`;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <span ref={ref}>0</span>;
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[560px] sm:min-h-[620px] md:min-h-[680px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url(/hero-stadium.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(222_40%_6%/0.6)_100%)]" />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="absolute top-[5%] left-[15%] w-72 h-72 bg-primary/15 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[200px] bg-primary/8 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <FloatingSportsIcons />
      <GoldSparkles />

      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 md:py-28 text-center w-full">
        <div className="inline-flex items-center gap-2 mb-8">
          <Badge variant="outline" className="bg-primary/15 border-primary/40 text-primary backdrop-blur-sm px-4 py-1.5" data-testid="badge-hero-tagline">
            <Crown className="w-3.5 h-3.5 mr-1.5" />
            Trusted by 50,000+ No-KYC Bettors
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2 leading-[1.1] tracking-tight">
          Find the Best
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 leading-[1.1] tracking-tight gold-gradient-text py-2">
          No-KYC Sportsbooks
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          Expert reviews, trust scores, and exclusive bonuses. We rate every no-KYC crypto bookmaker
          so you can bet privately and with confidence.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link href="/bookmakers">
            <Button size="lg" className="btn-glow text-base px-8" data-testid="button-view-rankings">
              <Trophy className="w-5 h-5 mr-2" />
              View Rankings
            </Button>
          </Link>
          <Link href="/compare">
            <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-md text-white border-white/20 text-base px-8" data-testid="button-compare">
              Compare Bookmakers
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-5 flex-wrap text-gray-400 text-sm">
          <div className="flex items-center gap-1.5">
            <SiBitcoin className="w-4 h-4 text-[#f7931a]" />
            <span>Bitcoin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SiEthereum className="w-4 h-4 text-[#627eea]" />
            <span>Ethereum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SiLitecoin className="w-4 h-4 text-[#bfbbbb]" />
            <span>Litecoin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SiDogecoin className="w-4 h-4 text-[#c2a633]" />
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
    { icon: <Shield className="w-5 h-5 text-primary" />, value: "7", suffix: "+", label: "Reviewed Bookmakers" },
    { icon: <Zap className="w-5 h-5 text-primary" />, value: "$25", suffix: "M+", label: "Bonuses Tracked" },
    { icon: <TrendingUp className="w-5 h-5 text-primary" />, value: "50", suffix: "K+", label: "Monthly Visitors" },
    { icon: <Gift className="w-5 h-5 text-primary" />, value: "20", suffix: "+", label: "Exclusive Deals" },
  ];

  return (
    <section className="relative border-b border-border/50 section-glow" style={{ background: "linear-gradient(180deg, hsl(222 35% 8%) 0%, hsl(var(--background)) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3" data-testid={`stat-${i}`}>
              <div className="flex items-center justify-center w-11 h-11 rounded-md bg-primary/10 border border-primary/20">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold gold-gradient-text">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
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
      className={`hover-elevate overflow-visible p-0 ${isTopRank ? "gold-shimmer-border gold-glow" : ""}`}
      data-testid={`card-bookmaker-${bookmaker.slug}`}
    >
      {isTopRank && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground no-default-hover-elevate no-default-active-elevate shadow-lg gold-glow">
            <Crown className="w-3 h-3 mr-1" />
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
            <div className={`w-16 h-16 rounded-md flex items-center justify-center overflow-hidden ${isTopRank ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted"}`}>
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
    <section className="relative max-w-6xl mx-auto px-4 py-12 sm:py-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="relative">
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <Badge variant="secondary" className="mb-3">
              <Trophy className="w-3 h-3 mr-1" />
              Rankings
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Top Crypto <span className="gold-gradient-text">Bookmakers</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Ranked by our expert team based on trust, odds, and user experience</p>
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
      </div>
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
    <section className="relative border-y border-border/50 section-glow" style={{ background: "linear-gradient(180deg, hsl(222 35% 8%) 0%, hsl(var(--background)) 50%, hsl(222 35% 8%) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <Badge variant="secondary" className="mb-3">
              <Gift className="w-3 h-3 mr-1" />
              Bonuses
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Latest Crypto <span className="gold-gradient-text">Bonuses</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Exclusive bonus offers from top-rated bookmakers</p>
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
                <p className="text-2xl font-bold gold-gradient-text mb-2">{bonus.value}</p>
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
  const features = [
    {
      icon: <Shield className="w-7 h-7 text-primary" />,
      title: "Verified Payouts",
      description: "We test every bookmaker's withdrawal process with real funds. Instant payouts earn higher trust scores.",
      glow: "bg-primary/10 border-primary/20",
    },
    {
      icon: <Search className="w-7 h-7 text-chart-4" />,
      title: "Transparency Reports",
      description: "Licensing, ownership, and complaint history are all factored into our comprehensive trust assessments.",
      glow: "bg-chart-4/10 border-chart-4/20",
    },
    {
      icon: <ShieldX className="w-7 h-7 text-red-500" />,
      title: "Scam Warnings",
      description: "Bookmakers that fail to pay out or engage in shady practices receive a 0 trust score and public warning.",
      glow: "bg-red-500/10 border-red-500/20",
    },
  ];

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-12 sm:py-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />
      <div className="relative">
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="secondary" className="mb-3">
            <Shield className="w-3 h-3 mr-1" />
            Trust & Safety
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Our Trust <span className="gold-gradient-text">Score System</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every bookmaker is rated on a 0-10 scale based on payout reliability, user reports, and our expert testing.
            We protect bettors by exposing unreliable operators.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="p-6 hover-elevate overflow-visible" data-testid={`card-trust-feature-${i}`}>
              <div className={`w-14 h-14 rounded-md ${feature.glow} border flex items-center justify-center mb-5`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
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
