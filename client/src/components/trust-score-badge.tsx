import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function getTrustColor(score: number): string {
  if (score >= 9) return "bg-emerald-500 dark:bg-emerald-500 text-white shadow-[0_0_12px_hsl(145_60%_45%/0.3)]";
  if (score >= 7) return "bg-green-500 dark:bg-green-600 text-white";
  if (score >= 5) return "bg-yellow-500 dark:bg-yellow-600 text-white";
  if (score >= 3) return "bg-orange-500 dark:bg-orange-600 text-white";
  return "bg-red-600 dark:bg-red-700 text-white";
}

function getTrustIcon(score: number) {
  if (score >= 7) return <ShieldCheck className="w-3.5 h-3.5" />;
  if (score >= 5) return <Shield className="w-3.5 h-3.5" />;
  if (score >= 3) return <ShieldAlert className="w-3.5 h-3.5" />;
  return <ShieldX className="w-3.5 h-3.5" />;
}

function getTrustLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Very Good";
  if (score >= 5) return "Average";
  if (score >= 3) return "Poor";
  if (score > 0) return "Avoid";
  return "Unrated";
}

export function TrustScoreBadge({ score, size = "default" }: { score: number; size?: "sm" | "default" | "lg" }) {
  const colorClass = getTrustColor(score);
  const icon = getTrustIcon(score);
  const label = getTrustLabel(score);

  if (size === "sm") {
    return (
      <Badge className={`${colorClass} gap-1 no-default-hover-elevate no-default-active-elevate`} data-testid="badge-trust-score">
        {icon}
        <span>{score.toFixed(1)}</span>
      </Badge>
    );
  }

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center gap-1" data-testid="trust-score-large">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-md ${colorClass}`}>
          {icon}
          <span className="text-2xl font-bold">{score.toFixed(1)}</span>
          <span className="text-sm">/10</span>
        </div>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" data-testid="trust-score-default">
      <Badge className={`${colorClass} gap-1 no-default-hover-elevate no-default-active-elevate`}>
        {icon}
        <span>{score.toFixed(1)}</span>
      </Badge>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function TrustScoreBar({ score }: { score: number }) {
  const percentage = (score / 10) * 100;
  const colorClass = score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-yellow-500" : score >= 3 ? "bg-orange-500" : "bg-red-600";

  return (
    <div className="w-full" data-testid="trust-score-bar">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Trust Score</span>
        <span className="text-sm font-bold">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full h-2 rounded-md bg-muted overflow-hidden">
        <div
          className={`h-full rounded-md transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
