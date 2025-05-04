import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Early access users table to store wallet addresses
export const earlyAccessUsers = pgTable("early_access_users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  email: text("email"),
  hasRequestedAccess: boolean("has_requested_access").default(true).notNull(),
});

export const insertEarlyAccessUserSchema = createInsertSchema(earlyAccessUsers).pick({
  walletAddress: true,
  email: true,
  hasRequestedAccess: true,
});

export type InsertEarlyAccessUser = z.infer<typeof insertEarlyAccessUserSchema>;
export type EarlyAccessUser = typeof earlyAccessUsers.$inferSelect;
