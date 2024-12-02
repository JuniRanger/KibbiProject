import express from 'express';
import restaurantService from '../Services/RestaurantService.js';
import categoryService from '../Services/CategoryService.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Agregar un nuevo restaurante
 *     tags: [Restaurants]
 *     description: Crea un nuevo restaurante y lo guarda en la base de datos.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Restaurante de prueba del famoso gustavo string"
 *               correo:
 *                 type: string
 *                 example: "contacto@restaurante.com"
 *               telefono:
 *                 type: string
 *                 example: "+123456789"
 *               direccion:
 *                 type: string
 *                 example: "Calle Falsa 123, Ciudad, País"
 *               city:
 *                 type: string
 *                 example: "Ciudad falsa"
 *     responses:
 *       201:
 *         description: Restaurante creado exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.post('/', async (req, res) => {
    try {
        const restaurantData = await restaurantService.addRestaurant({
            nombre: req.body.nombre,
            correo: req.body.correo,
            telefono: req.body.telefono,
            direccion: req.body.direccion,
            userId: req.user.id,
            city: req.body.city
        });

        res.status(201).json({ restaurantData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Obtener todos los restaurantes con paginación
 *     tags: [Restaurants]
 *     description: Devuelve todos los restaurantes de la base de datos con paginación.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Página actual para la paginación (empezando desde 1)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Número de restaurantes por página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de restaurantes obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                       correo:
 *                         type: string
 *                       telefono:
 *                         type: string
 *                       direccion:
 *                         type: string
 *                       city:
 *                         type: string
 *                 total:
 *                   type: integer
 *                   description: Total de restaurantes
 *                 currentPage:
 *                   type: integer
 *                   description: Página actual
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *       500:
 *         description: Error en el servidor
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const { total, restaurants, currentPage, totalPages } = await restaurantService.getAllRestaurantsWithPagination(pageNum, limitNum);

        res.status(200).json({
            total,
            restaurants,
            currentPage,
            totalPages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Obtener un restaurante por ID
 *     tags: [Restaurants]
 *     description: Devuelve los detalles de un restaurante.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del restaurante
 *     responses:
 *       200:
 *         description: Restaurante obtenido
 *       404:
 *         description: Restaurante no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await restaurantService.getRestaurantById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }
        res.status(200).json({ restaurant });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Actualizar un restaurante
 *     tags: [Restaurants]
 *     description: Actualiza los detalles de un restaurante.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del restaurante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurante actualizado
 *       404:
 *         description: Restaurante no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedRestaurant = await restaurantService.updateRestaurant(req.params.id, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }
        res.status(200).json({ updatedRestaurant });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Eliminar un restaurante
 *     tags: [Restaurants]
 *     description: Elimina un restaurante de la base de datos.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del restaurante
 *     responses:
 *       200:
 *         description: Restaurante eliminado
 *       404:
 *         description: Restaurante no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedRestaurant = await restaurantService.deleteRestaurant(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }
        res.status(200).json({ message: 'Restaurante eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//obtener todas las categorias de un restaurante
router.get('/:id/categories', async(req, res, next) =>{
    try {
        const restaurantId = req.params.id;
        const categories = await categoryService.getCategoriesByRestaurantId(restaurantId);
        res.status(200).json(categories);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

//obtener restaurante por usuario
router.get('/user', async(req, res) => {
    try {
        const userId = req.user.id;
        const restaurants = await restaurantService.getRestaurantsByUserId(userId);
        res.status(200).json({ restaurants })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

export default router;
