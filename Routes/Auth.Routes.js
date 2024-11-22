import express from 'express';
import { check, validationResult } from 'express-validator';
import authService from '../Services/AuthService.js';
import userService from '../Services/UserService.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Operaciones relacionadas con usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         correo:
 *           type: string
 *           description: Correo electrónico del usuario
 *         telefono:
 *           type: string
 *           description: Teléfono del usuario
 *         direccion:
 *           type: string
 *           description: Dirección del usuario
 *         restaurantes:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de restaurantes asociados al usuario
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios con paginación
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                   description: Número total de usuarios
 *                 page:
 *                   type: integer
 *                   description: Página actual
 *                 limit:
 *                   type: integer
 *                   description: Límite de resultados por página
 *       500:
 *         description: Error en el servidor
 */
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const users = await userService.getAllUsersWithPagination(page, limit);
        const totalUsers = await userService.getTotalUsers(); // Ahora esta función existe

        res.status(200).json({
            users,
            total: totalUsers,
            page,
            limit,
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: error.message });
        console.log("Error en routes");
    }
});



/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del nuevo registro
 *               password:
 *                 type: string
 *                 description: Contraseña del nuevo registro
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               telefono:
 *                 type: string
 *                 description: Teléfono del usuario
 *               direccion:
 *                 type: string
 *                 description: Dirección del usuario
 *               restaurantes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la validación de los datos de entrada
 *       500:
 *         description: Error del servidor
 */
router.post(
    '/register',
    [
        check('username').isString().notEmpty().withMessage('El nombre de usuario es requerido'),
        check('password').isString().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        check('correo').isEmail().withMessage('El correo electrónico no es válido'),
        check('telefono').isString().notEmpty().withMessage('El número de teléfono es requerido'),
        check('direccion').isString().notEmpty().withMessage('La dirección es requerida'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, password, correo, telefono, direccion, restaurantes } = req.body;
            const userData = await authService.register({
                username,
                password,
                correo,
                telefono,
                direccion,
                restaurantes: restaurantes || [],
            });
            res.status(201).json(userData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicio de sesión para obtener un token JWT
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *       400:
 *         description: Credenciales incorrectas o error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
