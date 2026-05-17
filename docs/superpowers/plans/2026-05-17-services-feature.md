# Services Feature — Implementation Plan

## Context

Orchestra is a pnpm+Turborepo monorepo with:
- `apps/api` — Fastify 5 + Drizzle ORM + PostgreSQL
- `apps/web` — Next.js (TanStack Router) — company dashboard + public pages
- `packages/core` — shared hooks, services, models, permission constants

**Current state:**
- Company dashboard `/services` page already renders a table and a `CreateServiceDialog` (2-step form) — but the API endpoints it calls do NOT exist yet.
- Public `/services` page renders hardcoded mock cards; the map is pinned to NYC.
- `packages/core/src/services/service.service.ts` calls `/service`, `/service/company/:id`, `/service-categories` — all 404.
- No service/service-category DB schema or migrations exist.
- No service-related permission keys exist in either `packages/core/src/constants/services/role/permissions.ts` or `apps/api/src/types/permissions.ts`.

---

## Task 1 — Add service permission keys

**Files to modify:**
- `packages/core/src/constants/services/role/permissions.ts`
- `apps/api/src/types/permissions.ts`

Add to the `PermissionKey` const object in both files:
```ts
ServiceCreate: "service:create",
ServiceUpdate: "service:update",
ServiceDelete: "service:delete",
```

Both files define identical `PermissionKey` objects — keep them in sync.

Run biome from `packages/core`:
```bash
cd packages/core && pnpm dlx @biomejs/biome check --write src/constants/services/role/permissions.ts
```
And from `apps/api`:
```bash
cd apps/api && pnpm dlx @biomejs/biome check --write src/types/permissions.ts
```

Commit message: `feat: add service permission keys to core and api`

---

## Task 2 — DB schema: service_categories + services

**Files to create:**
- `apps/api/src/db/schema/service-categories.ts`
- `apps/api/src/db/schema/services.ts`

### `service-categories.ts`
```ts
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const serviceCategories = pgTable("service_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }).notNull(), // lucide icon name, e.g. "wrench"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type NewServiceCategory = typeof serviceCategories.$inferInsert;
```

### `services.ts`
```ts
import { boolean, numeric, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { serviceCategories } from "./service-categories.js";

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => serviceCategories.id, { onDelete: "restrict" }),
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
```

**After creating schema files**, generate and apply migration from `apps/api`:
```bash
cd apps/api && pnpm db:generate && pnpm db:migrate
```

Run biome:
```bash
cd apps/api && pnpm dlx @biomejs/biome check --write src/db/schema/service-categories.ts src/db/schema/services.ts
```

Commit message: `feat(api): add service_categories and services DB schema`

---

## Task 3 — API: GET /service-categories

**File to create:** `apps/api/src/http/routes/service-categories/get-service-categories.ts`

**File to modify:** `apps/api/src/http/routes/index.ts`

Public route (no auth). Queries all rows from `service_categories`, returns array.

Route: `GET /service-categories`

Response schema:
```ts
z.array(z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  icon: z.string(),
}))
```

Register in `routes/index.ts`:
```ts
import { getServiceCategoriesRoute } from "./service-categories/get-service-categories.js";
await app.register(getServiceCategoriesRoute);
```

Run biome from `apps/api`:
```bash
cd apps/api && pnpm dlx @biomejs/biome check --write src/http/routes/service-categories/get-service-categories.ts src/http/routes/index.ts
```

Commit message: `feat(api): add GET /service-categories route`

---

## Task 4 — API: Service CRUD routes

**Files to create:**
- `apps/api/src/http/routes/services/get-services.ts`
- `apps/api/src/http/routes/services/get-company-services.ts`
- `apps/api/src/http/routes/services/get-service.ts`
- `apps/api/src/http/routes/services/create-service.ts`

**File to modify:** `apps/api/src/http/routes/index.ts`

### ServiceDTO shape (matches `packages/core/src/models/service.model.ts`)
```ts
z.object({
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
  // address fields from company:
  address: z.string(),
  number: z.string(),
  complement: z.string().nullable().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  // ratings (mocked as 0 for now — no reviews table yet):
  rating: z.number(),
  reviewsCount: z.number(),
  createdAt: z.string(),
})
```

### GET /service (public)
- Join `services` → `companies` → `service_categories`
- Filter `is_active = true`
- Return `ServiceDTO[]`

### GET /service/:serviceId (public)
- Same join, filter by id
- 404 if not found

