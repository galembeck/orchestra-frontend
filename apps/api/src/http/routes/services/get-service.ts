import { companies } from "@repo/db/schema/companies.js";
import { serviceCategories } from "@repo/db/schema/service-categories.js";
import { services } from "@repo/db/schema/services.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { notFound } from "@/lib/errors.js";
import {
	mapServiceRow,
	serviceDTOSchema,
} from "@/schemas/service/service.schema.js";

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

			return mapServiceRow(row);
		},
	);
};
