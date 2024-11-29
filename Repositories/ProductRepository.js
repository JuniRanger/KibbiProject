import Product from "../Models/ProductModel.js";
import Category from '../Models/CategoryModel.js';

// Guardar un producto
async function saveProduct(product) {
    try {
        console.log('Categoria id', product.categoriaId)
        const categoryId = product.categoriaId;
        const categoryDoc = await Category.findById(categoryId);

        if (!categoryDoc) {
            throw new Error("Categoría no encontrada");
        }

        const nombreCategoria = categoryDoc.nombre;
        delete product.categoriaId;

        const productWithCategoryName = {
            ...product,
            nombreCategoria,
        };

        const newProduct = new Product(productWithCategoryName);
        const savedProduct = await newProduct.save();

        return savedProduct;
    } catch (error) {
        console.error("Error al guardar el producto:", error.message);
        throw error;
    }
}

// Obtener productos por sus IDs
async function getProductsById(productIds) {
    try {
        const products = await Product.find({ _id: { $in: productIds } });

        if (!products.length) {
            throw new Error("Algunos productos no fueron encontrados");
        }

        return products;
    } catch (error) {
        console.error("Error al obtener productos por IDs:", error);
        throw error;
    }
}

// Obtener todos los productos
async function getAllProducts() {
    try {
        return await Product.find();
    } catch (error) {
        console.error("Error al obtener todos los productos:", error.message);
        throw error;
    }
}

// Obtener todos los productos con paginación
async function getAllProductsWithPagination(page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;
        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments();

        return {
            total,
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error("Error al obtener productos con paginación:", error);
        throw error;
    }
}

// Actualizar un producto
async function updateProduct(productId, productData) {
    try {
        const categoryDoc = await Category.findById(productData.categoriaId);

        if (!categoryDoc) {
            throw new Error("Categoría no encontrada");
        }

        const nombreCategoria = categoryDoc.nombre;
        delete productData.categoriaId;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { ...productData, nombreCategoria },
            { new: true }
        );

        if (!updatedProduct) {
            throw new Error("Producto no encontrado para actualizar");
        }

        return updatedProduct;
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        throw error;
    }
}

// Eliminar un producto
async function deleteProduct(productId) {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            throw new Error("Producto no encontrado para eliminar");
        }

        return deletedProduct;
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        throw error;
    }
}

async function getProductsByCategory(categoriaId, restauranteId){
    try {
        const products = await Product.find({
            categoriaId,
            restauranteId
        });
        return products;
    } catch (error) {
        throw new Error("Error al obtener los productos");
        
    }
}

export default {
    saveProduct,
    getProductsById,
    getAllProducts,
    getAllProductsWithPagination,
    updateProduct,
    deleteProduct,
    getProductsByCategory
};
