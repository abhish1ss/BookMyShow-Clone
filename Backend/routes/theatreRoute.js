const {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  getAllTheatresByOwner,
} = require("../controllers/theatreController");
const router = require("express").Router();

/**
 * @openapi
 * /theatres/addTheatre:
 *   post:
 *     tags: [Theatres]
 *     summary: Register a theatre (partner)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address]
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               phone: { type: number }
 *               email: { type: string }
 *               owner: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.post("/addTheatre", addTheatre);

/**
 * @openapi
 * /theatres/updateTheatre:
 *   patch:
 *     tags: [Theatres]
 *     summary: Update a theatre (partner edits, admin approves via isActive)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [theatreId]
 *             properties:
 *               theatreId: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch("/updateTheatre", updateTheatre);

/**
 * @openapi
 * /theatres/deleteTheatre/{theatreId}:
 *   delete:
 *     tags: [Theatres]
 *     summary: Delete a theatre
 *     parameters:
 *       - { in: path, name: theatreId, required: true, schema: { type: string } }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete("/deleteTheatre/:theatreId", deleteTheatre);

/**
 * @openapi
 * /theatres/getAllTheatres:
 *   get:
 *     tags: [Theatres]
 *     summary: List all theatres (admin)
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.get("/getAllTheatres", getAllTheatres);

/**
 * @openapi
 * /theatres/getAllTheatresByOwner:
 *   get:
 *     tags: [Theatres]
 *     summary: List the logged-in partner's theatres
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.get("/getAllTheatresByOwner", getAllTheatresByOwner);

module.exports = router;
