import express from 'express'
import productService from '../Services/ProductService.js'

const router = express.Router()

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
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []  # Añadido el token de autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - categoriaId
 *               - descripcion
 *               - disponibilidad
 *               - imagenes
 *               - restauranteId
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *               precio:
 *                 type: number
 *                 description: Precio del producto
 *               categoriaId:
 *                 type: string
 *                 description: ID de la categoría asociada al producto
 *               descripcion:
 *                 type: string
 *                 description: Descripción del producto
 *               disponibilidad:
 *                 type: boolean
 *                 description: Disponibilidad del producto
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de URLs de imágenes del producto
 *               restauranteId:
 *                 type: string
 *                 description: ID del restaurante asociado al producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 *       500:
 *         description: Error en el servidor
 */
router.post('/', async (req, res) => {
    try {
        const productData = await productService.addProduct({
            nombre: req.body.nombre,
            precio: req.body.precio,
            categoriaId: req.body.categoriaId,
            descripcion: req.body.descripcion,
            disponibilidad: req.body.disponibilidad,
            imagenes: req.body.imagenes,
            restauranteId: req.body.restauranteId
        });
        res.status(201).json({ productData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []  # Añadido el token de autenticación
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *       500:
 *         description: Error al obtener los productos
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
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []  # Añadido el token de autenticación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []  # Añadido el token de autenticación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - categoriaId
 *               - descripcion
 *               - disponibilidad
 *               - imagenes
 *               - restauranteId
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoriaId:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               disponibilidad:
 *                 type: boolean
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *               restauranteId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar el producto
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []  # Añadido el token de autenticación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar el producto
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
