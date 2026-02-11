import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookmakers = pgTable("bookmakers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  websiteUrl: text("website_url").notNull(),
  affiliateUrl: text("affiliate_url").notNull(),
  overallRating: real("overall_rating").notNull().default(0),
  trustScore: real("trust_score").notNull().default(0),
  trustScoreLabel: text("trust_score_label").notNull().default("Unrated"),
  oddsRating: real("odds_rating").notNull().default(0),
  bonusRating: real("bonus_rating").notNull().default(0),
  uiRating: real("ui_rating").notNull().default(0),
  supportRating: real("support_rating").notNull().default(0),
  payoutSpeed: text("payout_speed").notNull().default("Unknown"),
  minDeposit: text("min_deposit").notNull().default("N/A"),
  maxPayout: text("max_payout").notNull().default("N/A"),
  established: text("established"),
  license: text("license"),
  cryptosAccepted: text("cryptos_accepted").array().notNull().default(sql`'{}'::text[]`),
  sportsCovered: text("sports_covered").array().notNull().default(sql`'{}'::text[]`),
  pros: text("pros").array().notNull().default(sql`'{}'::text[]`),
  cons: text("cons").array().notNull().default(sql`'{}'::text[]`),
  featured: boolean("featured").notNull().default(false),
  rank: integer("rank").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  clickCount: integer("click_count").notNull().default(0),
});

export const bonuses = pgTable("bonuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookmakerId: varchar("bookmaker_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  bonusCode: text("bonus_code"),
  bonusType: text("bonus_type").notNull().default("welcome"),
  value: text("value").notNull(),
  wagerRequirement: text("wager_requirement"),
  minDeposit: text("min_deposit"),
  expiresAt: text("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("guide"),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  publishedAt: text("published_at"),
  isPublished: boolean("is_published").notNull().default(false),
});

export const affiliateClicks = pgTable("affiliate_clicks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookmakerId: varchar("bookmaker_id").notNull(),
  clickedAt: text("clicked_at").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookmakerSchema = createInsertSchema(bookmakers).omit({
  id: true,
  clickCount: true,
});

export const insertBonusSchema = createInsertSchema(bonuses).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export const insertAffiliateClickSchema = createInsertSchema(affiliateClicks).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Bookmaker = typeof bookmakers.$inferSelect;
export type InsertBookmaker = z.infer<typeof insertBookmakerSchema>;
export type Bonus = typeof bonuses.$inferSelect;
export type InsertBonus = z.infer<typeof insertBonusSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type AffiliateClick = typeof affiliateClicks.$inferSelect;
export type InsertAffiliateClick = z.infer<typeof insertAffiliateClickSchema>;
