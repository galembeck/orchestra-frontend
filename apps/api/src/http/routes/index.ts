import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { registerClientRoute } from "./auth/register-client.js";
import { registerOwnerRoute } from "./auth/register-owner.js";
import { signInRoute } from "./auth/sign-in.js";
import { getServiceCategoriesRoute } from "./service-categories/get-service-categories.js";
import { createServiceRoute } from "./services/create-service.js";
import { getCompanyServicesRoute } from "./services/get-company-services.js";
import { getServiceRoute } from "./services/get-service.js";
import { getServicesRoute } from "./services/get-services.js";
import { getStatusRoute } from "./status/get-status.js";
import { getMeRoute } from "./users/get-me.js";

export const routes: FastifyPluginAsyncZod = async (app) => {
	await app.register(getStatusRoute);
	await app.register(registerClientRoute);
	await app.register(registerOwnerRoute);
	await app.register(signInRoute);
	await app.register(getServiceCategoriesRoute);
	await app.register(getMeRoute);
	await app.register(getServicesRoute);
	await app.register(getServiceRoute);
	await app.register(getCompanyServicesRoute);
	await app.register(createServiceRoute);
};
