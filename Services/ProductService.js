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
        const newProduct = await productRepository.saveProduct(product);
        return { newProduct };
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
        return await productRepository.getProductsById(productId);
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

async function getProductsByCatId(categoriaId, restauranteId){
    if (!categoriaId || !restauranteId) {
        throw new Error('El ID de la categoría y el ID del restaurante son requeridos');
    }

    const products = await productRepository.getProductsByCategory(categoriaId, restauranteId);

    if (!products || products.length === 0) {
        throw new Error('No se encontraron productos para esta categoría y restaurante');
    }

    return products;
}

async function getProductsByRestaurant(restaurantId) {
    try {
        const products = await productRepository.getProductsByRestaurant(restaurantId);
        // No ordenar los productos
        return products; // Devuelve los productos tal como están
    } catch (error) {
        console.error("Error al obtener productos por restaurante:", error);
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
    getProductsByCatId,
    getProductsByRestaurant
};
