const {
  addShow,
  deleteShow,
  updateShow,
  getAllShowsByTheatre,
  getAllTheatersByMovie,
  getShowsById,
} = require("../controllers/showController");

const router = require("express").Router();

/**
 * @openapi
 * /shows/addShow:
 *   post:
 *     tags: [Shows]
 *     summary: Schedule a show (partner)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, date, time, movie, theatre, ticketPrice, totalSeats]
 *             properties:
 *               name: { type: string }
 *               date: { type: string, format: date }
 *               time: { type: string, example: "18:30" }
 *               movie: { type: string }
 *               theatre: { type: string }
 *               ticketPrice: { type: number }
 *               totalSeats: { type: number }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.post("/addShow", addShow);

/**
 * @openapi
 * /shows/deleteShow/{showId}:
 *   delete:
 *     tags: [Shows]
 *     summary: Delete a show
 *     parameters:
 *       - { in: path, name: showId, required: true, schema: { type: string } }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete("/deleteShow/:showId", deleteShow);

/**
 * @openapi
 * /shows/updateShow:
 *   patch:
 *     tags: [Shows]
 *     summary: Update a show
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [showId]
 *             properties:
 *               showId: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch("/updateShow", updateShow);

/**
 * @openapi
 * /shows/getAllShowsByTheatre:
 *   post:
 *     tags: [Shows]
 *     summary: List shows for a theatre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [theatreId]
 *             properties:
 *               theatreId: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.post("/getAllShowsByTheatre", getAllShowsByTheatre);

/**
 * @openapi
 * /shows/getAllTheatersByMovie:
 *   post:
 *     tags: [Shows]
 *     summary: List theatres (with shows) screening a movie on a date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movie, date]
 *             properties:
 *               movie: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.post("/getAllTheatersByMovie", getAllTheatersByMovie);

/**
 * @openapi
 * /shows/getShowById:
 *   post:
 *     tags: [Shows]
 *     summary: Get a show with its movie and theatre populated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [showId]
 *             properties:
 *               showId: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.post("/getShowById", getShowsById);

module.exports = router;
