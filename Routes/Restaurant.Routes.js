import express from 'express';
import restaurantService from '../Services/RestaurantService.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * security:
 *   - BearerAuth: []
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
 *                  type: string
 *                  exampe: "Ciudad falsa"
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
 *     summary: Obtener todos los restaurantes
 *     tags: [Restaurants]
 *     description: Devuelve todos los restaurantes de la base de datos.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de restaurantes obtenida
 *       500:
 *         description: Error en el servidor
 */
router.get('/', async (req, res) => {
    try {
        const restaurants = await restaurantService.getAllRestaurants();
        res.status(200).json({ restaurants });
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

export default router;
