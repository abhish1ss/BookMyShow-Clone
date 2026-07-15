# Pending Task

## Class

1. ~~how can we avoid booking same ticket again & 2 people~~ ✅ **Done** — seats are claimed atomically (`findOneAndUpdate` with a `$nin` seat-conflict filter) inside a MongoDB multi-document transaction; concurrent conflicts get HTTP 409, and a unique index on `transactionId` makes `confirmBooking` idempotent.

## Masters

1. ~~Error Handler Middleware - specfic status codes~~ ✅ **Done** — `middleware/errorHandler.js` + `utils/ApiError.js` + `utils/asyncHandler.js`; controllers throw `ApiError(400/401/404/409)`, unexpected errors become 500.
2. ~~Global Alerts on Client side~~ ✅ **Done** — the axios response interceptor shows one global antd alert per failure (with a 2s de-dup window shared via `showError`); session expiry gets its own warning + redirect.
3. ~~Cookie Handling instead of local storage~~ ✅ **Done** — JWT is set as an httpOnly `tokenForBMS` cookie on login (`sameSite=strict`, `secure` in production), cleared by `POST /users/logout`; no localStorage usage remains.
4. ~~using luxon library to format dates whereever it is needed~~ ✅ **Done** — `src/utils/date.js` (luxon) replaces moment everywhere; moment uninstalled.
5. ~~custom hooks -> extract api call design (design is reusable)~~ ✅ **Done** — `src/hooks/useApi.js` wraps loader dispatch + success/error handling; all API consumers use it.
6. ~~redux state handling for movies and theatre~~ ✅ **Done** — `moviesSlice` + `theatresSlice` registered in the store; Home/Admin/Partner pages read and write them.
7. ~~swagger~~ ✅ **Done** — Swagger UI at `/bms/api-docs`, generated from `@openapi` JSDoc in `routes/*.js` (`config/swagger.js`).
8. ~~Read Transaction on mongodb~~ ✅ **Done** — `getAllBookings` runs inside a session with snapshot read concern; requires the single-node replica set documented in the README.
