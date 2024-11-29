import Category from "../Models/CategoryModel.js";
import categoryRepository from "../Repositories/CategoryRepository.js";

// Agregar una categoría
async function addCategory(data) {
    try {
        const newCategory = {
            nombre: data.nombre,
            restaurantId: data.restaurantId
        };

        const categoryId = await categoryRepository.saveCategory(newCategory);
        return { id: categoryId, ...newCategory };
    } catch (error) {
        console.error("Error al agregar categoría:", error);
        throw error;
    }
}

// Obtener todas las categorías con paginación
const getAllCategoriesWithPagination = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const categories = await categoryRepository.getCategoriesWithPagination(skip, limit);
        const totalCategories = await categoryRepository.countCategories();
        const totalPages = Math.ceil(totalCategories / limit);

        return { categories, totalPages, totalCategories };
    } catch (error) {
        console.error("Error al obtener categorías con paginación:", error);
        throw error;
    }
};

// Obtener el total de categorías
async function getTotalCategories() {
    try {
        const totalCategories = await categoryRepository.countCategories();
        return totalCategories;
    } catch (error) {
        console.error("Error al obtener el total de categorías:", error);
        throw error;
    }
}

// Obtener una categoría por su ID
async function getCategoryById(id) {
    try {
        const categoryData = await categoryRepository.getCategoryById(id);

        if (!categoryData) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        return categoryData;
    } catch (error) {
        console.error("Error al obtener categoría por ID:", error);
        throw error;
    }
}

// Actualizar una categoría
async function updateCategory(id, data) {
    try {
        const categoryData = await categoryRepository.getCategoryById(id);

        if (!categoryData) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        const updatedCategory = await categoryRepository.updateCategory(id, data);
        return updatedCategory;
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        throw error;
    }
}

// Eliminar una categoría
async function deleteCategory(id) {
    try {
        const categoryData = await categoryRepository.getCategoryById(id);

        if (!categoryData) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        await categoryRepository.deleteCategory(id);
        return { message: `Categoría con ID ${id} eliminada exitosamente` };
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        throw error;
    }
}

// Obtener todas las categorías (sin paginación)
async function getAllCategories() {
    try {
        const categories = await categoryRepository.getAllCategories();
        return categories;
    } catch (error) {
        console.error("Error al obtener todas las categorías:", error);
        throw error;
    }
}

async function getCategoriesByRestaurantId(restaurantId){
    if (!restaurantId) {
        throw new Error('El ID del restaurante es requerido');
    }

    const categories = await categoryRepository.getCategoriesByRestaurant(restaurantId);

    if (!categories || categories.length === 0) {
        throw new Error('No se encontraron categorías para este restaurante');
    }

    return categories;
}

export default {
    addCategory,
    getAllCategoriesWithPagination,
    getTotalCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoriesByRestaurantId
};
