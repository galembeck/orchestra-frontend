import { z } from "zod";

export const serviceDTOSchema = z.object({
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
	// TODO: replace with aggregated review data when reviews feature is implemented
	rating: z.number(),
	reviewsCount: z.number(),
	createdAt: z.string(),
});

export type ServiceDTO = z.infer<typeof serviceDTOSchema>;

type ServiceRow = {
	id: string;
	companyId: string;
	companyFantasyName: string | null;
	categoryId: string;
	categoryName: string;
	categoryIcon: string;
	serviceType: string;
	price: string | null;
	budgetable: boolean;
	isActive: boolean;
	latitude: string | null;
	longitude: string | null;
	address: string | null;
	number: string | null;
	complement: string | null;
	neighborhood: string | null;
	city: string | null;
	state: string | null;
	zipcode: string | null;
	createdAt: Date;
};

export function mapServiceRow(row: ServiceRow): ServiceDTO {
	return {
		...row,
		companyFantasyName: row.companyFantasyName ?? "",
		price:
			row.price !== null && row.price !== undefined ? Number(row.price) : null,
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
}
