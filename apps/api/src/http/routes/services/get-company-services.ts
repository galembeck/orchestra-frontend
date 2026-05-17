import { companies } from "@repo/db/schema/companies.js";
import { serviceCategories } from "@repo/db/schema/service-categories.js";
import { services } from "@repo/db/schema/services.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";
import {
	mapServiceRow,
	serviceDTOSchema,
} from "@/schemas/service/service.schema.js";

export const getCompanyServicesRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/service/company/:companyId",
		{
			preHandler: [authenticate],
			schema: {
				summary: "Get all services for a company",
				tags: ["Services"],
				security: [{ cookieAuth: [] }],
				params: z.object({ companyId: z.string().uuid() }),
				response: {
					200: z.array(serviceDTOSchema),
					401: z.object({ message: z.string() }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { companyId } = req.params;

			const company = await app.db
				.select({ id: companies.id })
				.from(companies)
				.where(eq(companies.id, companyId))
				.limit(1);

			if (company.length === 0) {
				return reply.status(404).send({ message: "Company not found" });
			}

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
				.where(eq(services.companyId, companyId));

			return rows.map(mapServiceRow);
		},
	);
};
