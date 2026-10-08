# Wholesale catalog migration

## What changed

The application is now a women’s wholesale catalog. Cart, checkout, payments, orders, coupons, reviews, returns, saved addresses, wishlists and inventory modules have been removed.

## Backend

- Added `Category` model, controller and routes at `/api/categories`.
- Added `Enquiry` model, controller and routes at `/api/enquiries`.
- Refactored `Product` to use flat no-stock variants: `size`, `color`, `sku`, `images`.
- Added `wholesalePrice`, `retailPrice`, `isPublished`, category references and wholesale filters.
- Existing nested stock variants are converted on read and retained in `legacyInventory` if an older product is subsequently saved. They are not used by catalog queries, UI, enquiries or product validation.
- Added `SERVER/scripts/seedCategories.js` for the initial wholesale category set. Run `node scripts/seedCategories.js` from `SERVER` after configuring MongoDB.
- Standardized newly issued user roles to `customer` or `admin`; legacy `user` and staff role documents are mapped safely during authentication.
- Hardened user output so password/reset fields are excluded from profile and user-list responses.
- Added environment-driven cookie/CORS configuration.

## Frontend

- Axios now reads `VITE_API_URL` rather than a hard-coded deployment URL.
- Customer navigation is catalog-first: Home, Collections, Categories, Products, About, Contact and Enquiry.
- Product listing and details use wholesale price, flat variants, server-side filters and no inventory language.
- Added local enquiry list, submission form, and a shared WhatsApp URL helper.
- Replaced the active admin experience with dashboard, products, categories, enquiries and users. The product form manages no-stock variants and wholesale/retail pricing.

## Preserved but hidden

Cart, checkout, payment, order placement/history, returns, coupons, retail sale navigation, and inventory UI are hidden from the active customer routes. Their database models/controllers remain for a future commerce restoration. Legacy cart/order code still contains its previous stock behavior and must be deliberately re-enabled/refactored before it is exposed again.

## Required environment variables

Copy `SERVER/.env.example` to `SERVER/.env` and `CLIENT/.env.example` to `CLIENT/.env`. Configure `MONGO_URL`, `ACCESS`, `REFRESH`, Cloudinary credentials, `CLIENT_URL`, `VITE_API_URL`, and WhatsApp numbers. Do not commit either real `.env` file.

## API additions

- `GET /api/categories`
- `GET /api/categories/:slug`
- `POST|PUT|DELETE /api/categories` (admin)
- `POST /api/enquiries` (guest or authenticated customer)
- `GET|PUT|DELETE /api/enquiries` (admin)

Existing product endpoints are retained: `/api/product/all-products`, `/single-product/:id`, `/add-product`, `/update-product/:id`, `/delete-product/:id`.

## Tests performed

- Node syntax checks for server bootstrap, product, category and enquiry controllers.
- Production Vite build completed successfully.

## Known limitations

- Database migration is lazy/compatibility based; run the category seeder and edit/save legacy products to persist their converted flat variants. A production data migration should be backed up and tested against a database snapshot first.
- Existing dormant cart/order inventory logic is intentionally not part of the wholesale catalog and should not be exposed without a future inventory design.
- The production build warns that its main JavaScript bundle exceeds 500 kB; this is a performance optimization opportunity, not a build failure.

## Start

Backend: `cd SERVER` then `node Server.js`.

Frontend: `cd CLIENT` then `npm run dev`.
