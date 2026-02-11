import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Calendar, ArrowRight, ChevronRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">
          <BookOpen className="w-3 h-3 mr-1" />
          Guides & News
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold" data-testid="text-page-title">Crypto Betting Blog</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Expert guides, news, and tips for crypto sports betting</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <Card key={post.id} className="hover-elevate overflow-visible p-0" data-testid={`card-blog-${post.slug}`}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs capitalize">{post.category}</Badge>
                  {post.publishedAt && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" className="w-full" data-testid={`button-read-${post.slug}`}>
                    Read Article <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
          {posts?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
