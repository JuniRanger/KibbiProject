import express from 'express';
import orderService from '../Services/OrderService.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - id
 *         - item
 *         - quantity
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: ID de la orden
 *         item:
 *           type: string
 *           description: Nombre del artículo en la orden
 *         quantity:
 *           type: integer
 *           description: Cantidad del artículo
 *         price:
 *           type: number
 *           format: float
 *           description: Precio total del artículo
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtiene todas las órdenes con paginación
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Orders
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
 *         description: Número de órdenes por página
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 lastDoc:
 *                   type: string
 *                   description: ID del último documento para la paginación
 *       401:
 *         description: No autorizado, falta token de autenticación
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;  // Parámetros de paginación
        const pageNum = parseInt(page);  // Convertir a número entero
        const limitNum = parseInt(limit);  // Convertir a número entero

        // Llamamos al servicio para obtener las órdenes con paginación
        const orders = await orderService.getAllOrdersWithPagination(pageNum, limitNum);

        // Retornamos las órdenes obtenidas
        res.json({
            orders
        });
    } catch (error) {
        next(error);  // Manejo de errores
    }
});


/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtiene una orden por ID
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la orden a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada con el ID proporcionado
 *       401:
 *         description: No autorizado, falta token de autenticación
 */
router.get('/:id', async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crea una nueva orden
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Error en los datos de la solicitud
 *       401:
 *         description: No autorizado, falta token de autenticación
 */
router.post('/', async (req, res, next) => {
    try {
        const newOrder = await orderService.addOrder({
            usuarioId: req.user.id,
            restauranteId: req.body.restauranteId,
            productsIds: req.body.productsIds,
            estado: req.body.estado,
            fechaHoraEntrega: req.body.fechaHoraEntrega,
            notas: req.body.notas
        });
        res.status(201).json({ order: newOrder });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Actualiza una orden por ID
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la orden a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *       400:
 *         description: Error en los datos de la solicitud
 *       404:
 *         description: Orden no encontrada con el ID proporcionado
 *       401:
 *         description: No autorizado, falta token de autenticación
 */
router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatedOrder = await orderService.updateOrder(id, {
            usuarioId: req.user.id,
            restauranteId: req.body.restauranteId,
            productos: req.body.productos,
            estado: req.body.estado,
            fechaHoraEntrega: req.body.fechaHoraEntrega,
            notas: req.body.notas
        });

        if (!updatedOrder) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Elimina una orden por ID
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la orden a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden eliminada exitosamente
 *       404:
 *         description: Orden no encontrada con el ID proporcionado
 *       401:
 *         description: No autorizado, falta token de autenticación
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await orderService.deleteOrder({
            id: req.params.id,
            usuarioId: req.user.id,
            restauranteId: req.body.restauranteId,
            productos: req.body.productos,
            estado: req.body.estado,
            fechaHoraEntrega: req.body.fechaHoraEntrega,
            notas: req.body.notas
        });
        if (!result) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        res.json({ message: "Orden eliminada exitosamente" });
    } catch (error) {
        next(error);
    }
});

export default router;
