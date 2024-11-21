import Category from "../Models/CategoryModel.js";
import categoryRepository from '../Repositories/CategoryRepository.js'

async function addCategory(data){
    try {

        const newCategory = {
            nombre: data.nombre,
            restaurantId: data.restaurantId
        }

        const categoryId = await categoryRepository.saveCategory(newCategory)

        return {id: categoryId, ...newCategory}
    } catch (error) {  
        console.error(error)
        throw error
    }
}


const getAllCategoriesWithPagination = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit; // Calcular el número de saltos para la paginación
    const categories = await categoryRepository.getCategoriesWithPagination(skip, limit); // Llamar al repositorio con los valores calculados
    const totalCategories = await categoryRepository.countCategories(); // Obtener el total de categorías para saber la cantidad de páginas
    const totalPages = Math.ceil(totalCategories / limit); // Calcular el número total de páginas
    return { categories, totalPages, totalCategories };
};

async function getTotalCategories() {
    return await categoryRepository.countCategories();
};

// Obtener una categoría por su ID
async function getCategoryById(id) {
    try {
        const categoryData = await categoryRepository.getCategoryById(id);

        if (!categoryData) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        return { id: categoryData.id, ...categoryData };
    } catch (error) {
        console.error(error);
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

        const updatedCategory = {
            ...categoryData,
            ...data
        };

        await categoryRepository.updateCategory(id, updatedCategory);

        return { id, ...updatedCategory };
    } catch (error) {
        console.error(error);
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
        console.error(error);
        throw error;
    }
}

export default {
    addCategory,
    getAllCategoriesWithPagination,
    getTotalCategories
}