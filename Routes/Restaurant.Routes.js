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
 *     description: Crea un nuevo restaurante y lo guarda en la base de datos. Requiere autenticación y los datos del restaurante en el cuerpo de la solicitud.
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
 *                 description: Nombre del restaurante
 *                 example: "Restaurante La Esquina"
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del restaurante
 *                 example: "contacto@restaurante.com"
 *               telefono:
 *                 type: string
 *                 description: Teléfono del restaurante
 *                 example: "+123456789"
 *               direccion:
 *                 type: string
 *                 description: Dirección del restaurante
 *                 example: "Calle Falsa 123, Ciudad, País"
 *     responses:
 *       201:
 *         description: Restaurante creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurantData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID del restaurante recién creado
 *                       example: "63f1e5bcf4d3c2a1f8e7babc"
 *                     nombre:
 *                       type: string
 *                       description: Nombre del restaurante
 *                       example: "Restaurante La Esquina"
 *                     correo:
 *                       type: string
 *                       description: Correo del restaurante
 *                       example: "contacto@restaurante.com"
 *                     telefono:
 *                       type: string
 *                       description: Teléfono del restaurante
 *                       example: "+123456789"
 *                     direccion:
 *                       type: string
 *                       description: Dirección del restaurante
 *                       example: "Calle Falsa 123, Ciudad, País"
 *                     userId:
 *                       type: string
 *                       description: ID del usuario que creó el restaurante
 *                       example: "63f1e5bcf4d3c2a1f8e7bdef"
 *       500:
 *         description: Error en el servidor al crear el restaurante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al crear el restaurante"
 */
router.post('/', async (req, res) => {
    try {
        const restaurantData = await restaurantService.addRestaurant({
            nombre: req.body.nombre,
            correo: req.body.correo,
            telefono: req.body.telefono,
            direccion: req.body.direccion,
            city: req.body.city,
            userId: req.user.id
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
 *     description: Devuelve una lista de todos los restaurantes almacenados en la base de datos.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de restaurantes obtenida exitosamente
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
 *                       id:
 *                         type: string
 *                         description: ID del restaurante
 *                         example: "63f1e5bcf4d3c2a1f8e7babc"
 *                       nombre:
 *                         type: string
 *                         description: Nombre del restaurante
 *                         example: "Restaurante La Esquina"
 *                       correo:
 *                         type: string
 *                         description: Correo del restaurante
 *                         example: "contacto@restaurante.com"
 *                       telefono:
 *                         type: string
 *                         description: Teléfono del restaurante
 *                         example: "+123456789"
 *                       direccion:
 *                         type: string
 *                         description: Dirección del restaurante
 *                         example: "Calle Falsa 123, Ciudad, País"
 *                       userId:
 *                         type: string
 *                         description: ID del usuario propietario del restaurante
 *                         example: "63f1e5bcf4d3c2a1f8e7bdef"
 *       500:
 *         description: Error en el servidor al obtener los restaurantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al obtener los restaurantes"
 */
router.get('/', async (req, res) => {
    try {
        const { ciudad, pageSize, lastDoc} = req.query;

        if(!city) {
            return res.status(400).json({ error: 'La ciudad es requerida'});
        }

        const pageSizeNum = parseInt(pageSize) || 20;
        const restaurants = await restaurantService.getAllRestaurants(
            ciudad,
            pageSizeNum,
            lastDoc
        )
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
 *     description: Devuelve los detalles de un restaurante específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del restaurante
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID del restaurante
 *                   example: "63f1e5bcf4d3c2a1f8e7babc"
 *                 nombre:
 *                   type: string
 *                   description: Nombre del restaurante
 *                   example: "Restaurante La Esquina"
 *                 correo:
 *                   type: string
 *                   description: Correo del restaurante
 *                   example: "contacto@restaurante.com"
 *                 telefono:
 *                   type: string
 *                   description: Teléfono del restaurante
 *                   example: "+123456789"
 *                 direccion:
 *                   type: string
 *                   description: Dirección del restaurante
 *                   example: "Calle Falsa 123, Ciudad, País"
 *       404:
 *         description: Restaurante no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Restaurante no encontrado"
 *       500:
 *         description: Error en el servidor al obtener el restaurante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al obtener el restaurante"
 */
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await restaurantService.getRestaurantById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurante no encontrado" });
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
 *     summary: Actualizar un restaurante por ID
 *     tags: [Restaurants]
 *     description: Actualiza los datos de un restaurante específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del restaurante a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del restaurante
 *               correo:
 *                 type: string
 *                 description: Correo del restaurante
 *               telefono:
 *                 type: string
 *                 description: Teléfono del restaurante
 *               direccion:
 *                 type: string
 *                 description: Dirección del restaurante
 *     responses:
 *       200:
 *         description: Restaurante actualizado exitosamente
 *       400:
 *         description: Datos inválidos proporcionados
 *       404:
 *         description: Restaurante no encontrado
 *       500:
 *         description: Error al actualizar el restaurante
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedRestaurant = await restaurantService.updateRestaurant(req.params.id, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ error: "Restaurante no encontrado" });
        }
        res.status(200).json({ restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Eliminar un restaurante por ID
 *     tags: [Restaurants]
 *     description: Elimina un restaurante específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del restaurante a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante eliminado exitosamente
 *       404:
 *         description: Restaurante no encontrado
 *       500:
 *         description: Error al eliminar el restaurante
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedRestaurant = await restaurantService.deleteRestaurant(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({ error: "Restaurante no encontrado" });
        }
        res.status(200).json({ message: "Restaurante eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
