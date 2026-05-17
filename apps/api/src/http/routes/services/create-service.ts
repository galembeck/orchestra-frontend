import { companies } from "@repo/db/schema/companies.js";
import { serviceCategories } from "@repo/db/schema/service-categories.js";
import { services } from "@repo/db/schema/services.js";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { requirePermission } from "@/http/middlewares/authorize.js";
import { notFound } from "@/lib/errors.js";
import { PermissionKey } from "@/types/permissions.js";

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

async function geocodeAddress(
	street: string | null,
	number: string | null,
	city: string | null,
	state: string | null,
): Promise<{ lat: number; lng: number } | null> {
	if (!street || !city || !state) return null;
	try {
		const query = encodeURIComponent(
			`${street}, ${number ?? ""}, ${city}, ${state}, Brazil`,
		);
		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
			{
				headers: { "User-Agent": "orchestra-platform/1.0" },
			},
		);
		if (!res.ok) return null;
		const data = (await res.json()) as Array<{ lat: string; lon: string }>;
		if (data.length === 0) return null;
		return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
	} catch {
		return null;
	}
}

export const createServiceRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/service/company/:companyId",
		{
			preHandler: [
				authenticate,
				requirePermission(PermissionKey.ServiceCreate),
			],
			schema: {
				summary: "Create a service for a company",
				tags: ["Services"],
				security: [{ cookieAuth: [] }],
				params: z.object({ companyId: z.string().uuid() }),
				body: z.object({
					categoryId: z.string().uuid(),
					serviceType: z.string().min(1).max(255),
					price: z.number().positive().optional(),
					budgetable: z.boolean().optional(),
				}),
				response: {
					201: serviceDTOSchema,
					401: z.object({ message: z.string() }),
					403: z.object({ message: z.string() }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { companyId } = req.params;
			const body = req.body;

			const [company] = await app.db
				.select({
					street: companies.street,
					number: companies.number,
					city: companies.city,
					state: companies.state,
				})
				.from(companies)
				.where(eq(companies.id, companyId))
				.limit(1);

			if (!company) {
				throw notFound("company");
			}

			const coords = await geocodeAddress(
				company.street,
				company.number,
				company.city,
				company.state,
			);

			const [inserted] = await app.db
				.insert(services)
				.values({
					companyId,
					categoryId: body.categoryId,
					serviceType: body.serviceType,
					price: body.price?.toString(),
					budgetable: body.budgetable ?? false,
					latitude: coords?.lat.toString(),
					longitude: coords?.lng.toString(),
				})
				.returning({ id: services.id });

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
				.where(eq(services.id, inserted.id));

			const row = rows[0];

			return reply.status(201).send({
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
			});
		},
	);
};
