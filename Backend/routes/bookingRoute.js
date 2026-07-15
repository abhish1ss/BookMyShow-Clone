const router = require("express").Router();
const {
  getAllBookings,
  createCheckoutSession,
  confirmBooking,
} = require("../controllers/bookingController");

/**
 * @openapi
 * /bookings/getAllBookings:
 *   get:
 *     tags: [Bookings]
 *     summary: List the logged-in user's bookings (snapshot read transaction)
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.get("/getAllBookings", getAllBookings);

/**
 * @openapi
 * /bookings/createCheckoutSession:
 *   post:
 *     tags: [Bookings]
 *     summary: Start a hosted Stripe Checkout for the selected seats
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [showId, seats, userId]
 *             properties:
 *               showId: { type: string }
 *               seats: { type: array, items: { type: number } }
 *               userId: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post("/createCheckoutSession", createCheckoutSession);

/**
 * @openapi
 * /bookings/confirmBooking:
 *   post:
 *     tags: [Bookings]
 *     summary: Verify the paid Checkout session and book atomically (idempotent)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId]
 *             properties:
 *               sessionId: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post("/confirmBooking", confirmBooking);

module.exports = router;