### GET /service/company/:companyId (authenticated)
- `preHandler: [authenticate]`
- Join `services` → `companies` → `service_categories`
- Filter by `company_id`
- Return all (active and inactive) so owners can see their full catalog

### POST /service/company/:companyId (authenticated + authorized)
- `preHandler: [authenticate, requirePermission(PermissionKey.ServiceCreate)]`
- Body: `{ categoryId, serviceType, price?, budgetable? }`
- Look up company address to get street/city/state/zipcode
- **Geocode** using Nominatim (OpenStreetMap):
  ```
  GET https://nominatim.openstreetmap.org/search?q={street},{number},{city},{state},Brazil&format=json&limit=1
  ```
  Store `lat`/`lon` from first result. If geocoding fails (network error or empty result), store null — don't fail the request.
- Insert into `services`, return `ServiceDTO`

**Important API convention** (from `apps/api/CLAUDE.md`):
- Always include `.js` extension on imports
- Use `@/` alias for internal imports
- Define full `schema` with `summary`, `tags`, `response`

Run biome from `apps/api`:
```bash
cd apps/api && pnpm dlx @biomejs/biome check --write \
  src/http/routes/services/get-services.ts \
  src/http/routes/services/get-company-services.ts \
  src/http/routes/services/get-service.ts \
  src/http/routes/services/create-service.ts \
  src/http/routes/index.ts
```

Commit message: `feat(api): add service CRUD routes`

---

## Task 5 — Update ServiceDTO model + add useMyMembership hook

**Files to modify:**
- `packages/core/src/models/service.model.ts`
- `packages/core/src/hooks/services/use-company.ts`

### ServiceDTO update
Add `latitude` and `longitude` fields (nullable numbers):
```ts
latitude?: number | null;
longitude?: number | null;
```

### New hooks in `use-company.ts`

**`useMyMembership(companyId)`** — finds the current authenticated user's `CompanyMemberDTO` within a company:
```ts
export function useMyMembership(companyId: string | undefined) {
  const { user } = useAuth();
  const { data: members } = useCompanyMembers(companyId);
  return members?.find((m) => m.userId === user?.id) ?? null;
}
```
Note: `useAuth` here is from `../../providers/auth-provider.js` (the provider, not the hook in `use-auth.ts`).

**`useCanManageServices(companyId)`** — returns `boolean`:
```ts
export function useCanManageServices(companyId: string | undefined): boolean {
  const membership = useMyMembership(companyId);
  const { data: permissions } = useRolePermissions(companyId, membership?.roleId);
  if (!membership) return false;
  if (membership.isOwner) return true;
  return permissions?.includes(PermissionKey.ServiceCreate) ?? false;
}
```
Import `PermissionKey` from `../../constants/services/role/permissions.js` and `useRolePermissions` from `./use-role.js`.

Run biome:
```bash
cd packages/core && pnpm dlx @biomejs/biome check --write src/models/service.model.ts src/hooks/services/use-company.ts
```

Commit message: `feat(core): add latitude/longitude to ServiceDTO and useCanManageServices hook`

---

## Task 6 — Company dashboard: RBAC gate on CreateServiceDialog

**File to modify:**
`apps/web/src/pages/app/_company/_(organization-set)/$companySlug/_operation/services/index.tsx`

Import `useCanManageServices` from `@repo/core/hooks/services/use-company`.

In `ServicesManagementPage`, add:
```tsx
const canManageServices = useCanManageServices(company?.id);
```

Conditionally render `<CreateServiceDialog>` only when `canManageServices` is `true`:
```tsx
{canManageServices && <CreateServiceDialog company={company} />}
```

The header row already does `flex items-center justify-between` — when the button is hidden, the header text simply takes full width.

Run biome from `apps/web`:
```bash
cd apps/web && pnpm dlx @biomejs/biome check --write "src/pages/app/_company/_(organization-set)/\$companySlug/_operation/services/index.tsx"
```

Commit message: `feat(web): gate CreateServiceDialog behind ServiceCreate permission`

---

## Task 7 — Public services page: geolocation + real API data

**Files to modify:**
- `apps/web/src/pages/_public/_(no-authentication)/services/~components/services-content/-services-listing.tsx`
- `apps/web/src/pages/_public/_(no-authentication)/services/~components/services-content/-services-map.tsx`
- `apps/web/src/pages/_public/_(no-authentication)/services/~components/services-header/-search-header.tsx`
- `apps/web/src/pages/_public/_(no-authentication)/services/~components/services-content/-services-listing-card.tsx`

