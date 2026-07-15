const stripe = require("stripe")(process.env.STRIPE_KEY);
const Booking = require("../models/bookingSchema");
const Show = require("../models/showSchema");
const EmailHelper = require("../utils/emailHelper");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Atomically claims the seats and creates the booking inside a multi-document
// transaction (requires MongoDB running as a replica set — see README).
// The $nin filter makes the seat claim atomic per document: it only matches when
// none of the requested seats are already in bookedSeats, so of two concurrent
// requests for the same seat exactly one wins even without the transaction.
const claimSeatsAndBook = async ({ showId, seats, userId, transactionId }) => {
  if (!Array.isArray(seats) || seats.length === 0) {
    // an empty array would pass the $nin filter and create an empty booking
    throw new ApiError(400, "No seats selected");
  }
  const session = await mongoose.startSession();
  try {
    let booking;
    await session.withTransaction(async () => {
      const show = await Show.findOneAndUpdate(
        { _id: showId, bookedSeats: { $nin: seats } },
        { $push: { bookedSeats: { $each: seats } } },
        { new: true, session }
      );
      if (!show) {
        const exists = await Show.findById(showId).session(session);
        if (!exists) {
          throw new ApiError(404, "Show not found");
        }
        throw new ApiError(409, "One or more seats are already booked.");
      }
      // create() needs the array form to accept a session
      const [created] = await Booking.create(
        [{ show: showId, user: userId, seats, transactionId }],
        { session }
      );
      booking = created;
    });
    return booking;
  } finally {
    await session.endSession();
  }
};

// best-effort ticket email — a missing Gmail config must never fail a booking
const sendTicketEmail = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate({
        path: "show",
        populate: { path: "movie", model: "movies" },
      })
      .populate({
        path: "show",
        populate: { path: "theatre", model: "theatres" },
      });
    await EmailHelper("ticketTemplate.html", booking.user.email, {
      name: booking.user.name,
      movie: booking.show.movie.movieName,
      theatre: booking.show.theatre.name,
      date: booking.show.date,
      time: booking.show.time,
      seats: booking.seats,
      amount: booking.seats.length * booking.show.ticketPrice,
      transactionId: booking.transactionId,
    });
  } catch (mailErr) {
    console.log("Ticket email skipped:", mailErr.message);
  }
};

const getAllBookings = asyncHandler(async (req, res) => {
  // read transaction: snapshot read concern gives a consistent view of the
  // booking documents and their populated refs (requires the replica set)
  const session = await mongoose.startSession();
  try {
    let bookings;
    await session.withTransaction(
      async () => {
        bookings = await Booking.find({ user: req.body.userId })
          .populate("user")
          .populate("show")
          .populate({
            path: "show",
            populate: { path: "movie", model: "movies" },
          })
          .populate({
            path: "show",
            populate: { path: "theatre", model: "theatres" },
          })
          .session(session);
      },
      { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } }
    );
    res.send({
      success: true,
      message: "Bookings fetched!",
      data: bookings,
    });
  } finally {
    await session.endSession();
  }
});

// ---- Stripe Checkout (hosted payment page) ----
// createCheckoutSession starts the payment; confirmBooking finalises the
// booking when the user returns to the success_url.
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { showId, seats, userId } = req.body;
  if (!Array.isArray(seats) || seats.length === 0) {
    throw new ApiError(400, "No seats selected");
  }
  const show = await Show.findById(showId)
    .populate("movie")
    .populate("theatre");
  if (!show) {
    throw new ApiError(404, "Show not found");
  }
  // advisory pre-check for early feedback; claimSeatsAndBook is the enforcement point
  const alreadyBooked = seats.some((s) => show.bookedSeats.includes(s));
  if (alreadyBooked) {
    throw new ApiError(409, "One or more seats are already booked.");
  }

  const origin = req.headers.origin || "http://localhost:5173";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `${show.movie.movieName} @ ${show.theatre.name}`,
            description: `${show.name} | Seats: ${seats.join(", ")}`,
          },
          unit_amount: show.ticketPrice * 100, // price per seat, in paise
        },
        quantity: seats.length,
      },
    ],
    success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/book-show/${showId}`,
    metadata: {
      showId: String(showId),
      userId: String(userId),
      seats: JSON.stringify(seats),
    },
  });

  res.send({
    success: true,
    message: "Checkout session created",
    data: { id: session.id, url: session.url },
  });
});

const confirmBooking = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session || session.payment_status !== "paid") {
    throw new ApiError(400, "Payment not completed.");
  }

  const transactionId = session.payment_intent || session.id;

  // idempotent: if this session was already booked (e.g. page refresh), return it
  const already = await Booking.findOne({ transactionId });
  if (already) {
    return res.send({
      success: true,
      message: "Booking already confirmed!",
      data: already,
    });
  }

  const { showId, userId, seats: seatsJson } = session.metadata;
  const seats = JSON.parse(seatsJson);

  const booking = await claimSeatsAndBook({
    showId,
    seats,
    userId,
    transactionId,
  });

  res.send({
    success: true,
    message: "Payment and Booking successful!",
    data: booking,
  });

  await sendTicketEmail(booking._id);
});

module.exports = {
  getAllBookings,
  createCheckoutSession,
  confirmBooking,
};
