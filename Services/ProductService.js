import productRepository from "../Repositories/ProductRepository.js";

async function addProduct(productData) {
    try {
        const product = {
            nombre: productData.nombre,
            precio: productData.precio,
            categoriaId: productData.categoriaId,
            descripcion: productData.descripcion,
            disponibilidad: productData.disponibilidad,
            imagenes: productData.imagenes,
            restauranteId: productData.restauranteId,
        };

        console.log("Productos que se estan enviando:", product)
        const productId = await productRepository.saveProduct(product);
        return { id: productId, ...product };
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        throw error;
    }
}

// Obtener todos los productos con paginación
async function getAllProductsWithPagination(page = 1, limit = 10) {
    try {
        const skip = (page);
        return await productRepository.getAllProductsWithPagination(skip, limit);
    } catch (error) {
        console.error("Error al obtener productos con paginación:", error);
        throw error;
    }
}

// Obtener todos los productos sin paginación
async function getAllProducts() {
    try {
        return await productRepository.getAllProducts();
    } catch (error) {
        console.error("Error al obtener todos los productos:", error);
        throw error;
    }
}

// Obtener producto por ID
async function getProductById(productId) {
    try {
        return await productRepository.getProductById(productId);
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        throw error;
    }
}

// Actualizar producto
async function updateProduct(productId, productData) {
    try {
        return await productRepository.updateProduct(productId, productData);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        throw error;
    }
}

// Eliminar producto
async function deleteProduct(productId) {
    try {
        return await productRepository.deleteProduct(productId);
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        throw error;
    }
}

export default {
    addProduct,
    getAllProductsWithPagination,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
