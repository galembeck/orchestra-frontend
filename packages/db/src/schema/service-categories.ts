import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const serviceCategories = pgTable("service_categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	icon: varchar("icon", { length: 50 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type NewServiceCategory = typeof serviceCategories.$inferInsert;
