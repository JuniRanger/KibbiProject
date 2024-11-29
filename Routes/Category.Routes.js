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
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la categoría
 *           example: "64fdf4e13eeb95ff"
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría
 *           example: "Comida rápida"
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 *           example: "Categoría para alimentos rápidos"
 *         restaurantId:
 *           type: string
 *           description: ID del restaurante asociado
 *           example: "123456789"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *  
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API para la gestión de categorías
 */

// Agregar una categoría
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Agregar una nueva categoría
 *     tags: [Categories]
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
 *                 example: "Comida rápida"
 *               restaurantId:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error en el servidor
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

// Obtener todas las categorías paginadas
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías paginadas
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: Categorías obtenidas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error en el servidor
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const categories = await categoryService.getAllCategoriesWithPagination(parseInt(page), parseInt(limit));
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una categoría por ID
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una categoría
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ category: updatedCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar una categoría
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await categoryService.deleteCategory(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const categories = await categoryService.getCategoriesByRestaurant(restaurantId);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default router;
