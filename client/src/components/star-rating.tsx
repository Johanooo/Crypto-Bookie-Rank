import { Star, StarHalf } from "lucide-react";

export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  const scaled = (rating / 10) * max;
  const full = Math.floor(scaled);
  const hasHalf = scaled - full >= 0.25;
  const empty = max - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" data-testid="star-rating">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-primary text-primary" />
      ))}
      {hasHalf && <StarHalf className="w-4 h-4 fill-primary text-primary" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />
      ))}
      <span className="ml-1 text-sm font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}
