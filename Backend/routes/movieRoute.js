const {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
} = require("../controllers/movieController");

const router = require("express").Router();

/**
 * @openapi
 * /movies/movie/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Get a movie by id
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get("/movie/:id", getMovieById);

/**
 * @openapi
 * /movies/addMovie:
 *   post:
 *     tags: [Movies]
 *     summary: Add a movie (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieName]
 *             properties:
 *               movieName: { type: string }
 *               description: { type: string }
 *               duration: { type: number }
 *               genre: { type: string }
 *               language: { type: string }
 *               releaseDate: { type: string, format: date }
 *               poster: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post("/addMovie", addMovie);

/**
 * @openapi
 * /movies/getAllMovies:
 *   get:
 *     tags: [Movies]
 *     summary: List all movies
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.get("/getAllMovies", getAllMovies);

/**
 * @openapi
 * /movies/updateMovie:
 *   patch:
 *     tags: [Movies]
 *     summary: Update a movie (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId]
 *             properties:
 *               movieId: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch("/updateMovie", updateMovie);

/**
 * @openapi
 * /movies/deleteMovie/{movieId}:
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie (admin)
 *     parameters:
 *       - { in: path, name: movieId, required: true, schema: { type: string } }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete("/deleteMovie/:movieId", deleteMovie);

module.exports = router;
