import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { StarRating } from "@/components/star-rating";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookmakerSchema, insertBonusSchema, insertBlogPostSchema } from "@shared/schema";
import { Settings, Plus, Pencil, Trash2, BarChart3, MousePointerClick, Trophy, Gift, BookOpen, Eye } from "lucide-react";
import { z } from "zod";
import type { Bookmaker, Bonus, BlogPost, AffiliateClick } from "@shared/schema";

function BookmakersTab() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: bookmakers, isLoading } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers/all"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/bookmakers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmakers/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmakers"] });
      toast({ title: "Bookmaker deleted" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/bookmakers/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmakers/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmakers"] });
      setEditingId(null);
      toast({ title: "Bookmaker updated" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold">Manage Bookmakers</h2>
        <AddBookmakerDialog />
      </div>

      <div className="space-y-3">
        {bookmakers?.map((bm) => (
          <Card key={bm.id} className="p-4" data-testid={`admin-card-${bm.slug}`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                <img src={bm.logo} alt={bm.name} className="w-7 h-7 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{bm.name}</span>
                  <Badge variant="outline" className="text-xs">Rank #{bm.rank}</Badge>
                  <TrustScoreBadge score={bm.trustScore} size="sm" />
                  {bm.featured && <Badge className="text-xs">Featured</Badge>}
                  {!bm.isActive && <Badge variant="destructive" className="text-xs">Inactive</Badge>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                  <span>Rating: {bm.overallRating}/10</span>
                  <span>Clicks: {bm.clickCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <EditBookmakerDialog bookmaker={bm} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(bm.id)}
                  data-testid={`button-delete-${bm.slug}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EditBookmakerDialog({ bookmaker }: { bookmaker: Bookmaker }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: bookmaker.name,
      overallRating: bookmaker.overallRating.toString(),
      trustScore: bookmaker.trustScore.toString(),
      trustScoreLabel: bookmaker.trustScoreLabel,
      oddsRating: bookmaker.oddsRating.toString(),
      bonusRating: bookmaker.bonusRating.toString(),
      uiRating: bookmaker.uiRating.toString(),
      supportRating: bookmaker.supportRating.toString(),
      rank: bookmaker.rank.toString(),
      featured: bookmaker.featured,
      isActive: bookmaker.isActive,
      affiliateUrl: bookmaker.affiliateUrl,
      payoutSpeed: bookmaker.payoutSpeed,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/bookmakers/${bookmaker.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmakers/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmakers"] });
      setOpen(false);
      toast({ title: "Bookmaker updated" });
    },
  });

  const onSubmit = (values: any) => {
    updateMutation.mutate({
      name: values.name,
      overallRating: parseFloat(values.overallRating),
      trustScore: parseFloat(values.trustScore),
      trustScoreLabel: values.trustScoreLabel,
      oddsRating: parseFloat(values.oddsRating),
      bonusRating: parseFloat(values.bonusRating),
      uiRating: parseFloat(values.uiRating),
      supportRating: parseFloat(values.supportRating),
      rank: parseInt(values.rank),
      featured: values.featured,
      isActive: values.isActive,
      affiliateUrl: values.affiliateUrl,
      payoutSpeed: values.payoutSpeed,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid={`button-edit-${bookmaker.slug}`}>
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {bookmaker.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Overall Rating</label>
              <Input type="number" step="0.1" min="0" max="10" {...form.register("overallRating")} data-testid="input-overall-rating" />
            </div>
            <div>
              <label className="text-sm font-medium">Trust Score</label>
              <Input type="number" step="0.1" min="0" max="10" {...form.register("trustScore")} data-testid="input-trust-score" />
            </div>
            <div>
              <label className="text-sm font-medium">Odds Rating</label>
              <Input type="number" step="0.1" min="0" max="10" {...form.register("oddsRating")} />
            </div>
            <div>
              <label className="text-sm font-medium">Bonus Rating</label>
              <Input type="number" step="0.1" min="0" max="10" {...form.register("bonusRating")} />
            </div>
            <div>
              <label className="text-sm font-medium">UI Rating</label>
              <Input type="number" step="0.1" min="0" max="10" {...form.register("uiRating")} />
            </div>
            <div>
              <label className="text-sm font-medium">Support Rating</label>
              <Input type="number" step="0.1" min="0" max="10" {...form.register("supportRating")} />
            </div>
            <div>
              <label className="text-sm font-medium">Rank</label>
              <Input type="number" min="1" {...form.register("rank")} data-testid="input-rank" />
            </div>
            <div>
              <label className="text-sm font-medium">Payout Speed</label>
              <Input {...form.register("payoutSpeed")} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Trust Score Label</label>
            <Input {...form.register("trustScoreLabel")} />
          </div>
          <div>
            <label className="text-sm font-medium">Affiliate URL</label>
            <Input {...form.register("affiliateUrl")} data-testid="input-affiliate-url" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.watch("featured")} onCheckedChange={(v) => form.setValue("featured", v)} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.watch("isActive")} onCheckedChange={(v) => form.setValue("isActive", v)} />
              Active
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={updateMutation.isPending} data-testid="button-save-bookmaker">
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddBookmakerDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      logo: "https://img.icons8.com/fluency/96/blockchain-technology.png",
      description: "",
      websiteUrl: "",
      affiliateUrl: "",
      overallRating: "5",
      trustScore: "5",
      rank: "10",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/bookmakers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmakers/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmakers"] });
      setOpen(false);
      form.reset();
      toast({ title: "Bookmaker added" });
    },
  });

  const onSubmit = (values: any) => {
    createMutation.mutate({
      ...values,
      overallRating: parseFloat(values.overallRating),
      trustScore: parseFloat(values.trustScore),
      rank: parseInt(values.rank),
      trustScoreLabel: "Unrated",
      oddsRating: 5,
      bonusRating: 5,
      uiRating: 5,
      supportRating: 5,
      payoutSpeed: "Unknown",
      minDeposit: "N/A",
      maxPayout: "N/A",
      cryptosAccepted: [],
      sportsCovered: [],
      pros: [],
      cons: [],
      featured: false,
      isActive: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-bookmaker">
          <Plus className="w-4 h-4 mr-2" /> Add Bookmaker
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bookmaker</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input {...form.register("name")} data-testid="input-name" />
          </div>
          <div>
            <label className="text-sm font-medium">Slug (URL-friendly)</label>
            <Input {...form.register("slug")} data-testid="input-slug" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea {...form.register("description")} data-testid="input-description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Website URL</label>
              <Input {...form.register("websiteUrl")} />
            </div>
            <div>
              <label className="text-sm font-medium">Affiliate URL</label>
              <Input {...form.register("affiliateUrl")} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <Input type="number" step="0.1" min="0" max="10" {...form.register("overallRating")} />
            </div>
            <div>
              <label className="text-sm font-medium">Trust Score</label>
              <Input type="number" step="0.1" min="0" max="10" {...form.register("trustScore")} />
            </div>
            <div>
              <label className="text-sm font-medium">Rank</label>
              <Input type="number" min="1" {...form.register("rank")} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-create-bookmaker">
            {createMutation.isPending ? "Creating..." : "Create Bookmaker"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AffiliateTab() {
  const { data: clicks } = useQuery<AffiliateClick[]>({
    queryKey: ["/api/affiliate/clicks"],
  });

  const { data: bookmakers } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers/all"],
  });

  const getBookmakerName = (id: string) => bookmakers?.find(b => b.id === id)?.name || "Unknown";

  const clicksByBookmaker = clicks?.reduce((acc, click) => {
    acc[click.bookmakerId] = (acc[click.bookmakerId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const sortedEntries = Object.entries(clicksByBookmaker).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Affiliate Performance</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Clicks</p>
          <p className="text-3xl font-bold">{clicks?.length || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Bookmakers</p>
          <p className="text-3xl font-bold">{sortedEntries.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Today's Clicks</p>
          <p className="text-3xl font-bold">
            {clicks?.filter(c => c.clickedAt.startsWith(new Date().toISOString().split("T")[0])).length || 0}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-bold mb-4">Clicks by Bookmaker</h3>
        {sortedEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No affiliate clicks yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedEntries.map(([id, count]) => (
              <div key={id} className="flex items-center justify-between">
                <span className="font-medium">{getBookmakerName(id)}</span>
                <Badge variant="secondary">{count} clicks</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function Admin() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">
          <Settings className="w-3 h-3 mr-1" />
          Admin
        </Badge>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage bookmakers, ratings, trust scores, and affiliate tracking</p>
      </div>

      <Tabs defaultValue="bookmakers">
        <TabsList className="mb-6">
          <TabsTrigger value="bookmakers" data-testid="tab-bookmakers">
            <Trophy className="w-4 h-4 mr-2" /> Bookmakers
          </TabsTrigger>
          <TabsTrigger value="affiliate" data-testid="tab-affiliate">
            <BarChart3 className="w-4 h-4 mr-2" /> Affiliate
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bookmakers">
          <BookmakersTab />
        </TabsContent>
        <TabsContent value="affiliate">
          <AffiliateTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
