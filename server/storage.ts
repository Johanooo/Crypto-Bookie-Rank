import { eq, desc, asc, and, ilike } from "drizzle-orm";
import { db } from "./db";
import {
  users, bookmakers, bonuses, blogPosts, affiliateClicks,
  type User, type InsertUser,
  type Bookmaker, type InsertBookmaker,
  type Bonus, type InsertBonus,
  type BlogPost, type InsertBlogPost,
  type AffiliateClick, type InsertAffiliateClick,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getBookmakers(): Promise<Bookmaker[]>;
  getActiveBookmakers(): Promise<Bookmaker[]>;
  getFeaturedBookmakers(): Promise<Bookmaker[]>;
  getBookmakerBySlug(slug: string): Promise<Bookmaker | undefined>;
  getBookmakerById(id: string): Promise<Bookmaker | undefined>;
  createBookmaker(bookmaker: InsertBookmaker): Promise<Bookmaker>;
  updateBookmaker(id: string, bookmaker: Partial<InsertBookmaker>): Promise<Bookmaker | undefined>;
  deleteBookmaker(id: string): Promise<void>;
  incrementClickCount(id: string): Promise<void>;

  getBonuses(): Promise<Bonus[]>;
  getActiveBonuses(): Promise<Bonus[]>;
  getBonusesByBookmaker(bookmakerId: string): Promise<Bonus[]>;
  createBonus(bonus: InsertBonus): Promise<Bonus>;
  updateBonus(id: string, bonus: Partial<InsertBonus>): Promise<Bonus | undefined>;
  deleteBonus(id: string): Promise<void>;

  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;

  createAffiliateClick(click: InsertAffiliateClick): Promise<AffiliateClick>;
  getAffiliateClicks(): Promise<AffiliateClick[]>;
  getAffiliateClicksByBookmaker(bookmakerId: string): Promise<AffiliateClick[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getBookmakers(): Promise<Bookmaker[]> {
    return db.select().from(bookmakers).orderBy(asc(bookmakers.rank));
  }

  async getActiveBookmakers(): Promise<Bookmaker[]> {
    return db.select().from(bookmakers).where(eq(bookmakers.isActive, true)).orderBy(asc(bookmakers.rank));
  }

  async getFeaturedBookmakers(): Promise<Bookmaker[]> {
    return db.select().from(bookmakers)
      .where(and(eq(bookmakers.featured, true), eq(bookmakers.isActive, true)))
      .orderBy(asc(bookmakers.rank));
  }

  async getBookmakerBySlug(slug: string): Promise<Bookmaker | undefined> {
    const [bm] = await db.select().from(bookmakers).where(eq(bookmakers.slug, slug));
    return bm;
  }

  async getBookmakerById(id: string): Promise<Bookmaker | undefined> {
    const [bm] = await db.select().from(bookmakers).where(eq(bookmakers.id, id));
    return bm;
  }

  async createBookmaker(bookmaker: InsertBookmaker): Promise<Bookmaker> {
    const [bm] = await db.insert(bookmakers).values(bookmaker).returning();
    return bm;
  }

  async updateBookmaker(id: string, bookmaker: Partial<InsertBookmaker>): Promise<Bookmaker | undefined> {
    const [bm] = await db.update(bookmakers).set(bookmaker).where(eq(bookmakers.id, id)).returning();
    return bm;
  }

  async deleteBookmaker(id: string): Promise<void> {
    await db.delete(bookmakers).where(eq(bookmakers.id, id));
  }

  async incrementClickCount(id: string): Promise<void> {
    const bm = await this.getBookmakerById(id);
    if (bm) {
      await db.update(bookmakers).set({ clickCount: bm.clickCount + 1 }).where(eq(bookmakers.id, id));
    }
  }

  async getBonuses(): Promise<Bonus[]> {
    return db.select().from(bonuses);
  }

  async getActiveBonuses(): Promise<Bonus[]> {
    return db.select().from(bonuses).where(eq(bonuses.isActive, true));
  }

  async getBonusesByBookmaker(bookmakerId: string): Promise<Bonus[]> {
    return db.select().from(bonuses).where(eq(bonuses.bookmakerId, bookmakerId));
  }

  async createBonus(bonus: InsertBonus): Promise<Bonus> {
    const [b] = await db.insert(bonuses).values(bonus).returning();
    return b;
  }

  async updateBonus(id: string, bonus: Partial<InsertBonus>): Promise<Bonus | undefined> {
    const [b] = await db.update(bonuses).set(bonus).where(eq(bonuses.id, id)).returning();
    return b;
  }

  async deleteBonus(id: string): Promise<void> {
    await db.delete(bonuses).where(eq(bonuses.id, id));
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [p] = await db.insert(blogPosts).values(post).returning();
    return p;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [p] = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return p;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async createAffiliateClick(click: InsertAffiliateClick): Promise<AffiliateClick> {
    const [c] = await db.insert(affiliateClicks).values(click).returning();
    return c;
  }

  async getAffiliateClicks(): Promise<AffiliateClick[]> {
    return db.select().from(affiliateClicks);
  }

  async getAffiliateClicksByBookmaker(bookmakerId: string): Promise<AffiliateClick[]> {
    return db.select().from(affiliateClicks).where(eq(affiliateClicks.bookmakerId, bookmakerId));
  }
}

export const storage = new DatabaseStorage();
