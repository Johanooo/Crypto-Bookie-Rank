import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from "@/lib/theme";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Bookmakers from "@/pages/bookmakers";
import BookmakerDetail from "@/pages/bookmaker-detail";
import Compare from "@/pages/compare";
import Bonuses from "@/pages/bonuses";
import Blog from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import Admin from "@/pages/admin";
import { Trophy, GitCompare, Gift, BookOpen, Settings, Sun, Moon, Menu, X } from "lucide-react";
import { SiBitcoin } from "react-icons/si";
import { useState, useEffect } from "react";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle">
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}

function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: <SiBitcoin className="w-4 h-4" /> },
    { href: "/bookmakers", label: "Rankings", icon: <Trophy className="w-4 h-4" /> },
    { href: "/compare", label: "Compare", icon: <GitCompare className="w-4 h-4" /> },
    { href: "/bonuses", label: "Bonuses", icon: <Gift className="w-4 h-4" /> },
    { href: "/blog", label: "Blog", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-[9999] bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-14">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
              <img src="/logo.png" alt="BetWithoutKYC" className="w-8 h-8 rounded-md" />
              <span className="font-bold text-lg hidden sm:block gold-gradient-text">BetWithoutKYC</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 toggle-elevate ${location === link.href ? "toggle-elevated" : ""}`}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="nav-admin">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t pb-3 pt-2 space-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${location === link.href ? "bg-muted" : ""}`}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`nav-mobile-${link.label.toLowerCase()}`}
                >
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 mt-12 sm:mt-16" style={{ background: "linear-gradient(180deg, hsl(222 35% 8%) 0%, hsl(222 40% 5%) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="BetWithoutKYC" className="w-8 h-8 rounded-md" />
              <span className="font-bold text-lg gold-gradient-text">BetWithoutKYC</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The most trusted crypto sportsbook review platform. Expert ratings, trust scores, and exclusive bonuses.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/bookmakers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rankings</Link></li>
              <li><Link href="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compare</Link></li>
              <li><Link href="/bonuses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bonuses</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog/how-to-spot-crypto-betting-scams" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Scam Guide</Link></li>
              <li><Link href="/blog/understanding-crypto-betting-bonuses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bonus Guide</Link></li>
              <li><Link href="/blog/top-5-crypto-sportsbooks-2026" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Top 5 2026</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Trust & Safety</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Every bookmaker is rated 0-10 on our Trust Score. We protect bettors from scams.
            </p>
            <p className="text-sm text-muted-foreground">
              18+ Gamble Responsibly
            </p>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-muted-foreground">
            2026 BetWithoutKYC. All rights reserved. Affiliate disclosure: We may earn commissions from qualifying purchases.
          </p>
          <p className="text-xs text-muted-foreground">
            Gambling can be addictive. Please play responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/bookmakers" component={Bookmakers} />
        <Route path="/bookmaker/:slug" component={BookmakerDetail} />
        <Route path="/compare" component={Compare} />
        <Route path="/bonuses" component={Bonuses} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
