import mongoose from "mongoose";
import Category from "../Models/CategoryModel.js";
import Restaurant from "../Models/RestaurantModel.js";

// Obtener categorías con paginación
async function getCategoriesWithPagination(skip, limit) {
    try {
        const categories = await Category.find()
            .skip(skip)
            .limit(limit)
            .lean(); // Devuelve documentos como objetos planos para mejorar el rendimiento
        return categories;
    } catch (error) {
        console.error("Error al obtener categorías con paginación:", error);
        throw error;
    }
}

// Contar el total de categorías
async function countCategories() {
    try {
        const totalCategories = await Category.countDocuments();
        return totalCategories;
    } catch (error) {
        console.error("Error al contar categorías:", error);
        throw error;
    }
}

// Guardar una nueva categoría
async function saveCategory(categoryData) {
    try {
        const { nombre, restaurantId } = categoryData;

        // Validar si el restaurantId es válido
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            throw new Error("ID de restaurante no es válido");
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            throw new Error("Restaurante no encontrado");
        }

        // Verificar si la categoría ya existe en el restaurante
        if (restaurant.categorias.includes(nombre)) {
            throw new Error("La categoría ya existe en el restaurante");
        }

        // Guardar la nueva categoría
        const category = await new Category(categoryData).save();

        // Agregar la categoría al restaurante
        restaurant.categorias.push(category._id);
        await restaurant.save();

        console.log("Categoría guardada con el ID:", category._id);

        return { categoryId: category._id, restaurantId, nombre };
    } catch (error) {
        console.error("Error al guardar categoría:", error);
        throw error;
    }
}

// Obtener una categoría por ID
async function getCategoryById(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("ID de categoría no es válido");
        }

        const category = await Category.findById(id).lean();

        if (!category) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        return category;
    } catch (error) {
        console.error("Error al obtener categoría por ID:", error);
        throw error;
    }
}

// Actualizar una categoría
async function updateCategory(id, updatedCategoryData) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("ID de categoría no es válido");
        }

        const category = await Category.findByIdAndUpdate(id, updatedCategoryData, {
            new: true, // Devuelve la categoría actualizada
            runValidators: true, // Ejecuta validadores definidos en el esquema
        }).lean();

        if (!category) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        return category;
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        throw error;
    }
}

// Eliminar una categoría
async function deleteCategory(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("ID de categoría no es válido");
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        // Eliminar la categoría de la lista del restaurante
        const restaurant = await Restaurant.findById(category.restaurantId);
        if (restaurant) {
            restaurant.categorias = restaurant.categorias.filter(
                (catId) => catId.toString() !== id
            );
            await restaurant.save();
        }

        return { message: `Categoría con ID ${id} eliminada exitosamente` };
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        throw error;
    }
}

async function findCategoriesByRestaurantId(restaurantId) {
    try {
        const categories = await Category.find({ restaurantId })
        return categories
    } catch (error) {
        throw new Error("Error al acceder a la db" + error.message);
        
    }
}

export default {
    getCategoriesWithPagination,
    countCategories,
    saveCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    findCategoriesByRestaurantId
};
