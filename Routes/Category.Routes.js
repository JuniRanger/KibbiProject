import express from 'express';
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
 *  
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Agregar una nueva categoría
 *     tags: [Categories]
 *     description: Crea una nueva categoría y la guarda en la base de datos. Requiere autenticación y los datos de la categoría en el cuerpo de la solicitud.
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
 *                 description: Nombre de la categoría
 *                 example: "Comida rápida"
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la categoría
 *                 example: "Categoría que agrupa comida rápida como hamburguesas y pizzas"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoryData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la categoría recién creada
 *                       example: "63f1e5bcf4d3c2a1f8e7babc"
 *                     nombre:
 *                       type: string
 *                       description: Nombre de la categoría
 *                       example: "Comida rápida"
 *                     descripcion:
 *                       type: string
 *                       description: Descripción de la categoría
 *                       example: "Categoría que agrupa comida rápida como hamburguesas y pizzas"
 *       500:
 *         description: Error en el servidor al crear la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al crear la categoría"
 */
router.post('/', async (req, res) => {
    try {
        const categoryData = await categoryService.addCategory({
            nombre: req.body.nombre,
            restaurantId: req.body.restaurantId
        });

        res.status(201).json({ categoryData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías paginadas
 *     tags: [Categories]
 *     description: Devuelve una lista de categorías paginadas.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Página actual para la paginación (empezando desde 1)
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Número de categorías por página
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID de la categoría
 *                         example: "63f1e5bcf4d3c2a1f8e7babc"
 *                       nombre:
 *                         type: string
 *                         description: Nombre de la categoría
 *                         example: "Comida rápida"
 *                       descripcion:
 *                         type: string
 *                         description: Descripción de la categoría
 *                         example: "Categoría que agrupa comida rápida como hamburguesas y pizzas"
 *       400:
 *         description: Los parámetros de paginación no son válidos
 *       500:
 *         description: Error en el servidor al obtener las categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al obtener las categorías"
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const categories = await categoryService.getAllCategoriesWithPagination(pageNum, limitNum);

        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categories]
 *     description: Devuelve los detalles de una categoría específica por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de la categoría
 *                   example: "63f1e5bcf4d3c2a1f8e7babc"
 *                 nombre:
 *                   type: string
 *                   description: Nombre de la categoría
 *                   example: "Comida rápida"
 *                 descripcion:
 *                   type: string
 *                   description: Descripción de la categoría
 *                   example: "Categoría que agrupa comida rápida como hamburguesas y pizzas"
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Categoría no encontrada"
 *       500:
 *         description: Error en el servidor al obtener la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al obtener la categoría"
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID
 *     tags: [Categories]
 *     description: Actualiza los datos de una categoría específica por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar
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
 *                 description: Nombre de la categoría
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la categoría
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       400:
 *         description: Datos inválidos proporcionados
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al actualizar la categoría
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
        if (!updatedCategory) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        res.status(200).json({ category: updatedCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría por ID
 *     tags: [Categories]
 *     description: Elimina una categoría específica por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al eliminar la categoría
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await categoryService.deleteCategory(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        res.status(200).json({ message: "Categoría eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
