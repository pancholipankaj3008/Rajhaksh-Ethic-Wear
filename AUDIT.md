# Phase 1 — Repository Audit

Audit date: 2026-09-11  
Scope: read-only inspection of the existing client and server. No application code was changed during this phase.

## Existing architecture

- **Frontend:** React 19, Vite, React Router, Redux Toolkit, Axios, Lucide, Swiper and React Hot Toast. The client is organized by pages, components, and Redux feature folders.
- **Backend:** Node.js/Express 5 with MongoDB/Mongoose. API routes are mounted by `SERVER/Server.js` under `/api`.
- **Authentication:** JWT access (30 minutes) and refresh (7 days) tokens are issued as HTTP-only cookies. Axios sends credentials and retries one request after `/api/user/refresh`.
- **Image storage:** Multer stores uploads in memory; the product controller streams them to Cloudinary. Product documents contain Cloudinary URL strings rather than binary image data.
- **Current API naming:** singular, action-oriented endpoints, e.g. `/api/product/all-products` and `/api/user/signup`, rather than the REST examples in the brief.

## Important files

| Area | Primary files | Findings |
| --- | --- | --- |
| Server bootstrap | `SERVER/Server.js`, `SERVER/Config/dbConfig.js` | Express, JSON parsing, CORS, cookies, route mounting, Mongo connection. |
| Authentication and authorization | `SERVER/Models/User.js`, `SERVER/Controllers/UserController.js`, `SERVER/Middlewares/Auth.js`, `SERVER/Routes/UserRoutes.js` | bcrypt passwords, JWT cookie auth/refresh, protected roles, profile, address, wishlist, password reset, and user administration. |
| Products | `SERVER/Models/Product.js`, `SERVER/Controllers/ProductController.js`, `SERVER/Routes/ProductRoutes.js` | Rich product model, Cloudinary upload, pagination, search/filter/sort, soft deletion, related/featured/trending/new arrival endpoints. |
| Uploads | `SERVER/Middlewares/Multer.js`, `SERVER/Config/cloudinaryConfig.js` | Image type and 5 MB limit; Cloudinary configuration through environment variables. |
| E-commerce models | `SERVER/Models/Cart.js`, `Order.js`, `Coupon.js`, `Review.js`, `ReturnRequest.js` and matching controllers/routes | Cart, checkout/order lifecycle, coupon, review, return-request, and newsletter foundations already exist. |
| Client shell/routes | `CLIENT/src/App.jsx`, `CLIENT/src/api/axios.js`, `CLIENT/src/app/store.js` | Role-protected admin routes, customer routes, Redux slices, cookie-aware HTTP client. |
| Customer catalog | `CLIENT/src/pages/Products.jsx`, `ProductDetails.jsx`, `CLIENT/src/components/Navbar.jsx`, `ProductCard.jsx` | Product search, server-side listing filters/pagination, gallery/details, cart actions, product suggestions. |
| Admin UI | `CLIENT/src/pages/AdminDashboard.jsx`, `CLIENT/src/components/admin/AdminProductForm.jsx`, `CLIENT/src/features/admin/*` | Dashboard, product creation/edit/delete, users, coupons, newsletters, analytics, orders, and returns. |

## Existing functionality

### Authentication and users

- Public sign-up forcibly stores `role: "user"`; request-body role is overwritten.
- Login, logout, refresh, profile retrieval/update, password change, password reset, address CRUD, wishlist CRUD, user blocking, and admin user creation exist.
- Current roles are `user`, `admin`, `product manager`, `order manager`, and `inventory staff`; the client treats the non-user roles as privileged.
- Public responses omit passwords for login and profile, but the admin `GetAllUsers` query currently does not explicitly exclude password/reset fields. This is a Phase 2 security defect.

### Product catalog, search, and uploads

- Products have title, slug (unique/indexed), description, short description, brand, category, gender, price, discount/final price, gallery images, color/size variants, category attributes, tags, collection, care/return data, analytics fields, flags, SKU, timestamps, and soft-delete state.
- Multiple images are supported per color variant, then flattened into the product gallery.
- `GET /api/product/all-products` supports server-side keyword search, category/gender/collection/brand filters, several attribute filters, price range, featured/new/trending flags, sorting, page, and bounded limit (maximum 100).
- `GET /api/product/single-product/:id` accepts either a Mongo ID or slug and increments views.
- Product CRUD requires admin or product-manager authorization; deletion is a soft deactivate.
- Product categories are currently hard-coded string enums and related validation maps. There is **no Category model, controller, route, or category management API**.

### E-commerce functionality retained for the future

- A persistent user cart with selected color, size, quantity, and price snapshot.
- Orders with item snapshots, shipping address, COD/Razorpay/Stripe method enum, payment status, coupon, lifecycle status, tracking, and timestamps.
- Coupon, review, wishlist, saved address, return-request, and newsletter models/routes.
- The client has cart, checkout, order history/details, returns, wishlist, account, coupon, and payment Redux/UI code. No server-side payment route/model is present, so the client payment feature appears incomplete/orphaned.

## Reusable functionality

