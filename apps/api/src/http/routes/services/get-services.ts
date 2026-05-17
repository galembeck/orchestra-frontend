import { companies } from "@repo/db/schema/companies.js";
import { serviceCategories } from "@repo/db/schema/service-categories.js";
import { services } from "@repo/db/schema/services.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
	mapServiceRow,
	serviceDTOSchema,
} from "@/schemas/service/service.schema.js";

export const getServicesRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/service",
		{
			schema: {
				summary: "Get all active services",
				tags: ["Services"],
				querystring: z
					.object({
						limit: z.coerce.number().min(1).max(100).default(50),
					})
					.optional(),
				response: {
					200: z.array(serviceDTOSchema),
				},
			},
		},
		async (req) => {
			const limit = req.query?.limit ?? 50;

			const rows = await app.db
				.select({
					id: services.id,
					companyId: services.companyId,
					companyFantasyName: companies.fantasyName,
					categoryId: services.categoryId,
					categoryName: serviceCategories.name,
					categoryIcon: serviceCategories.icon,
					serviceType: services.serviceType,
					price: services.price,
					budgetable: services.budgetable,
					isActive: services.isActive,
					latitude: services.latitude,
					longitude: services.longitude,
					address: companies.street,
					number: companies.number,
					complement: companies.complement,
					neighborhood: companies.neighborhood,
					city: companies.city,
					state: companies.state,
					zipcode: companies.zipCode,
					createdAt: services.createdAt,
				})
				.from(services)
				.innerJoin(companies, eq(services.companyId, companies.id))
				.innerJoin(
					serviceCategories,
					eq(services.categoryId, serviceCategories.id),
				)
				.where(eq(services.isActive, true))
				.limit(limit);

			return rows.map(mapServiceRow);
		},
	);
};
