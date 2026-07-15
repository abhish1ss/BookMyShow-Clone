# 🎬 BookMyShow — MERN Movie Ticket Booking Platform

A full-stack movie ticket–booking application (a BookMyShow clone) built with the **MERN** stack. Users browse movies, pick a theatre and show, select seats, and pay via **Stripe Checkout**. Role-based access supports **admins** (manage movies, approve theatres), **theatre partners** (manage their theatres and shows), and **users** (browse and book).

> Master of Science in Computer Science — Applied Full-Stack Capstone Project.

---

## ✨ Features

- **Authentication & authorization** — register/login with **JWT**, passwords hashed with **bcrypt**, forgot/reset password via email (OTP).
- **Role-based access** — `admin`, `partner`, `user` (enforced per page on the client and via JWT middleware on the API).
- **Movies** — admins add/update/delete movies; everyone can browse & search.
- **Theatres** — partners register theatres; admins approve (activate) them.
- **Shows** — partners schedule shows (movie + theatre + date/time/price/seats).
- **Booking & payments** — interactive seat selection, payment via **Stripe Checkout Sessions** (hosted payment page), booking confirmed on return with an idempotent `confirmBooking` step.
- **Double-booking guard** — seat availability is re-checked before every write, and confirming the same Stripe session twice returns the existing booking instead of duplicating it.
- **Ticket email** — booking confirmation with ticket details sent via Nodemailer (best-effort: a missing Gmail config never fails the booking).
- **Security** — `helmet` with a content-security-policy, `express-rate-limit` (100 requests / 15 min per IP on `/bms`), `express-mongo-sanitize`, CORS.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Redux Toolkit, React Router 6, Ant Design 5, Axios, Luxon |
| **Backend** | Node.js, Express 4, Mongoose 8 |
| **Database** | MongoDB |
| **Auth/Security** | JWT, bcrypt, helmet, express-rate-limit, express-mongo-sanitize, CORS |
| **Payments** | Stripe Checkout Sessions |
| **Email** | Nodemailer (Gmail) with HTML templates (OTP + ticket) |

## 📁 Structure

```
BookMyShow-Clone/
├── Backend/                     # Express API (MVC)
│   ├── config/db.js             # MongoDB connection
│   ├── controllers/             # user, movie, theatre, show, booking
│   ├── middleware/              # JWT auth middleware
│   ├── models/                  # Mongoose schemas (user, movie, theatre, show, booking)
│   ├── routes/                  # /bms/* routes
│   ├── utils/                   # email helper + HTML templates (OTP, ticket)
│   ├── seed.js                  # demo data seeder (users, movies, theatres, shows)
│   └── server.js                # entry point (port 8083)
└── FrontEnd/                    # React + Vite app (proxies /bms -> :8083)
    ├── public/posters/          # local movie poster images used by the seeder
    └── src/
        ├── api/                 # Axios API modules (user, movie, theatre, show, booking)
        ├── components/          # Home, Login/Register, SingleMovie, BookShow, PaymentSuccess, ...
        ├── pages/               # Admin, Partner, Profile dashboards
        └── redux/               # store, userSlice, loaderSlice
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local, or Docker: `docker run -d -p 27017:27017 --name bms-mongo mongo:7`)
- A Stripe **test** account (for the secret key)

### 1. Backend
```bash
cd Backend
npm install
cp .env.example .env        # then fill in the values
npm start                   # nodemon, runs on http://localhost:8083
```

### 2. Frontend
```bash
cd FrontEnd
npm install
npm run dev                 # Vite dev server on http://localhost:5173, proxies /bms -> :8083
```

### 3. (Optional) Seed demo data
```bash
cd Backend
node seed.js
```
Creates demo accounts (password `Passw0rd!`): `admin@bms.com` (admin), `partner@bms.com` (partner), `user@bms.com` (user), plus 11 movies with local posters, theatres and shows.

### 4. Try a booking
Log in as `user@bms.com`, pick a movie → theatre → show → seats, and pay on the Stripe-hosted page with the test card `4242 4242 4242 4242` (any future expiry, any CVC).

## 🔑 Environment Variables (`Backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port — **must be 8083** (the Vite proxy target) |
| `MONGODB_URL` | MongoDB connection string |
| `SECRET_KEY` | JWT signing secret |
| `STRIPE_KEY` | Stripe **secret** (test) key — `sk_test_...` |
| `GMAIL_USER` | Gmail address for OTP / ticket emails (optional in local dev) |
| `GMAIL_APP_PASSWORD` | Gmail app password (optional in local dev) |

## 💳 Payment Flow (Stripe Checkout)

1. The client calls `POST /bms/bookings/createCheckoutSession` with the show, seats, and user; the server re-validates seat availability and creates a Checkout Session (seats and show stored in the session `metadata`).
2. The user pays on Stripe's hosted page and is redirected to `/payment-success?session_id=...`.
3. The client calls `POST /bms/bookings/confirmBooking`; the server verifies `payment_status === "paid"`, re-checks the seats, marks them booked, and creates the booking. Confirming the same session again (e.g. a page refresh) returns the existing booking.

Legacy endpoints (`makePayment`, `makePaymentAndBookShow`) that used tokenized-card payments via `react-stripe-checkout` are kept for reference but the app uses the hosted Checkout flow.

## 🔌 API (base path `/bms`)

| Resource | Endpoints |
|---|---|
| Users | `POST /users/register`, `POST /users/login`, `GET /users/getCurrentUser` 🔒, `POST /users/forgetPassword`, `POST /users/resetPassword` |
| Movies 🔒 | `GET /movies/getAllMovies`, `POST /movies/addMovie`, `PATCH /movies/updateMovie`, `DELETE /movies/deleteMovie/:id`, `GET /movies/movie/:id` |
| Theatres 🔒 | `POST /theatres/addTheatre`, `PATCH /theatres/updateTheatre`, `GET /theatres/getAllTheatres`, `GET /theatres/getAllTheatresByOwner`, `DELETE /theatres/deleteTheatre/:id` |
| Shows 🔒 | `POST /shows/addShow`, `PATCH /shows/updateShow`, `DELETE /shows/deleteShow/:id`, `POST /shows/getAllShowsByTheatre`, `POST /shows/getAllTheatersByMovie`, `POST /shows/getShowById` |
| Bookings 🔒 | `POST /bookings/createCheckoutSession`, `POST /bookings/confirmBooking`, `GET /bookings/getAllBookings`, `POST /bookings/bookShow`, `POST /bookings/makePayment`, `POST /bookings/makePaymentAndBookShow` |

🔒 = requires an `Authorization: Bearer <JWT>` header. All `/bms` routes are rate-limited to 100 requests per IP per 15 minutes.

## 🖥️ Frontend Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home — browse & search movies | logged-in |
| `/movie/:id` | Movie details + date picker + theatres | logged-in |
| `/book-show/:id` | Seat selection & payment | logged-in |
| `/payment-success` | Confirms the Stripe session, shows the ticket | logged-in |
| `/profile` | User's bookings | user |
| `/partner` | Theatre & show management | partner |
| `/admin` | Movie management & theatre approval | admin |
| `/login`, `/register`, `/forget`, `/reset` | Auth pages | public |