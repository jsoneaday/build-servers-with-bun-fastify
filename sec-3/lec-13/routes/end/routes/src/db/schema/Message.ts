import {
  bigserial,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { bytea } from "./Base";
import { profile } from "./Profile";

export const message = pgTable("message", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: bigserial("user_id", { mode: "bigint" })
    .notNull()
    .references(() => profile.id),
  body: varchar("body", { length: 150 }).notNull(),
  likes: integer("likes").notNull().default(0),
  image: bytea("image"),
});
export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;

export const messageResponse = pgTable("message_response", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  originalMessageId: bigserial("original_message_id", { mode: "bigint" })
    .notNull()
    .references(() => message.id),
  respondingMessageId: bigserial("responding_message_id", { mode: "bigint" })
    .notNull()
    .references(() => message.id),
});
export type MessageResponse = typeof messageResponse.$inferSelect;
export type NewMessageResponse = typeof messageResponse.$inferInsert;

export const messageBroadcast = pgTable("message_broadcast", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  originalMessageId: bigserial("original_message_id", { mode: "bigint" })
    .notNull()
    .references(() => message.id),
  broadcastingMessageId: bigserial("broadcasting_message_id", {
    mode: "bigint",
  })
    .notNull()
    .references(() => message.id),
});
export type MessageBroadcast = typeof messageBroadcast.$inferSelect;
export type NewMessageBroadcast = typeof messageBroadcast.$inferInsert;