### Geolocation hook (inline in `-services-listing.tsx`)
Add a local `useUserLocation` hook:
```ts
type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "granted"; lat: number; lng: number }
  | { status: "denied"; error: string };

function useUserLocation(): LocationState {
  const [state, setState] = useState<LocationState>({ status: "idle" });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: "denied", error: "Geolocalização não suportada." });
      return;
    }
    setState({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: "granted", lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setState({ status: "denied", error: "Localização não autorizada." }),
      { timeout: 10000 }
    );
  }, []);

  return state;
}
```

### Haversine distance helper (inline)
```ts
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

### ServicesListing component changes
1. Call `useServices()` from `@repo/core/hooks/services/use-services`
2. Call `useUserLocation()`
3. When `location.status === "loading"`: show spinner/skeleton
4. When `location.status === "denied"`: show a soft warning banner but still render services (without distance, or sorted by name)
5. When `location.status === "granted"`: compute distance for each service (if `latitude` and `longitude` are present), sort ascending. Services with no coordinates go to the bottom.
6. Pass `distance` as a formatted string (e.g., `"1.3"`) or `"?"` if no coordinates.
7. Map `categoryIcon` (lucide icon name string like `"wrench"`) to a LucideIcon component using a lookup map. Fallback to `Wrench`.

### Icon mapping (inline in `-services-listing.tsx`)
```ts
import { Hammer, Paintbrush, Wrench, Zap, type LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  wrench: Wrench,
  hammer: Hammer,
  paintbrush: Paintbrush,
  zap: Zap,
};

function getCategoryIcon(iconName: string): LucideIcon {
  return CATEGORY_ICONS[iconName.toLowerCase()] ?? Wrench;
}
```

### ServicesListingCard update
Add an optional `distanceUnavailable` prop (boolean). When true, show `"—"` instead of the distance value and omit the `km` label. Keep all other props as-is.

### ServicesMap component changes
- Accept optional `userLocation: { lat: number; lng: number } | null` prop
- Accept optional `services: ServiceDTO[]` prop
- When `userLocation` is provided, center map on `[userLocation.lng, userLocation.lat]`; otherwise default to `[-46.6333, -23.5505]` (São Paulo)
- For each service with lat/lng, add a marker at `[service.longitude, service.latitude]`
- Pass props down from `ServicesPage` (lift location state up to page level, or thread it through)

**Lifting state:** Since both `ServicesListing` and `ServicesMap` need `userLocation`, move the `useUserLocation` hook call to `ServicesPage` (the parent in `index.tsx`) and pass the location down as props.

### SearchHeader update
Accept optional `servicesCount: number` prop and render real count:
```tsx
<span>... {servicesCount} serviços · ordenado por proximidade</span>
```

### ServicesPage (index.tsx) wiring
```tsx
function ServicesPage() {
  const location = useUserLocation();
  const { data: services = [] } = useServices();
  const userCoords = location.status === "granted" ? { lat: location.lat, lng: location.lng } : null;

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <SearchHeader servicesCount={services.length} />
      <div className="flex min-h-0 flex-col gap-5 lg:flex-row lg:gap-0">
        <ServicesListing services={services} userLocation={userCoords} locationStatus={location.status} />
        <ServicesMap services={services} userLocation={userCoords} />
      </div>
    </main>
  );
}
```

`useUserLocation` and `useServices` (from `@repo/core/hooks/services/use-services`) are called at the page level.

Run biome from `apps/web`:
```bash
cd apps/web && pnpm dlx @biomejs/biome check --write \
  "src/pages/_public/_(no-authentication)/services/index.tsx" \
  "src/pages/_public/_(no-authentication)/services/~components/services-content/-services-listing.tsx" \
  "src/pages/_public/_(no-authentication)/services/~components/services-content/-services-map.tsx" \
  "src/pages/_public/_(no-authentication)/services/~components/services-content/-services-listing-card.tsx" \
  "src/pages/_public/_(no-authentication)/services/~components/services-header/-search-header.tsx"
```

Commit message: `feat(web): connect public services page to real API with geolocation and map`

---

## Execution order

Tasks 1–2 must complete before Tasks 3–4 (permissions and schema needed by API routes).
Tasks 3–4 must complete before Tasks 5–7 (API needed by frontend hooks).
Tasks 5–7 can be done sequentially after Task 4.

Recommended sequence: 1 → 2 → 3 → 4 → 5 → 6 → 7
