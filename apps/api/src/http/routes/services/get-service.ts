import { companies } from "@repo/db/schema/companies.js";
import { serviceCategories } from "@repo/db/schema/service-categories.js";
import { services } from "@repo/db/schema/services.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { notFound } from "@/lib/errors.js";

const serviceDTOSchema = z.object({
	id: z.string(),
	companyId: z.string(),
	companyFantasyName: z.string(),
	categoryId: z.string(),
	categoryName: z.string(),
	categoryIcon: z.string(),
	serviceType: z.string(),
	price: z.number().nullable().optional(),
	budgetable: z.boolean().optional(),
	isActive: z.boolean(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	address: z.string(),
	number: z.string(),
	complement: z.string().nullable().optional(),
	neighborhood: z.string(),
	city: z.string(),
	state: z.string(),
	zipcode: z.string(),
	rating: z.number(),
	reviewsCount: z.number(),
	createdAt: z.string(),
});

export const getServiceRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/service/:serviceId",
		{
			schema: {
				summary: "Get a service by ID",
				tags: ["Services"],
				params: z.object({ serviceId: z.string().uuid() }),
				response: {
					200: serviceDTOSchema,
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req) => {
			const { serviceId } = req.params;

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
				.where(eq(services.id, serviceId));

			if (rows.length === 0) {
				throw notFound("service");
			}

			const row = rows[0];

			return {
				...row,
				price:
					row.price !== null && row.price !== undefined
						? Number(row.price)
						: null,
				latitude:
					row.latitude !== null && row.latitude !== undefined
						? Number(row.latitude)
						: null,
				longitude:
					row.longitude !== null && row.longitude !== undefined
						? Number(row.longitude)
						: null,
				address: row.address ?? "",
				number: row.number ?? "",
				neighborhood: row.neighborhood ?? "",
				city: row.city ?? "",
				state: row.state ?? "",
				zipcode: row.zipcode ?? "",
				rating: 0,
				reviewsCount: 0,
				createdAt: row.createdAt.toISOString(),
			};
		},
	);
};
