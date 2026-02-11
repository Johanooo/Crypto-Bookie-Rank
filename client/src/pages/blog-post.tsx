import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", params.slug],
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <Link href="/blog">
          <Button data-testid="button-back-blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/50" style={{ background: "linear-gradient(160deg, hsl(222 50% 5%) 0%, hsl(220 40% 10%) 50%, hsl(222 45% 7%) 100%)" }}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10 relative">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4 text-gray-400" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="outline" className="capitalize">{post.category}</Badge>
            {post.publishedAt && (
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3" data-testid="text-blog-title">{post.title}</h1>
          <p className="text-base sm:text-lg text-gray-400">{post.excerpt}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <Card className="p-6 md:p-8">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Card>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
