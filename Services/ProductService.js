import Product from "../Models/ProductModel.js";
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
            restauranteId: productData.restauranteId
        };

        const productId = await productRepository.saveProduct(product);
        return { id: productId };
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        throw error;
    }
}

export default {
    addProduct
};

