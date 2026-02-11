# CryptoBookie - Crypto Betting Review Platform

## Overview
A premium crypto betting review and comparison platform with trust scores, affiliate tracking, SEO optimization, and modern design. Built as an affiliate website to rank crypto bookmakers and monetize through referral links.

## Recent Changes
- 2026-02-11: Initial build - database schema, seed data, all frontend pages, admin dashboard, API routes
- Trust Score system (0-10) for rating bookmaker reliability
- 7 bookmakers seeded with full data including one low-trust example (WildVegas)
- Blog/guides section with 3 SEO-optimized articles

## Architecture

### Backend
- Express.js REST API on port 5000
- PostgreSQL database with Drizzle ORM
- Tables: users, bookmakers, bonuses, blogPosts, affiliateClicks
- Storage layer pattern with DatabaseStorage class

### Frontend
- React SPA with Wouter routing
- Tailwind CSS + Shadcn UI components
- Dark/light theme with ThemeProvider
- TanStack React Query for data fetching

### Key Pages
- `/` - Homepage with hero, top bookmakers, bonuses, trust section
- `/bookmakers` - Full rankings with search/filter/sort
- `/bookmaker/:slug` - Detailed review page with ratings breakdown
- `/compare` - Side-by-side bookmaker comparison tool
- `/bonuses` - All available bonus offers
- `/blog` - Blog listing page
- `/blog/:slug` - Individual blog post
- `/admin` - Admin dashboard for managing bookmakers, ratings, affiliate clicks

### Design
- Color scheme: Dark crypto theme with green primary (Trust/Growth) and purple accent
- Font: Space Grotesk (modern, tech feel)
- Trust Score badges with color coding: green (9+), green (7+), yellow (5+), orange (3+), red (<3)

## User Preferences
- Crypto/betting affiliate niche
- Trust Score system is critical feature (0-10 scale)
- SEO-focused content strategy
- Premium, "super sexy" visual design
