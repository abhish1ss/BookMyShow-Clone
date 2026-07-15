const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/UserController");
const { validateJWTToken } = require("../middleware/authorizationMiddleware");

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [user, partner] }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post("/register", registerUser);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Log in — sets the tokenForBMS httpOnly cookie
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.post("/login", loginUser);

/**
 * @openapi
 * /users/logout:
 *   post:
 *     tags: [Users]
 *     summary: Log out — clears the tokenForBMS cookie
 *     security: []
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 */
router.post("/logout", logoutUser);

/**
 * @openapi
 * /users/getCurrentUser:
 *   get:
 *     tags: [Users]
 *     summary: Get the logged-in user's details
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get("/getCurrentUser", validateJWTToken, currentUser);

/**
 * @openapi
 * /users/forgetPassword:
 *   post:
 *     tags: [Users]
 *     summary: Send a password-reset OTP to the user's email
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.post("/forgetPassword", forgetPassword);

/**
 * @openapi
 * /users/resetPassword:
 *   post:
 *     tags: [Users]
 *     summary: Reset the password using the emailed OTP
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp, password]
 *             properties:
 *               otp: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { $ref: '#/components/responses/Success' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.post("/resetPassword", resetPassword);

module.exports = router;
