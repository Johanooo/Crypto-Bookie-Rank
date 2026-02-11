import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookmakerSchema, insertBonusSchema, insertBlogPostSchema } from "@shared/schema";
import sanitizeHtml from "sanitize-html";

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.headers["x-admin-key"];
  const sessionSecret = process.env.SESSION_SECRET;
  if (adminKey && sessionSecret && adminKey === sessionSecret) {
    return next();
  }
  const referer = req.headers.referer || "";
  const host = req.headers.host || "";
  if (referer.includes(host)) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

function sanitizeContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "h4", "h5", "h6", "img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
    },
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/bookmakers", async (_req, res) => {
    const bookmakers = await storage.getActiveBookmakers();
    res.json(bookmakers);
  });

  app.get("/api/bookmakers/featured", async (_req, res) => {
    const bookmakers = await storage.getFeaturedBookmakers();
    res.json(bookmakers);
  });

  app.get("/api/bookmakers/all", async (_req, res) => {
    const bookmakers = await storage.getBookmakers();
    res.json(bookmakers);
  });

  app.get("/api/bookmakers/:slug", async (req, res) => {
    const bookmaker = await storage.getBookmakerBySlug(req.params.slug);
    if (!bookmaker) return res.status(404).json({ error: "Bookmaker not found" });
    res.json(bookmaker);
  });

  app.post("/api/bookmakers", adminAuth, async (req, res) => {
    const parsed = insertBookmakerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
    const bookmaker = await storage.createBookmaker(parsed.data);
    res.status(201).json(bookmaker);
  });

  app.patch("/api/bookmakers/:id", adminAuth, async (req, res) => {
    const bookmaker = await storage.updateBookmaker(req.params.id, req.body);
    if (!bookmaker) return res.status(404).json({ error: "Bookmaker not found" });
    res.json(bookmaker);
  });

  app.delete("/api/bookmakers/:id", adminAuth, async (req, res) => {
    await storage.deleteBookmaker(req.params.id);
    res.status(204).send();
  });

  app.post("/api/bookmakers/:id/click", async (req, res) => {
    await storage.incrementClickCount(req.params.id);
    await storage.createAffiliateClick({
      bookmakerId: req.params.id,
      clickedAt: new Date().toISOString(),
      referrer: req.headers.referer || null,
      userAgent: req.headers["user-agent"] || null,
    });
    const bookmaker = await storage.getBookmakerById(req.params.id);
    res.json({ affiliateUrl: bookmaker?.affiliateUrl });
  });

  app.get("/api/bonuses", async (_req, res) => {
    const allBonuses = await storage.getActiveBonuses();
    res.json(allBonuses);
  });

  app.get("/api/bonuses/all", async (_req, res) => {
    const allBonuses = await storage.getBonuses();
    res.json(allBonuses);
  });

  app.get("/api/bonuses/bookmaker/:bookmakerId", async (req, res) => {
    const allBonuses = await storage.getBonusesByBookmaker(req.params.bookmakerId);
    res.json(allBonuses);
  });

  app.post("/api/bonuses", adminAuth, async (req, res) => {
    const parsed = insertBonusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
    const bonus = await storage.createBonus(parsed.data);
    res.status(201).json(bonus);
  });

  app.patch("/api/bonuses/:id", adminAuth, async (req, res) => {
    const bonus = await storage.updateBonus(req.params.id, req.body);
    if (!bonus) return res.status(404).json({ error: "Bonus not found" });
    res.json(bonus);
  });

  app.delete("/api/bonuses/:id", adminAuth, async (req, res) => {
    await storage.deleteBonus(req.params.id);
    res.status(204).send();
  });

  app.get("/api/blog", async (_req, res) => {
    const posts = await storage.getPublishedBlogPosts();
    res.json(posts);
  });

  app.get("/api/blog/all", async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.json({ ...post, content: sanitizeContent(post.content) });
  });

  app.post("/api/blog", adminAuth, async (req, res) => {
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
    const sanitizedData = { ...parsed.data, content: sanitizeContent(parsed.data.content) };
    const post = await storage.createBlogPost(sanitizedData);
    res.status(201).json(post);
  });

  app.patch("/api/blog/:id", adminAuth, async (req, res) => {
    const data = req.body.content ? { ...req.body, content: sanitizeContent(req.body.content) } : req.body;
    const post = await storage.updateBlogPost(req.params.id, data);
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.json(post);
  });

  app.delete("/api/blog/:id", adminAuth, async (req, res) => {
    await storage.deleteBlogPost(req.params.id);
    res.status(204).send();
  });

  app.get("/api/affiliate/clicks", adminAuth, async (_req, res) => {
    const clicks = await storage.getAffiliateClicks();
    res.json(clicks);
  });

  app.get("/api/affiliate/clicks/:bookmakerId", adminAuth, async (req, res) => {
    const clicks = await storage.getAffiliateClicksByBookmaker(req.params.bookmakerId);
    res.json(clicks);
  });

  return httpServer;
}
