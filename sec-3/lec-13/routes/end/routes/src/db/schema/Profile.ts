import { varchar, bigserial, pgTable, timestamp } from "drizzle-orm/pg-core";
import { bytea } from "./Base";

export const profile = pgTable("profile", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userName: varchar("user_name", { length: 50 }).unique().notNull().unique(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  description: varchar("description", { length: 250 }).notNull(),
  region: varchar("region", { length: 50 }),
  mainUrl: varchar("main_url", { length: 250 }),
  avatar: bytea("avatar"),
});
export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;

export const follow = pgTable("follow", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  followerId: bigserial("follower_id", { mode: "bigint" })
    .notNull()
    .references(() => profile.id),
  followingId: bigserial("following_id", { mode: "bigint" })
    .notNull()
    .references(() => profile.id),
});
export type Follow = typeof follow.$inferSelect;
export type NewFollow = typeof follow.$inferInsert;
