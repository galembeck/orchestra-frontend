import {
	boolean,
	numeric,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { serviceCategories } from "./service-categories.js";

export const services = pgTable("services", {
	id: uuid("id").primaryKey().defaultRandom(),
	companyId: uuid("company_id")
		.notNull()
		.references(() => companies.id, { onDelete: "cascade" }),
	categoryId: uuid("category_id")
		.notNull()
		.references(() => serviceCategories.id, { onDelete: "restrict" }),
	serviceType: varchar("service_type", { length: 255 }).notNull(),
	price: numeric("price", { precision: 10, scale: 2 }),
	budgetable: boolean("budgetable").notNull().default(false),
	latitude: numeric("latitude", { precision: 10, scale: 7 }),
	longitude: numeric("longitude", { precision: 10, scale: 7 }),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
