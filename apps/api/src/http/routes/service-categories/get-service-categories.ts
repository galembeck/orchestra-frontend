import { serviceCategories } from "@repo/db/schema/service-categories.js";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// biome-ignore lint/suspicious/useAwait: required by @biome
export const getServiceCategoriesRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/service-categories",
		{
			schema: {
				summary: "List all service categories",
				tags: ["Service Categories"],
				response: {
					200: z.array(
						z.object({
							id: z.string(),
							name: z.string(),
							slug: z.string(),
							icon: z.string(),
						}),
					),
				},
			},
		},
		async () => {
			const categories = await app.db
				.select({
					id: serviceCategories.id,
					name: serviceCategories.name,
					slug: serviceCategories.slug,
					icon: serviceCategories.icon,
				})
				.from(serviceCategories);

			return categories;
		},
	);
};