- Keep the Express/Mongoose/JWT/cookie/Redux/Vite architecture intact.
- Reuse Multer-to-Cloudinary streaming and the existing multipart product administration flow.
- Reuse product slug generation, pagination, query filtering, featured flags, soft deactivation, image gallery, and related-product query as the catalog base.
- Reuse the cart model shape as a future cart; introduce a separate enquiry list/model now rather than rebranding orders or mutating cart semantics.
- Preserve the order, coupon, review, return, wishlist, address, and customer account models/routes as dormant e-commerce capabilities.
- Extend the existing admin dashboard and product form incrementally instead of replacing them.

## Functionality to modify

### Phase 2 — authentication

- Standardize customer role terminology to the requested `customer`. This needs a safe migration strategy for existing `user` documents and every authorization check; do not change it casually in one endpoint.
- Ensure all user listing/admin responses use an allowlist or at minimum `.select("-password -resetPasswordToken -resetPasswordExpire")`.
- Validate sign-up/login/admin-create payloads and status codes consistently; admin creation must remain admin-only.
- Correct cookie security configuration: `trusted` imported from Mongoose is incorrectly used as a `secure` value in `Auth.js`; cookie settings should be environment-driven and consistent across login, refresh, and logout.
- Make Mongo connection awaiting/error handling reliable and configure CORS/client origin from environment rather than production values in source.

### Product/category/enquiry phases

- Replace catalog-facing inventory schema/UI behavior with wholesale fields: `wholesalePrice`, retained future `retailPrice`, `isPublished`, `isFeatured`, fabric/pattern/occasion, and non-stock variants (`size`, `color`, `sku`, optional variant images).
- Keep any legacy inventory data isolated for possible later commerce restoration, but remove stock calculations/checks/availability messages from the active wholesale API, customer frontend, admin UI, analytics, cart, and checkout flow.
- Add a dedicated category resource and migrate hard-coded category configuration incrementally. The current category enum/maps make this a deliberate data migration, not just a new route.
- Add an `Enquiry` model/controller/router and an enquiry-list client slice/UI. Quantities belong on enquiry items and never product variants.
- Add WhatsApp link construction in one shared configurable location using `WHATSAPP_NUMBER`; no WhatsApp implementation exists now.
- Align future-facing endpoint aliases or progressively migrate current action-oriented routes without breaking the existing client.

## Functionality to hide in the current wholesale frontend

- Cart, checkout, payment status, orders, returns, coupons, retail sale messaging, order tracking, and inventory/stock indicators.
- Wishlist can remain available but should not compete with the enquiry flow; it can be retained behind the current authenticated account experience until a product decision is made.
- Admin tabs and metrics for coupons, orders, returns, payment, inventory staff, low stock, out-of-stock, total inventory, and sold count should be hidden from the wholesale UI—not deleted from reusable backend code.
- Men, kids, sale, and broad non-women navigation should be removed or hidden from catalog navigation after the product/category migration is ready.

## Security and implementation risks discovered

- `SERVER/Config/dbConfig.js` does not await `mongoose.connect`, so startup can claim success before a connection succeeds.
- Error handlers frequently return raw `error.message`; production error output is not centrally normalized.
- There is no validation middleware/library; validation is controller-specific and uneven.
- Product category and many product fields are schema constrained, but no category management architecture exists.
- Inventory is deeply coupled: `variants.sizes[].stock`, `totalStock`, product analytics, cart validation, product detail display, and order placement/cancellation all read/write stock. It must be disabled behind a wholesale mode or separated carefully to avoid breaking retained e-commerce code.
- The client Axios base URL is hard-coded to a deployed NextGen API, rather than an environment-configured catalog API.
- The frontend `features/Payment` module has no corresponding server route/model in this repository.
- The workspace has no Git repository metadata available, so a worktree-status audit was not possible.

## Recommended migration plan

1. **Phase 2: auth cleanup only.** Preserve JWT cookie flow, secure registration to `customer`, protect admin creation, sanitize user output, standardize role checks, and test the requested auth endpoints. Do not touch products.
2. **Phase 3: catalog product/category backend.** Add category resource; adapt product fields and variants for women’s wholesale; retain retail price and isolate legacy inventory behavior. Keep compatibility endpoints while exposing consistent catalog query parameters.
3. **Phase 4: wholesale enquiries.** Create independent enquiry persistence/admin APIs; add an enquiry list and WhatsApp URL generation. Keep cart/order models intact and distinct.
4. **Phase 5: customer catalog.** Transform only the visible customer journey into Home, Collections, Categories, Products, About, and Contact with premium, image-led presentation and wholesale enquiry actions.
5. **Phase 6: admin.** Refocus existing admin product and dashboard screens on publishing, product imagery, variants, categories, users, and enquiries; hide inventory/order/payment controls.
6. **Phase 7: hardening.** Add request validation, response consistency, environment configuration, SEO/performance, indexes for new searchable catalog data, and focused API/UI tests.

## Phase 1 outcome

The existing application is suitable for an incremental conversion. The recommended path is to preserve its e-commerce data models and authentication foundation, add a separate wholesale enquiry flow, and make the frontend catalog-first while isolating—not deleting—the current inventory and transaction code.
